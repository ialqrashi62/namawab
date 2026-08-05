#!/bin/bash
set +e
echo "=== discharge in server.js ==="
grep -nE "discharge|/api/v4/discharge" /var/www/namaweb/server.js | head -20
echo ""
echo "=== discharge routes registered ==="
cd /var/www/namaweb && node -e 'const m=require("./routes/discharge"); const keys=Object.keys(m); console.log("keys:", keys); for(const k of keys){const v=m[k]; if(typeof v==="function" && v.stack){console.log(k+" stack="+v.stack.length); v.stack.forEach(l=>{if(l.route)console.log("  ", Object.keys(l.route.methods).join(","), l.route.path)})}else console.log(k+":", typeof v)}'
echo ""
echo "=== try the live route ==="
curl -s -o /tmp/b.txt -w "%{http_code}\n" -X POST \
  -H "Content-Type: application/json" \
  -H "x-tenant-id: tnt-demo" \
  -H "x-user-id: dr-test" \
  -H "x-user-role: doctor" \
  -d '{"patientId":"P-001","primaryDx":"Test","notes":["sample"],"events":[],"meds":[],"actorId":"dr-test","actorRoles":["doctor"]}' \
  http://127.0.0.1:3000/api/v4/discharge/draft
head -c 400 /tmp/b.txt 2>&1
echo ""
