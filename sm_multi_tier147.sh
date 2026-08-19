#!/usr/bin/env bash
# filepath: sm_multi_tier147.sh
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
chk "rad-ct"      "eng/tier147-rad-697/ct"                /tmp/multi_body_0.json
chk "rad-mr"      "eng/tier147-rad-697/mri"               /tmp/multi_body_1.json
chk "rad-us"      "eng/tier147-rad-697/us"                /tmp/multi_body_2.json
chk "rad-xr"      "eng/tier147-rad-697/xray"              /tmp/multi_body_3.json
chk "rad-mam"     "eng/tier147-rad-697/mammo"             /tmp/multi_body_4.json
chk "pat-grs"     "eng/tier147-pat-698/gross"             /tmp/multi_body_5.json
chk "pat-mic"     "eng/tier147-pat-698/micro"             /tmp/multi_body_6.json
chk "pat-frz"     "eng/tier147-pat-698/frozen"            /tmp/multi_body_7.json
chk "pat-cyt"     "eng/tier147-pat-698/cyto"              /tmp/multi_body_8.json
chk "pat-mol"     "eng/tier147-pat-698/molecular"         /tmp/multi_body_9.json
chk "pha-pkc"     "eng/tier147-pha-699/pharmacokinetics"  /tmp/multi_body_10.json
chk "pha-phg"     "eng/tier147-pha-699/pharmacogenomics"  /tmp/multi_body_11.json
chk "pha-stw"     "eng/tier147-pha-699/stewardship"       /tmp/multi_body_12.json
chk "pha-cmp"     "eng/tier147-pha-699/compounding"       /tmp/multi_body_13.json
chk "pha-clp"     "eng/tier147-pha-699/clinical_pharm"    /tmp/multi_body_14.json
chk "pal-pcs"     "eng/tier147-pal-700/consult"           /tmp/multi_body_15.json
chk "pal-plp"     "eng/tier147-pal-700/pain"              /tmp/multi_body_16.json
chk "pal-psy"     "eng/tier147-pal-700/symptom"           /tmp/multi_body_17.json
chk "pal-goc"     "eng/tier147-pal-700/goals_care"        /tmp/multi_body_18.json
chk "pal-hsp"     "eng/tier147-pal-700/hospice"           /tmp/multi_body_19.json
echo "SMOKE: PASS=$PASS FAIL=$FAIL"