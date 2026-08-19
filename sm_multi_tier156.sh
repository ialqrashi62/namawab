#!/usr/bin/env bash
# filepath: sm_multi_tier156.sh
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
chk "crs-col"     "eng/tier156-crs-735/colonoscopy"     /tmp/multi_body_0.json
chk "crs-crc"     "eng/tier156-crs-735/colorectal_ca"   /tmp/multi_body_1.json
chk "crs-res"     "eng/tier156-crs-735/resect"          /tmp/multi_body_2.json
chk "crs-pch"     "eng/tier156-crs-735/pouch"           /tmp/multi_body_3.json
chk "crs-fuc"     "eng/tier156-crs-735/followup_crc"    /tmp/multi_body_4.json
chk "hpb-liv"     "eng/tier156-hpb-736/liver_resection" /tmp/multi_body_5.json
chk "hpb-pnc"     "eng/tier156-hpb-736/pancreas"        /tmp/multi_body_6.json
chk "hpb-bil"     "eng/tier156-hpb-736/biliary"         /tmp/multi_body_7.json
chk "hpb-spl"     "eng/tier156-hpb-736/spleen"          /tmp/multi_body_8.json
chk "hpb-hrn"     "eng/tier156-hpb-736/hernia"          /tmp/multi_body_9.json
chk "txv-ev"      "eng/tier156-txp-737/evaluation"      /tmp/multi_body_10.json
chk "txv-dpr"     "eng/tier156-txp-737/donor_proc"      /tmp/multi_body_11.json
chk "txv-rop"     "eng/tier156-txp-737/recipient_op"    /tmp/multi_body_12.json
chk "txv-imm"     "eng/tier156-txp-737/immunosuppressant" /tmp/multi_body_13.json
chk "txv-ptx"     "eng/tier156-txp-737/post_op"         /tmp/multi_body_14.json
chk "tra-trv"     "eng/tier156-tra-738/trauma_eval"     /tmp/multi_body_15.json
chk "tra-rsu"     "eng/tier156-tra-738/resus"            /tmp/multi_body_16.json
chk "tra-dcs"     "eng/tier156-tra-738/damage_control"   /tmp/multi_body_17.json
chk "tra-cmp"     "eng/tier156-tra-738/complication"     /tmp/multi_body_18.json
chk "tra-otm"     "eng/tier156-tra-738/outcome_trauma"   /tmp/multi_body_19.json
echo "SMOKE: PASS=$PASS FAIL=$FAIL"