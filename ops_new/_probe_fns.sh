#!/usr/bin/env bash
for M in adolescent anesthesiology endocrinology; do
    if [[ "$M" == "adolescent" ]]; then EXT=ext101; else EXT=ext102; fi
    RESP=$(curl -sk https://jumanasoft.com/api/v1/pcc-${M}-${EXT}/list)
    FNS=$(echo "$RESP" | python3 -c 'import sys,json; d=json.load(sys.stdin); fs=d.get("functions") or []; print(",".join(fs))')
    echo "M=${M}: ${FNS}"
done