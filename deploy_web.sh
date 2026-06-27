#!/bin/bash
# Secrets are read from the environment — never hardcode them in tracked files.
# Required before running (export from a secret store / untracked .env):
#   DB_PASSWORD       PostgreSQL password for the namasoft user
#   DATABASE_URL      Full Postgres connection string used by the app
#   JWT_SECRET        App JWT signing secret
#   SESSION_SECRET    App session secret
set -euo pipefail
: "${DB_PASSWORD:?Set DB_PASSWORD env var before running}"
: "${DATABASE_URL:?Set DATABASE_URL env var before running}"
: "${JWT_SECRET:?Set JWT_SECRET env var before running}"
: "${SESSION_SECRET:?Set SESSION_SECRET env var before running}"

echo "============================================"
echo "  Nama Medical Web - Full Server Setup"
echo "============================================"

echo ""
echo "=== [1/6] Installing Node.js 20 LTS ==="
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
else
    echo "Node.js already installed: $(node --version)"
fi

echo ""
echo "=== [2/6] Installing PostgreSQL ==="
if ! command -v psql &> /dev/null; then
    apt-get install -y postgresql postgresql-contrib
    systemctl enable postgresql
    systemctl start postgresql
else
    echo "PostgreSQL already installed: $(psql --version)"
    systemctl start postgresql
fi

# Create database and user
sudo -u postgres psql -c "CREATE USER namasoft WITH PASSWORD '${DB_PASSWORD}';" 2>/dev/null || echo "User already exists"
sudo -u postgres psql -c "CREATE DATABASE namasoft OWNER namasoft;" 2>/dev/null || echo "Database already exists"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE namasoft TO namasoft;" 2>/dev/null || true
sudo -u postgres psql -c "ALTER USER namasoft CREATEDB;" 2>/dev/null || true

echo ""
echo "=== [3/6] Installing Nginx ==="
if ! command -v nginx &> /dev/null; then
    apt-get install -y nginx
    systemctl enable nginx
else
    echo "Nginx already installed"
fi

echo ""
echo "=== [4/6] Installing PM2 ==="
npm install -g pm2 2>/dev/null || true

echo ""
echo "=== [5/6] Cloning & Setting Up App ==="
cd /var/www
rm -rf namaweb
git clone https://github.com/ialqrashi62/namawab.git namaweb
cd namaweb

# Create .env from environment-provided secrets (never commit real values).
# Unquoted heredoc so the exported vars expand; .env itself is git-ignored.
umask 077
cat > .env << ENVEOF
PORT=3000
DATABASE_URL=${DATABASE_URL}
JWT_SECRET=${JWT_SECRET}
SESSION_SECRET=${SESSION_SECRET}
NODE_ENV=production
ENVEOF

# Check if .env.example exists and merge missing values
if [ -f .env.example ]; then
    echo "Found .env.example, checking for additional config..."
    cat .env.example
fi

npm install

# Run setup/seed if available
if [ -f setup.js ]; then
    node setup.js || true
fi

echo ""
echo "=== [6/6] Configuring Nginx & Starting App ==="

# Nginx reverse proxy config
cat > /etc/nginx/sites-available/namaweb << 'NGINXEOF'
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINXEOF

ln -sf /etc/nginx/sites-available/namaweb /etc/nginx/sites-enabled/namaweb
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl restart nginx

# Start app with PM2
cd /var/www/namaweb
pm2 delete namaweb 2>/dev/null || true
pm2 start server.js --name namaweb
pm2 save
pm2 startup systemd -u root --hp /root 2>/dev/null || true

echo ""
echo "============================================"
echo "  DEPLOYMENT COMPLETE!"
echo "============================================"
echo "  Web App: http://$(curl -s ifconfig.me)"
echo "  PM2 Status:"
pm2 list
echo "============================================"
