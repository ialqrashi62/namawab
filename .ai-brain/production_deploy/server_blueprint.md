# Server Environment Blueprint: jumanasoft.com
## 🛠️ Technical Requirements for Production Deployment

### 1. PostgreSQL & Vector Intelligence
To enable the RAG engine, the server must have `pgvector` installed and active.

**Installation Commands (Ubuntu/Debian):**
```bash
# Install PostgreSQL and development headers
sudo apt-get update
sudo apt-get install -y postgresql-14 postgresql-server-dev-14

# Install pgvector
cd /tmp
git clone --branch postgres14 https://github.com/pgvector/pgvector.git
cd pgvector
make
sudo make install

# Enable extension in the database
sudo -u postgres psql -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

### 2. Runtime Environment
- **Node.js**: Version `18.x` or `20.x` (LTS) is required.
- **Process Manager**: `PM2` for zero-downtime restarts and monitoring.
- **Memory Optimization**: 
    - Minimum 16GB RAM recommended for LLM embedding caching.
    - Swap space: 4GB enabled to prevent OOM (Out of Memory) kills during heavy ingestion.
- **Docker**: Use `node:18-alpine` for the production image to minimize attack surface.

### 3. Security & Networking
- **Firewall (UFW)**:
    - `sudo ufw allow 80/tcp` (HTTP)
    - `sudo ufw allow 443/tcp` (HTTPS)
    - `sudo ufw allow 22/tcp` (SSH - Restricted to Admin IP)
    - `sudo ufw deny 5432/tcp` (Postgres - Block external access)
- **SSL/TLS**: 
    - Use `Certbot` (Let's Encrypt) for automatic SSL renewal.
    - Enforce HSTS (HTTP Strict Transport Security) in the Express `helmet` config.
- **Reverse Proxy**: Nginx configured as a reverse proxy to handle SSL termination and load balancing.
