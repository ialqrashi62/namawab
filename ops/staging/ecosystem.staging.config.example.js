/**
 * ecosystem.staging.config.example.js — PM2 process for the ISOLATED Jumanasoft staging app.
 * TEMPLATE — copy to the staging host and start with:  pm2 start ecosystem.staging.config.js
 * Runs a SEPARATE process (jumanasoft-app-staging) on port 3010 using .env.staging — never production env/DB.
 */
module.exports = {
  apps: [{
    name: 'jumanasoft-app-staging',          // distinct from any production PM2 process
    script: 'server.js',
    cwd: '/var/www/jumanasoft-staging/namaweb', // staging path — NOT the production webroot
    node_args: '-r dotenv/config',
    env_file: '.env.staging',                 // isolated staging env (NODE_ENV=staging, jumanasoft_staging DB)
    env: {
      NODE_ENV: 'staging',
      PORT: '3010'
    },
    instances: 1,
    autorestart: true,
    max_restarts: 10,
    out_file: '/var/log/jumanasoft-staging/out.log',   // staging-only log paths (no prod log mixing)
    error_file: '/var/log/jumanasoft-staging/err.log',
    time: true
  }]
};
