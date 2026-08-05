# PCC Sandbox Dockerfile
# Multi-stage build: deps -> runtime
FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

FROM node:24-alpine AS runtime
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV PCC_PORT=3201
ENV NODE_ENV=production

EXPOSE 3201
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3201/health || exit 1

CMD ["node", "server.js"]
