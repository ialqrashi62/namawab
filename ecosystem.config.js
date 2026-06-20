// PM2 ecosystem for NamaMedical app (secrets-free; DB/Redis creds load from .env via dotenv).
// Usage: pm2 start ecosystem.config.js ; pm2 save
// Reboot persistence (one-time, needs admin): pm2 startup  (or run pm2 under a Windows service).
// Redis runs separately (Docker: docker run -d --name nama-redis --restart unless-stopped -p 6379:6379 redis:7-alpine).
module.exports = {
  apps: [
    {
      name: 'nama-app',
      script: 'server.js',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      max_restarts: 10,
      min_uptime: '15s',
      env: { NODE_ENV: 'production' },
      // DB_USER/DB_PASSWORD/REDIS_* come from .env (gitignored) — never hardcode secrets here.
    },
  ],
};
