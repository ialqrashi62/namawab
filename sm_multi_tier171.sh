#!/usr/bin/env bash
# filepath: sm_multi_tier171.sh
BASE="http://127.0.0.1:3000/api"
PASS=0; FAIL=0
chk(){
  local name="$1"; local route="$2"; local body="$3"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -X POST "$BASE/$route" -d @"$body")
  if [ "$code" = "200" ]; then echo "OK $name ($code)"; PASS=$((PASS+1)); else echo "FAIL $name ($code)"; FAIL=$((FAIL+1)); fi
}
chk "if-sbp"     "eng/tier171-inf-795/sepsis_bundle"        /tmp/multi_body_0.json
chk "if-abs"     "eng/tier171-inf-795/abx_stewardship"      /tmp/multi_body_1.json
chk "if-mdo"     "eng/tier171-inf-795/mdr_organism"         /tmp/multi_body_2.json
chk "if-ipo"     "eng/tier171-inf-795/iv_to_po"             /tmp/multi_body_3.json
chk "if-omg"     "eng/tier171-inf-795/out_management"      /tmp/multi_body_4.json
chk "em-hrm"     "eng/tier171-emp-796/hrm_dashboard"       /tmp/multi_body_5.json
chk "em-rcl"     "eng/tier171-emp-796/recruitment"          /tmp/multi_body_6.json
chk "em-trn"     "eng/tier171-emp-796/training"             /tmp/multi_body_7.json
chk "em-pfm"     "eng/tier171-emp-796/performance"          /tmp/multi_body_8.json
chk "em-cmp"     "eng/tier171-emp-796/compensation"        /tmp/multi_body_9.json
chk "ph-mrc"     "eng/tier171-phr-797/med_reconciliation"   /tmp/multi_body_10.json
chk "ph-hal"     "eng/tier171-phr-797/high_alert"           /tmp/multi_body_11.json
chk "ph-rnd"     "eng/tier171-phr-797/renal_dosing"         /tmp/multi_body_12.json
chk "ph-lal"     "eng/tier171-phr-797/look_alike"           /tmp/multi_body_13.json
chk "ph-csb"     "eng/tier171-phr-797/controlled_substance" /tmp/multi_body_14.json
chk "qu-inc"     "eng/tier171-qui-798/incident_report"      /tmp/multi_body_15.json
chk "qu-rcp"     "eng/tier171-qui-798/root_cause"           /tmp/multi_body_16.json
chk "qu-fme"     "eng/tier171-qui-798/fmea"                 /tmp/multi_body_17.json
chk "qu-aud"     "eng/tier171-qui-798/internal_audit"       /tmp/multi_body_18.json
chk "qu-cqi"     "eng/tier171-qui-798/cqi_project"          /tmp/multi_body_19.json
echo "SMOKE: PASS=$PASS FAIL=$FAIL"