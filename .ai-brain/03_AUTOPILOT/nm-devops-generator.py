#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
nm-devops-generator.py
Generates Docker + CI/CD + monitoring configs.
"""
import io
import os
import sys
from pathlib import Path
from datetime import datetime

if hasattr(sys.stdout, 'buffer'):
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

WORKSPACE = Path(r"c:\Users\ice\Desktop\NMEDCALVSCODE")
DEVOPS_DIR = WORKSPACE / ".ai-brain/07-devops"


def make_dockerfile_backend(date):
    return (
        "# filepath: .ai-brain/07-devops/docker/Dockerfile.backend\n"
        "# NamaMedical Backend - Generated " + date + "\n"
        "FROM node:20-alpine\n"
        "WORKDIR /app\n"
        "COPY package*.json ./\n"
        "RUN npm ci --only=production\n"
        "COPY . .\n"
        "EXPOSE 3000\n"
        "USER node\n"
        'CMD ["node", "server.js"]\n'
        'HEALTHCHECK --interval=30s --timeout=3s CMD wget -q -O - http://localhost:3000/health || exit 1\n'
    )


def make_dockerfile_frontend(date):
    return (
        "# filepath: .ai-brain/07-devops/docker/Dockerfile.frontend\n"
        "# NamaMedical Frontend (Nginx) - Generated " + date + "\n"
        "FROM nginx:alpine\n"
        "COPY namaweb/public /usr/share/nginx/html\n"
        "COPY .ai-brain/07-devops/nginx.conf /etc/nginx/conf.d/default.conf\n"
        "EXPOSE 80\n"
        'HEALTHCHECK --interval=30s --timeout=3s CMD wget -q -O - http://localhost/ || exit 1\n'
    )


def make_docker_compose(date):
    return (
        "# filepath: .ai-brain/07-devops/docker-compose.yml\n"
        "# Generated " + date + "\n"
        "version: '3.9'\n\n"
        "services:\n"
        "  postgres:\n"
        "    image: postgres:16-alpine\n"
        "    environment:\n"
        "      POSTGRES_DB: nama_medical\n"
        "      POSTGRES_USER: nama_app\n"
        "      POSTGRES_PASSWORD: __CHANGE_ME__\n"
        "    volumes:\n"
        "      - pgdata:/var/lib/postgresql/data\n"
        "      - ./namaweb/migrations:/docker-entrypoint-initdb.d\n"
        "    ports: ['5432:5432']\n"
        "    healthcheck:\n"
        '      test: ["CMD-SHELL", "pg_isready -U nama_app"]\n'
        "      interval: 10s\n\n"
        "  redis:\n"
        "    image: redis:7-alpine\n"
        "    ports: ['6379:6379']\n\n"
        "  backend:\n"
        "    build:\n"
        "      context: .\n"
        "      dockerfile: .ai-brain/07-devops/docker/Dockerfile.backend\n"
        "    environment:\n"
        "      DATABASE_URL: postgresql://nama_app:__CHANGE_ME__@postgres:5432/nama_medical\n"
        "      REDIS_URL: redis://redis:6379\n"
        "      NODE_ENV: production\n"
        "      PORT: 3000\n"
        "    depends_on:\n"
        "      postgres: { condition: service_healthy }\n"
        "    ports: ['3000:3000']\n\n"
        "  frontend:\n"
        "    build:\n"
        "      context: .\n"
        "      dockerfile: .ai-brain/07-devops/docker/Dockerfile.frontend\n"
        "    ports: ['8080:80']\n\n"
        "  prometheus:\n"
        "    image: prom/prometheus:latest\n"
        "    volumes:\n"
        "      - ./.ai-brain/07-devops/monitoring/prometheus.yml:/etc/prometheus/prometheus.yml\n"
        "    ports: ['9090:9090']\n\n"
        "  grafana:\n"
        "    image: grafana/grafana:latest\n"
        "    environment:\n"
        "      GF_SECURITY_ADMIN_PASSWORD: __CHANGE_ME__\n"
        "    ports: ['3001:3000']\n\n"
        "volumes:\n  pgdata:\n"
    )


def make_nginx_conf():
    return (
        "# filepath: .ai-brain/07-devops/nginx.conf\n"
        "server {\n"
        "  listen 80;\n"
        "  server_name _;\n"
        "  root /usr/share/nginx/html;\n"
        "  index index.html;\n\n"
        "  add_header X-Frame-Options 'SAMEORIGIN' always;\n"
        "  add_header X-Content-Type-Options 'nosniff' always;\n"
        "  add_header Referrer-Policy 'strict-origin-when-cross-origin' always;\n"
        "  add_header Content-Security-Policy \"default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' http://localhost:3000 wss:;\" always;\n\n"
        "  location / {\n"
        "    try_files $uri $uri/ /index.html;\n"
        "  }\n\n"
        "  location /api/ {\n"
        "    proxy_pass http://backend:3000;\n"
        "    proxy_http_version 1.1;\n"
        "    proxy_set_header Upgrade $http_upgrade;\n"
        "    proxy_set_header Connection 'upgrade';\n"
        "    proxy_set_header Host $host;\n"
        "    proxy_set_header X-Real-IP $remote_addr;\n"
        "    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n"
        "    proxy_set_header X-Forwarded-Proto $scheme;\n"
        "    proxy_cache_bypass $http_upgrade;\n"
        "  }\n"
        "}\n"
    )


def make_ci_cd(date):
    return (
        "# filepath: .ai-brain/07-devops/ci-cd/.github/workflows/main.yml\n"
        "# GitHub Actions CI/CD - Generated " + date + "\n"
        "name: NamaMedical CI/CD\n\n"
        "on:\n"
        "  push:\n"
        "    branches: [main, integration/*]\n"
        "  pull_request:\n"
        "    branches: [main]\n\n"
        "jobs:\n"
        "  test:\n"
        "    runs-on: ubuntu-latest\n"
        "    services:\n"
        "      postgres:\n"
        "        image: postgres:16-alpine\n"
        "        env:\n"
        "          POSTGRES_DB: nama_test\n"
        "          POSTGRES_USER: nama_app\n"
        "          POSTGRES_PASSWORD: test\n"
        "        ports: ['5432:5432']\n"
        "        options: --health-cmd pg_isready --health-interval 10s\n"
        "      redis:\n"
        "        image: redis:7-alpine\n"
        "        ports: ['6379:6379']\n"
        "    steps:\n"
        "      - uses: actions/checkout@v4\n"
        "      - uses: actions/setup-node@v4\n"
        "        with: { node-version: '20', cache: 'npm' }\n"
        "      - run: cd namaweb && npm ci\n"
        "      - run: cd namaweb && npm run test:safe\n"
        "        env:\n"
        "          DATABASE_URL: postgresql://nama_app:test@localhost:5432/nama_test\n"
        "          REDIS_URL: redis://localhost:6379\n"
        "          NODE_ENV: test\n"
        "          SKIP_DB_INIT: '1'\n"
        "      - run: cd namaweb && npm run lint\n\n"
        "  deploy-staging:\n"
        "    needs: test\n"
        "    if: github.ref == 'refs/heads/integration/all-epics'\n"
        "    runs-on: ubuntu-latest\n"
        "    steps:\n"
        "      - uses: actions/checkout@v4\n"
        "      - name: Deploy to Hetzner staging\n"
        "        env:\n"
        "          SSH_KEY: ${{ secrets.HETZNER_SSH_KEY }}\n"
        "          HOST: ${{ secrets.HETZNER_STAGING_HOST }}\n"
        "        run: |\n"
        "          echo \"$SSH_KEY\" > /tmp/key && chmod 600 /tmp/key\n"
        "          ssh -i /tmp/key ubuntu@$HOST 'cd /opt/nama && git pull && npm ci --only=production && pm2 reload nama-medical-erp'\n\n"
        "  deploy-prod:\n"
        "    needs: deploy-staging\n"
        "    if: github.ref == 'refs/heads/main'\n"
        "    runs-on: ubuntu-latest\n"
        "    environment: production\n"
        "    steps:\n"
        "      - uses: actions/checkout@v4\n"
        "      - name: Deploy to production\n"
        "        env:\n"
        "          SSH_KEY: ${{ secrets.HETZNER_SSH_KEY }}\n"
        "          HOST: ${{ secrets.HETZNER_PROD_HOST }}\n"
        "        run: |\n"
        "          echo \"$SSH_KEY\" > /tmp/key && chmod 600 /tmp/key\n"
        "          ssh -i /tmp/key ubuntu@$HOST 'cd /opt/nama && git pull && npm ci --only=production && pm2 reload nama-medical-erp'\n"
    )


def make_prometheus(date):
    return (
        "# filepath: .ai-brain/07-devops/monitoring/prometheus.yml\n"
        "# Generated " + date + "\n"
        "global:\n  scrape_interval: 15s\n\n"
        "scrape_configs:\n"
        "  - job_name: nama-medical-backend\n"
        "    static_configs:\n  - targets: ['backend:3000']\n"
        "    metrics_path: /metrics\n\n"
        "  - job_name: postgres\n"
        "    static_configs:\n  - targets: ['postgres-exporter:9187']\n\n"
        "  - job_name: redis\n"
        "    static_configs:\n  - targets: ['redis-exporter:9121']\n"
    )


def make_langsmith(date):
    return (
        "# filepath: .ai-brain/07-devops/llm-observability/langsmith-config.yaml\n"
        "# LangSmith/LangFuse - Generated " + date + "\n"
        "langsmith:\n"
        "  api_key: __CHANGE_ME__\n"
        "  project: nama-medical-prod\n"
        "  endpoint: https://api.smith.langchain.com\n\n"
        "tracing:\n"
        "  enabled: true\n"
        "  sample_rate: 0.1\n"
        "  include_errors: true\n"
        "  metadata:\n"
        "    - tenant_id\n"
        "    - dept\n"
        "    - user_id\n\n"
        "evaluations:\n"
        "  - name: rag-precision\n"
        "    dataset: nama-medical-eval-v1\n"
        "    metrics: [faithfulness, answer_relevancy, context_precision]\n"
        "  - name: diagnosis-accuracy\n"
        "    dataset: nama-medical-diagnosis-v1\n"
        "    metrics: [exact_match, llm_judge]\n"
    )


def main():
    DEVOPS_DIR.mkdir(parents=True, exist_ok=True)
    (DEVOPS_DIR / "docker").mkdir(parents=True, exist_ok=True)
    (DEVOPS_DIR / "ci-cd" / ".github" / "workflows").mkdir(parents=True, exist_ok=True)
    (DEVOPS_DIR / "monitoring").mkdir(parents=True, exist_ok=True)
    (DEVOPS_DIR / "llm-observability").mkdir(parents=True, exist_ok=True)

    date = datetime.now().strftime("%Y-%m-%d")
    files = [
        ("docker/Dockerfile.backend", make_dockerfile_backend(date)),
        ("docker/Dockerfile.frontend", make_dockerfile_frontend(date)),
        ("docker-compose.yml", make_docker_compose(date)),
        ("nginx.conf", make_nginx_conf()),
        ("ci-cd/.github/workflows/main.yml", make_ci_cd(date)),
        ("monitoring/prometheus.yml", make_prometheus(date)),
        ("llm-observability/langsmith-config.yaml", make_langsmith(date)),
    ]
    for path, content in files:
        full = DEVOPS_DIR / path
        full.parent.mkdir(parents=True, exist_ok=True)
        full.write_text(content, encoding="utf-8")
        print(f"  [+] {full}")
    print(f"[STATS] DevOps files: {len(files)}")


if __name__ == "__main__":
    main()
