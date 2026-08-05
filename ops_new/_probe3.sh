#!/usr/bin/env bash
echo P3_START
echo P3_PY:$(command -v python3)
echo P3_NODE:$(command -v node)
echo P3_PY_VERSION:$(python3 -V 2>&1)
echo P3_NODE_VERSION:$(node -v 2>&1)
echo P3_NGINX_TEST:$(nginx -t 2>&1 | head -2)
echo P3_PM2_NAMES:$(pm2 jlist 2>/dev/null | node -e "let d='';process.stdin.on('data',c=>d+=c).on('end',()=>{try{const a=JSON.parse(d);console.log(a.map(x=>x.name).join(','))}catch(e){console.log('PARSE_ERR')}}))
echo P3_SITES:$(ls /etc/nginx/sites-enabled/ 2>&1 | tr '\n' '|')
echo P3_OPS_HAS_SMOKE:$(ls /var/www/namaweb/ops/ | grep -c smoke || echo 0)
echo P3_END