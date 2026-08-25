#!/usr/bin/env bash
# filepath: sm_multi_tier164.sh
BASE="http://127.0.0.1:3000/api"
PASS=0; FAIL=0
chk(){
  local name="$1"; local route="$2"; local body="$3"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -X POST "$BASE/$route" -d @"$body")
  if [ "$code" = "200" ]; then echo "OK $name ($code)"; PASS=$((PASS+1)); else echo "FAIL $name ($code)"; FAIL=$((FAIL+1)); fi
}
chk "hm-rfh"     "eng/tier164-hum-767/refugee_health"             /tmp/multi_body_0.json
chk "hm-dpc"     "eng/tier164-hum-767/displaced_care"             /tmp/multi_body_1.json
chk "hm-lri"     "eng/tier164-hum-767/low_resource_intervention" /tmp/multi_body_2.json
chk "hm-vct"     "eng/tier164-hum-767/vector_control"             /tmp/multi_body_3.json
chk "hm-csc"     "eng/tier164-hum-767/community_screening"        /tmp/multi_body_4.json
chk "tl-rcn"     "eng/tier164-tel-768/remote_consult"             /tmp/multi_body_5.json
chk "tl-tfu"     "eng/tier164-tel-768/telehealth_followup"        /tmp/multi_body_6.json
chk "tl-epr"     "eng/tier164-tel-768/e_prescription"             /tmp/multi_body_7.json
chk "tl-sfw"     "eng/tier164-tel-768/store_forward"              /tmp/multi_body_8.json
chk "tl-vtr"     "eng/tier164-tel-768/virtual_triage"             /tmp/multi_body_9.json
chk "pl-pmp"     "eng/tier164-pal-769/pain_mgmt_pal"              /tmp/multi_body_10.json
chk "pl-dsp"     "eng/tier164-pal-769/dyspnea"                    /tmp/multi_body_11.json
chk "pl-dlp"     "eng/tier164-pal-769/delirium_pal"               /tmp/multi_body_12.json
chk "pl-hit"     "eng/tier164-pal-769/hospice_intake"             /tmp/multi_body_13.json
chk "pl-bvm"     "eng/tier164-pal-769/bereavement"                /tmp/multi_body_14.json
chk "in-acp"     "eng/tier164-int-770/acupuncture"                /tmp/multi_body_15.json
chk "in-hbm"     "eng/tier164-int-770/herbal_med"                 /tmp/multi_body_16.json
chk "in-mbd"     "eng/tier164-int-770/mind_body"                  /tmp/multi_body_17.json
chk "in-nut"     "eng/tier164-int-770/nutrition_int"              /tmp/multi_body_18.json
chk "in-fnm"     "eng/tier164-int-770/functional_med"             /tmp/multi_body_19.json
echo "SMOKE: PASS=$PASS FAIL=$FAIL"