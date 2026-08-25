#!/usr/bin/env bash
# filepath: sm_multi_tier162.sh
BASE="http://127.0.0.1:3000/api"
PASS=0; FAIL=0
chk(){
  local name="$1"; local route="$2"; local body="$3"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -X POST "$BASE/$route" -d @"$body")
  if [ "$code" = "200" ]; then echo "OK $name ($code)"; PASS=$((PASS+1)); else echo "FAIL $name ($code)"; FAIL=$((FAIL+1)); fi
}
chk "pb-epi"     "eng/tier162-pub-759/epidemiology"    /tmp/multi_body_0.json
chk "pb-out"     "eng/tier162-pub-759/outbreak"        /tmp/multi_body_1.json
chk "pb-scr"     "eng/tier162-pub-759/screening"       /tmp/multi_body_2.json
chk "pb-ctc"     "eng/tier162-pub-759/contact_tracing" /tmp/multi_body_3.json
chk "pb-heq"     "eng/tier162-pub-759/health_equity"   /tmp/multi_body_4.json
chk "pv-imm"     "eng/tier162-prev-760/immunization"   /tmp/multi_body_5.json
chk "pv-cmp"     "eng/tier162-prev-760/chemoprevention" /tmp/multi_body_6.json
chk "pv-lsc"     "eng/tier162-prev-760/lifestyle_counsel" /tmp/multi_body_7.json
chk "pv-scp"     "eng/tier162-prev-760/screening_prog"  /tmp/multi_body_8.json
chk "pv-rsk"     "eng/tier162-prev-760/risk_assessment" /tmp/multi_body_9.json
chk "oc-wfk"     "eng/tier162-occ-761/work_fitness"     /tmp/multi_body_10.json
chk "oc-exe"     "eng/tier162-occ-761/exposure_eval"    /tmp/multi_body_11.json
chk "oc-erg"     "eng/tier162-occ-761/ergonomics"       /tmp/multi_body_12.json
chk "oc-rsf"     "eng/tier162-occ-761/respirator_fit"   /tmp/multi_body_13.json
chk "oc-rtw"     "eng/tier162-occ-761/return_to_work"   /tmp/multi_body_14.json
chk "av-pil"     "eng/tier162-avi-762/pilot_exam"       /tmp/multi_body_15.json
chk "av-dec"     "eng/tier162-avi-762/decompression"    /tmp/multi_body_16.json
chk "av-hyp"     "eng/tier162-avi-762/hypoxia"          /tmp/multi_body_17.json
chk "av-gfc"     "eng/tier162-avi-762/g_force"          /tmp/multi_body_18.json
chk "av-hyb"     "eng/tier162-avi-762/hyperbaric"       /tmp/multi_body_19.json
echo "SMOKE: PASS=$PASS FAIL=$FAIL"