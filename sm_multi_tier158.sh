#!/usr/bin/env bash
# filepath: sm_multi_tier158.sh
BASE="http://127.0.0.1:3000/api"
PASS=0; FAIL=0
chk(){
  local name="$1"; local route="$2"; local body="$3"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -X POST "$BASE/$route" -d @"$body")
  if [ "$code" = "200" ]; then echo "OK $name ($code)"; PASS=$((PASS+1)); else echo "FAIL $name ($code)"; FAIL=$((FAIL+1)); fi
}
chk "iv-ivc"     "eng/tier158-ivf-743/consult"    /tmp/multi_body_0.json
chk "iv-stm"     "eng/tier158-ivf-743/stim"       /tmp/multi_body_1.json
chk "iv-rtr"     "eng/tier158-ivf-743/retrieval"  /tmp/multi_body_2.json
chk "iv-xfr"     "eng/tier158-ivf-743/transfer"   /tmp/multi_body_3.json
chk "iv-otc"     "eng/tier158-ivf-743/outcome"    /tmp/multi_body_4.json
chk "an-sma"     "eng/tier158-and-744/semen"      /tmp/multi_body_5.json
chk "an-tsx"     "eng/tier158-and-744/testosterone" /tmp/multi_body_6.json
chk "an-edx"     "eng/tier158-and-744/ed"         /tmp/multi_body_7.json
chk "an-min"     "eng/tier158-and-744/infertility_male" /tmp/multi_body_8.json
chk "an-fpr"     "eng/tier158-and-744/fertility_preservation" /tmp/multi_body_9.json
chk "mn-men"     "eng/tier158-men-745/assess"     /tmp/multi_body_10.json
chk "mn-hfm"     "eng/tier158-men-745/hot_flashes" /tmp/multi_body_11.json
chk "mn-hrp"     "eng/tier158-men-745/hormone_therapy" /tmp/multi_body_12.json
chk "mn-bmh"     "eng/tier158-men-745/bone_health" /tmp/multi_body_13.json
chk "mn-gsm"     "eng/tier158-men-745/gsm"        /tmp/multi_body_14.json
chk "mi-rcl"     "eng/tier158-mif-746/recurrent_loss" /tmp/multi_body_15.json
chk "mi-pcc"     "eng/tier158-mif-746/preconception" /tmp/multi_body_16.json
chk "mi-epy"     "eng/tier158-mif-746/early_preg" /tmp/multi_body_17.json
chk "mi-ect"     "eng/tier158-mif-746/ectopic"    /tmp/multi_body_18.json
chk "mi-pls"     "eng/tier158-mif-746/pregnancy_loss" /tmp/multi_body_19.json
echo "SMOKE: PASS=$PASS FAIL=$FAIL"