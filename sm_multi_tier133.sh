#!/usr/bin/env bash
# TIER133 Smoke Test
HOST="127.0.0.1"
PORT="3000"
T="m1testA"
PASS=0
FAIL=0
chk(){
  local label="$1"
  local body_file="$2"
  local path="$3"
  local code=$(curl -s -o /tmp/last.json -w "%{http_code}" -H "Content-Type: application/json" -H "x-tenant-id: $T" -X POST --data @"$body_file" "http://$HOST:$PORT$path")
  if [ "$code" = "200" ]; then
    echo "PASS $path ($code)"
    PASS=$((PASS+1))
  else
    echo "FAIL $path ($code)"
    cat /tmp/last.json | head -c 200
    echo
    FAIL=$((FAIL+1))
  fi
}

chk "cohort_builder"   /tmp/multi_body_0.json  /api/pop_v2/cohort_builder
chk "risk_stratifier"  /tmp/multi_body_1.json  /api/pop_v2/risk_stratifier
chk "outreach"         /tmp/multi_body_2.json  /api/pop_v2/outreach_campaign
chk "sdoh"             /tmp/multi_body_3.json  /api/pop_v2/social_determinants
chk "equity"           /tmp/multi_body_4.json  /api/pop_v2/health_equity
chk "disease"          /tmp/multi_body_5.json  /api/php_v2/disease_surveillance
chk "imm_registry"     /tmp/multi_body_6.json  /api/php_v2/immunization_registry
chk "outbreak"         /tmp/multi_body_7.json  /api/php_v2/outbreak_investigation
chk "env_health"       /tmp/multi_body_8.json  /api/php_v2/environmental_health
chk "promotion"        /tmp/multi_body_9.json  /api/php_v2/health_promotion
chk "incidence"        /tmp/multi_body_10.json /api/epi_v2/incidence_rate
chk "prevalence"       /tmp/multi_body_11.json /api/epi_v2/prevalence_study
chk "outbreak_analysis" /tmp/multi_body_12.json /api/epi_v2/outbreak_analysis
chk "risk_factor"      /tmp/multi_body_13.json /api/epi_v2/risk_factor
chk "mortality"        /tmp/multi_body_14.json /api/epi_v2/mortality_stats
chk "vaccine_admin"    /tmp/multi_body_15.json /api/vax_v2/vaccine_admin
chk "schedule"         /tmp/multi_body_16.json /api/vax_v2/schedule_recommend
chk "adverse_event"    /tmp/multi_body_17.json /api/vax_v2/adverse_event
chk "contra"           /tmp/multi_body_18.json /api/vax_v2/contraindication
chk "coverage"         /tmp/multi_body_19.json /api/vax_v2/coverage_report

echo "SMOKE: PASS=$PASS FAIL=$FAIL"
exit $FAIL
