#!/usr/bin/env bash
# filepath: sm_multi_tier154.sh
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
chk "ent-eex"     "eng/tier154-ent-725/ent_exam"     /tmp/multi_body_0.json
chk "ent-aud"     "eng/tier154-ent-725/audiology"    /tmp/multi_body_1.json
chk "ent-ens"     "eng/tier154-ent-725/surgery_ent"  /tmp/multi_body_2.json
chk "ent-vcp"     "eng/tier154-ent-725/voice"        /tmp/multi_body_3.json
chk "ent-sns"     "eng/tier154-ent-725/sinus"        /tmp/multi_body_4.json
chk "oms-oms"     "eng/tier154-oms-728/consult"      /tmp/multi_body_5.json
chk "oms-ext"     "eng/tier154-oms-728/extraction"   /tmp/multi_body_6.json
chk "oms-ogn"     "eng/tier154-oms-728/orthognathic" /tmp/multi_body_7.json
chk "oms-trs"     "eng/tier154-oms-728/trauma"       /tmp/multi_body_8.json
chk "oms-opl"     "eng/tier154-oms-728/oral_pathology" /tmp/multi_body_9.json
chk "ort-cns"     "eng/tier154-ort-729/consult"      /tmp/multi_body_10.json
chk "ort-brc"     "eng/tier154-ort-729/braces"       /tmp/multi_body_11.json
chk "ort-aln"     "eng/tier154-ort-729/aligner"      /tmp/multi_body_12.json
chk "ort-rtn"     "eng/tier154-ort-729/retention"    /tmp/multi_body_13.json
chk "ort-orp"     "eng/tier154-ort-729/ortho_progress" /tmp/multi_body_14.json
chk "per-pex"     "eng/tier154-per-730/perio_exam"   /tmp/multi_body_15.json
chk "per-scr"     "eng/tier154-per-730/scaling"      /tmp/multi_body_16.json
chk "per-psg"     "eng/tier154-per-730/surgery_perio" /tmp/multi_body_17.json
chk "per-imp"     "eng/tier154-per-730/implant"      /tmp/multi_body_18.json
chk "per-mnt"     "eng/tier154-per-730/maintenance"  /tmp/multi_body_19.json
echo "SMOKE: PASS=$PASS FAIL=$FAIL"