#!/usr/bin/env bash
# filepath: sm_multi_tier167.sh
BASE="http://127.0.0.1:3000/api"
PASS=0; FAIL=0
chk(){
  local name="$1"; local route="$2"; local body="$3"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -X POST "$BASE/$route" -d @"$body")
  if [ "$code" = "200" ]; then echo "OK $name ($code)"; PASS=$((PASS+1)); else echo "FAIL $name ($code)"; FAIL=$((FAIL+1)); fi
}
chk "au-aud"     "eng/tier167-aud-779/audiometry"          /tmp/multi_body_0.json
chk "au-aid"     "eng/tier167-aud-779/hearing_aid"         /tmp/multi_body_1.json
chk "au-tin"     "eng/tier167-aud-779/tinnitus"            /tmp/multi_body_2.json
chk "au-ves"     "eng/tier167-aud-779/vestibular"          /tmp/multi_body_3.json
chk "au-coc"     "eng/tier167-aud-779/cochlear"            /tmp/multi_body_4.json
chk "sp-sev"     "eng/tier167-spe-780/speech_evaluation"   /tmp/multi_body_5.json
chk "sp-sth"     "eng/tier167-spe-780/speech_therapy"      /tmp/multi_body_6.json
chk "sp-vth"     "eng/tier167-spe-780/voice_therapy"       /tmp/multi_body_7.json
chk "sp-swa"     "eng/tier167-spe-780/swallowing"          /tmp/multi_body_8.json
chk "sp-psp"     "eng/tier167-spe-780/pediatric_speech"    /tmp/multi_body_9.json
chk "dm-dex"     "eng/tier167-drm-781/derm_exam"           /tmp/multi_body_10.json
chk "dm-bps"     "eng/tier167-drm-781/biopsy"              /tmp/multi_body_11.json
chk "dm-moh"     "eng/tier167-drm-781/mohs"                /tmp/multi_body_12.json
chk "dm-scs"     "eng/tier167-drm-781/skin_cancer_screening" /tmp/multi_body_13.json
chk "dm-dmg"     "eng/tier167-drm-781/dermatitis_mgmt"     /tmp/multi_body_14.json
chk "oc-sts"     "eng/tier167-onc-782/staging_solid"       /tmp/multi_body_15.json
chk "oc-chm"     "eng/tier167-onc-782/chemotherapy"        /tmp/multi_body_16.json
chk "oc-rad"     "eng/tier167-onc-782/radiation"           /tmp/multi_body_17.json
chk "oc-tmr"     "eng/tier167-onc-782/tumor_markers"       /tmp/multi_body_18.json
chk "oc-sur"     "eng/tier167-onc-782/survivorship"        /tmp/multi_body_19.json
echo "SMOKE: PASS=$PASS FAIL=$FAIL"