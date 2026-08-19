#!/usr/bin/env bash
# filepath: sm_multi_tier145.sh
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
chk "ed-triage"     "eng/tier145-ed-689/triage"        /tmp/multi_body_0.json
chk "ed-trauma"     "eng/tier145-ed-689/trauma"        /tmp/multi_body_1.json
chk "ed-tox"        "eng/tier145-ed-689/toxicology"    /tmp/multi_body_2.json
chk "ed-proc"       "eng/tier145-ed-689/proc"          /tmp/multi_body_3.json
chk "ed-disp"       "eng/tier145-ed-689/disposition"   /tmp/multi_body_4.json
chk "nep-ckd"       "eng/tier145-nep-690/ckd_stage"    /tmp/multi_body_5.json
chk "nep-dialy"     "eng/tier145-nep-690/dialysis"     /tmp/multi_body_6.json
chk "nep-transp"    "eng/tier145-nep-690/transplant"   /tmp/multi_body_7.json
chk "nep-bx"        "eng/tier145-nep-690/biopsy"       /tmp/multi_body_8.json
chk "nep-lyte"      "eng/tier145-nep-690/electrolyte"  /tmp/multi_body_9.json
chk "pt-asmt"       "eng/tier145-pt-691/assessment"    /tmp/multi_body_10.json
chk "pt-exer"       "eng/tier145-pt-691/exercise"      /tmp/multi_body_11.json
chk "pt-manual"     "eng/tier145-pt-691/manual"        /tmp/multi_body_12.json
chk "pt-mod"        "eng/tier145-pt-691/modality"      /tmp/multi_body_13.json
chk "pt-dc"         "eng/tier145-pt-691/discharge"     /tmp/multi_body_14.json
chk "cos-cns"       "eng/tier145-cos-692/consultation" /tmp/multi_body_15.json
chk "cos-syr"       "eng/tier145-cos-692/surgery"      /tmp/multi_body_16.json
chk "cos-inj"       "eng/tier145-cos-692/injectable"   /tmp/multi_body_17.json
chk "cos-lsr"       "eng/tier145-cos-692/las_skin"     /tmp/multi_body_18.json
chk "cos-cmp"       "eng/tier145-cos-692/complications" /tmp/multi_body_19.json
echo "SMOKE: PASS=$PASS FAIL=$FAIL"