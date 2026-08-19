#!/usr/bin/env bash
# filepath: sm_multi_tier155.sh
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
chk "spn-dsc"     "eng/tier155-spn-731/disc"          /tmp/multi_body_0.json
chk "spn-fsn"     "eng/tier155-spn-731/fusion"       /tmp/multi_body_1.json
chk "spn-dfm"     "eng/tier155-spn-731/deformity"    /tmp/multi_body_2.json
chk "spn-tsp"     "eng/tier155-spn-731/tumor_spine"  /tmp/multi_body_3.json
chk "spn-spo"     "eng/tier155-spn-731/outcome_spine" /tmp/multi_body_4.json
chk "spt-inj"     "eng/tier155-spt-732/injury"        /tmp/multi_body_5.json
chk "spt-ccn"     "eng/tier155-spt-732/concussion"    /tmp/multi_body_6.json
chk "spt-sgs"     "eng/tier155-spt-732/surgical"      /tmp/multi_body_7.json
chk "spt-reb"     "eng/tier155-spt-732/rehab"         /tmp/multi_body_8.json
chk "spt-prp"     "eng/tier155-spt-732/prp"           /tmp/multi_body_9.json
chk "pmn-pai"     "eng/tier155-pmn-733/pain_assess"   /tmp/multi_body_10.json
chk "pmn-inj"     "eng/tier155-pmn-733/injection"     /tmp/multi_body_11.json
chk "pmn-scs"     "eng/tier155-pmn-733/scs"           /tmp/multi_body_12.json
chk "pmn-opd"     "eng/tier155-pmn-733/opioid"        /tmp/multi_body_13.json
chk "pmn-otc"     "eng/tier155-pmn-733/outcomes"      /tmp/multi_body_14.json
chk "pmr-srk"     "eng/tier155-pmr-734/stroke_rehab"  /tmp/multi_body_15.json
chk "pmr-trb"     "eng/tier155-pmr-734/tbi_rehab"     /tmp/multi_body_16.json
chk "pmr-amp"     "eng/tier155-pmr-734/amputation"    /tmp/multi_body_17.json
chk "pmr-whl"     "eng/tier155-pmr-734/wheelchair"    /tmp/multi_body_18.json
chk "pmr-cre"     "eng/tier155-pmr-734/community_reentry" /tmp/multi_body_19.json
echo "SMOKE: PASS=$PASS FAIL=$FAIL"