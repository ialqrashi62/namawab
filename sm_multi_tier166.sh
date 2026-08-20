#!/usr/bin/env bash
# filepath: sm_multi_tier166.sh
BASE="http://127.0.0.1:3000/api"
PASS=0; FAIL=0
chk(){
  local name="$1"; local route="$2"; local body="$3"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -X POST "$BASE/$route" -d @"$body")
  if [ "$code" = "200" ]; then echo "OK $name ($code)"; PASS=$((PASS+1)); else echo "FAIL $name ($code)"; FAIL=$((FAIL+1)); fi
}
chk "cl-cas"     "eng/tier166-cul-775/cultural_assessment"   /tmp/multi_body_0.json
chk "cl-int"     "eng/tier166-cul-775/interpreter_use"       /tmp/multi_body_1.json
chk "cl-rel"     "eng/tier166-cul-775/religious_considerations" /tmp/multi_body_2.json
chk "cl-chw"     "eng/tier166-cul-775/community_health_worker" /tmp/multi_body_3.json
chk "cl-nav"     "eng/tier166-cul-775/patient_navigator"     /tmp/multi_body_4.json
chk "ps-pev"     "eng/tier166-psy-776/psych_eval"            /tmp/multi_body_5.json
chk "ps-pth"     "eng/tier166-psy-776/psychotherapy"         /tmp/multi_body_6.json
chk "ps-pph"     "eng/tier166-psy-776/psych_pharm"           /tmp/multi_body_7.json
chk "ps-sub"     "eng/tier166-psy-776/substance_use"         /tmp/multi_body_8.json
chk "ps-bhc"     "eng/tier166-psy-776/behavioral_health_crisis" /tmp/multi_body_9.json
chk "dn-dex"     "eng/tier166-den-777/dental_exam"           /tmp/multi_body_10.json
chk "dn-dpr"     "eng/tier166-den-777/dental_procedure"      /tmp/multi_body_11.json
chk "dn-ort"     "eng/tier166-den-777/orthodontic"           /tmp/multi_body_12.json
chk "dn-end"     "eng/tier166-den-777/endodontic"            /tmp/multi_body_13.json
chk "dn-mfs"     "eng/tier166-den-777/maxillofacial_surg"    /tmp/multi_body_14.json
chk "vs-vac"     "eng/tier166-vis-778/visual_acuity"         /tmp/multi_body_15.json
chk "vs-rfr"     "eng/tier166-vis-778/refraction"            /tmp/multi_body_16.json
chk "vs-oex"     "eng/tier166-vis-778/ophthalmic_exam"       /tmp/multi_body_17.json
chk "vs-rsc"     "eng/tier166-vis-778/retinal_screening"     /tmp/multi_body_18.json
chk "vs-pvs"     "eng/tier166-vis-778/pediatric_vision"      /tmp/multi_body_19.json
echo "SMOKE: PASS=$PASS FAIL=$FAIL"