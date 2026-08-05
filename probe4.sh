#!/bin/bash
echo "=== 8 module list routes (URL uses dash, not underscore) ==="
for m in cardiology-ext102 endocrinology-ext102 anesthesiology-ext102 adolescent-ext101 emergency-ext102 billing pharmacy-ext102 icu-ext102; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:3101/api/v1/pcc-$m/list")
  echo "$code  pcc-$m"
done
