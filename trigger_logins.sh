#!/usr/bin/env bash
# Runs INSIDE the Hetzner box so we can hit 127.0.0.1:3000 directly.
set -u
echo "=== 3 live login attempts (curl localhost:3000) ==="
for i in 1 2 3; do
  echo "--- attempt $i ---"
  curl -sk -o /tmp/login_body_$i.txt -w 'http_code=%{http_code} time=%{time_total}\n' \
    -X POST -H 'Content-Type: application/json' \
    -d '{"username":"admin","password":"admin"}' \
    http://127.0.0.1:3000/api/auth/login
  echo "body: $(head -c 300 /tmp/login_body_$i.txt)"
done
