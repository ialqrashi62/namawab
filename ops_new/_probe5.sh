#!/usr/bin/env bash
echo P5_START
echo P5_CATALOG_COUNT:$(curl -sk https://jumanasoft.com/api/v1/pcc-catalog/modules | python3 -c 'import sys,json; d=json.load(sys.stdin); m=d.get("modules") or d.get("data") or d; print(type(m).__name__+":"+str(len(m) if hasattr(m,"__len__") else "?"))' 2>&1)
echo P5_ADOLESCENT_LIST:$(curl -sk -o /dev/null -w '%{http_code}' https://jumanasoft.com/api/v1/pcc-adolescent-ext101/list)
echo P5_ENDOCRINO_LIST:$(curl -sk -o /dev/null -w '%{http_code}' https://jumanasoft.com/api/v1/pcc-endocrinology-ext102/list)
echo P5_ANESTH_LIST:$(curl -sk -o /dev/null -w '%{http_code}' https://jumanasoft.com/api/v1/pcc-anesthesiology-ext102/list)
echo P5_CARD_LIST_BODY_LEN:$(curl -sk https://jumanasoft.com/api/v1/pcc-cardiology-ext102/list | wc -c)
echo P5_CARD_LIST_KEYS:$(curl -sk https://jumanasoft.com/api/v1/pcc-cardiology-ext102/list | python3 -c 'import sys,json; d=json.load(sys.stdin); print(list(d.keys())[:8])' 2>&1)
echo P5_CARD_CALL_BODY_LEN:$(curl -sk -X POST https://jumanasoft.com/api/v1/pcc-cardiology-ext102/call/CardGenExt -H 'Content-Type: application/json' -d '{}' | wc -c)
echo P5_CARD_CALL_KEYS:$(curl -sk -X POST https://jumanasoft.com/api/v1/pcc-cardiology-ext102/call/CardGenExt -H 'Content-Type: application/json' -d '{}' | python3 -c 'import sys,json; d=json.load(sys.stdin); print(list(d.keys())[:8])' 2>&1)
echo P5_END