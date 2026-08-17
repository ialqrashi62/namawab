#!/bin/bash
# Probe ONE endpoint per wave to find which are alive (200/400) vs broken (404/500)
HOST="http://127.0.0.1:3000"
PASS=0
FAIL=0
UNKNOWN=0
probe() {
  local url="$1"; local body="$2"; local name="$3"
  local code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$HOST$url" -H 'Content-Type: application/json' -d "$body")
  if [ "$code" = "200" ] || [ "$code" = "400" ]; then
    echo "ALIVE $name ($code) :: $url"
    PASS=$((PASS+1))
  else
    echo "BROKEN $name ($code) :: $url"
    FAIL=$((FAIL+1))
  fi
}
probe "/api/sdoh_screen/housing" '{"stable_housing":true,"utilities":true,"transportation":true,"interpersonal_safety":true,"financial_strain":false,"food_insecurity":false}' "sdoh_screen"
probe "/api/forensic_mlc/identification" '{"brought_dead":true,"unknown_patient":false,"evidence_conserved":true}' "forensic_mlc"
probe "/api/genobrca/indication" '{"age":40,"family_history":true,"ashkenazi":false}' "genobrca"
probe "/api/genopgx/pgx" '{"drug_name":"warfarin","germline_test":true,"cpic_level":"1A"}' "genopgx"
probe "/api/genopren/cvs" '{"indication":"positive_screen","gestational_age":15,"consent":true}' "genopren"
probe "/api/genocar/carrier" '{"disease":"cystic_fibrosis","preconception":true,"partner_tested":false}' "genocar"
probe "/api/genonbs/result" '{"newborn_age_hours":48,"screen_positive":false,"followup_needed":false}' "genonbs"
probe "/api/genotrio/indication" '{"age":5,"developmental_delay":true,"seizures":false,"microcephaly":false}' "genotrio"
probe "/api/integ_cds/screening" '{"drug":"warfarin","indication":"afib","renal_function":60,"age":70}' "integ_cds"
probe "/api/integ_fhir/patient" '{"resourceType":"Patient","id":"p1","name":"test"}' "integ_fhir"
probe "/api/integ_hl7/msg" '{"triggerevent":"A01","patient_id":"p1"}' "integ_hl7"
probe "/api/integ_ter/lookup" '{"code":"E11.9","system":"ICD-10"}' "integ_ter"
probe "/api/integ_cpl/care" '{"patient_id":"p1","goal":"reduce_BP","target":140,"intervention":"ACE_i"}' "integ_cpl"
probe "/api/integ_ctn/handoff" '{"from_facility":"hosp1","to_facility":"hosp2","patient_id":"p1","summary":"stable"}' "integ_ctn"

echo ""
echo "ALIVE=$PASS BROKEN=$FAIL"