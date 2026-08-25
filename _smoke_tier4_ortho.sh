#!/bin/bash
for p in orthosp orthospine orthoarth orthotrauma orthohand orthofa orthopeds orthoonc; do
  echo "--- $p health ---"
  curl -s -m 5 http://127.0.0.1:3000/api/${p}/health
  echo
done
