#!/usr/bin/env bash
# filepath: sm_multi_tier149.sh
BASE="http://127.0.0.1:3000/api"
PASS=0
FAIL=0
chk(){
  local name="$1"; local route="$2"; local body="$3"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -X POST "$BASE/$route" -d @"$body")
  if [ "$code" = "200" ]; then
    echo "OK $name ($code)"; PASS=$((PASS+1))
  else
    echo "FAIL $name ($code)"; FAIL=$((FAIL+1))
  fi
}
chk "car-ech"      "eng/tier149-car-705/echo"             /tmp/multi_body_0.json
chk "car-str"      "eng/tier149-car-705/stress_test"      /tmp/multi_body_1.json
chk "car-cat"      "eng/tier149-car-705/cath"             /tmp/multi_body_2.json
chk "car-dev"      "eng/tier149-car-705/device"           /tmp/multi_body_3.json
chk "car-htf"      "eng/tier149-car-705/heart_failure"    /tmp/multi_body_4.json
chk "pul-pft"      "eng/tier149-pul-706/pft"              /tmp/multi_body_5.json
chk "pul-slp"      "eng/tier149-pul-706/sleep"            /tmp/multi_body_6.json
chk "pul-cpd"      "eng/tier149-pul-706/copd"             /tmp/multi_body_7.json
chk "pul-ast"      "eng/tier149-pul-706/asthma"           /tmp/multi_body_8.json
chk "pul-brc"      "eng/tier149-pul-706/bronchoscopy"     /tmp/multi_body_9.json
chk "gi-end"      "eng/tier149-gi-707/endoscopy"         /tmp/multi_body_10.json
chk "gi-lvr"      "eng/tier149-gi-707/liver"             /tmp/multi_body_11.json
chk "gi-ibd"      "eng/tier149-gi-707/ibd"               /tmp/multi_body_12.json
chk "gi-grd"      "eng/tier149-gi-707/gerd"              /tmp/multi_body_13.json
chk "gi-bil"      "eng/tier149-gi-707/biliary"           /tmp/multi_body_14.json
chk "nep-ckp"      "eng/tier149-nep-708/ckd_progression"  /tmp/multi_body_15.json
chk "nep-dxa"      "eng/tier149-nep-708/dialysis_access" /tmp/multi_body_16.json
chk "nep-txv"      "eng/tier149-nep-708/transplant_eval"  /tmp/multi_body_17.json
chk "nep-rrt"      "eng/tier149-nep-708/renal_replacement" /tmp/multi_body_18.json
chk "nep-abg"      "eng/tier149-nep-708/acid_base"        /tmp/multi_body_19.json
echo "SMOKE: PASS=$PASS FAIL=$FAIL"