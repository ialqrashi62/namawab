#!/usr/bin/env bash
echo P6_START
for M in cardiology adolescent endocrinology anesthesiology; do
    if [[ "$M" == "adolescent" ]]; then EXT=ext101; else EXT=ext102; fi
    RESP=$(curl -sk https://jumanasoft.com/api/v1/pcc-${M}-${EXT}/list)
    FCOUNT=$(echo "$RESP" | python3 -c 'import sys,json; d=json.load(sys.stdin); fs=d.get("functions") or []; print(len(fs))')
    FNAME=$(echo "$RESP" | python3 -c 'import sys,json; d=json.load(sys.stdin); fs=d.get("functions") or []; print([f.get("name") for f in fs][:6])')
    echo "P6_${M}:fcount=${FCOUNT}:names=${FNAME}"
done
echo P6_CARD_CALL_SCORE:$(curl -sk -X POST https://jumanasoft.com/api/v1/pcc-cardiology-ext102/call/CardGenExt -H 'Content-Type: application/json' -d '{}' | python3 -c 'import sys,json; d=json.load(sys.stdin); print(d.get("score"))')
echo P6_END