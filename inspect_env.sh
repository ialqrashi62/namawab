#!/bin/bash
echo "=== grep password-ish keys (value redacted to first 3 chars) ==="
awk -F= '{
  if ($0 ~ /^[[:space:]]*#/ || $0 ~ /^[[:space:]]*$/) { print; next }
  if (NF >= 2) {
    val=$2
    sub(/^[[:space:]]+/,"",val)
    sub(/[[:space:]]+$/,"",val)
    if (length(val) > 3) {
      printf "%s=%s***\n", $1, substr(val,1,3)
    } else {
      printf "%s=%s\n", $1, val
    }
  } else {
    print $0
  }
}' /var/www/namaweb/.env 2>/dev/null
echo ""
echo "=== raw .env size ==="
wc -l /var/www/namaweb/.env 2>/dev/null
