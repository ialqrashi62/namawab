#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_0.json "$H/api/pulm_copd/copd_staging")
if [ "$C" = "200" ]; then echo "OK p_cs"; P=$((P+1)); else echo "FAIL p_cs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_1.json "$H/api/pulm_copd/exacerbation")
if [ "$C" = "200" ]; then echo "OK p_exa"; P=$((P+1)); else echo "FAIL p_exa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_2.json "$H/api/pulm_copd/oxygen_therapy")
if [ "$C" = "200" ]; then echo "OK p_o2"; P=$((P+1)); else echo "FAIL p_o2 ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_3.json "$H/api/pulm_copd/pulmonary_rehab")
if [ "$C" = "200" ]; then echo "OK p_reh"; P=$((P+1)); else echo "FAIL p_reh ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_4.json "$H/api/pulm_copd/smoking_cessation")
if [ "$C" = "200" ]; then echo "OK p_sm"; P=$((P+1)); else echo "FAIL p_sm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_5.json "$H/api/pulm_asthma/asthma_control")
if [ "$C" = "200" ]; then echo "OK p_ac"; P=$((P+1)); else echo "FAIL p_ac ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_6.json "$H/api/pulm_asthma/biologic_therapy")
if [ "$C" = "200" ]; then echo "OK p_bio"; P=$((P+1)); else echo "FAIL p_bio ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_7.json "$H/api/pulm_asthma/severe_asthma")
if [ "$C" = "200" ]; then echo "OK p_sev"; P=$((P+1)); else echo "FAIL p_sev ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_8.json "$H/api/pulm_asthma/asthma_action_plan")
if [ "$C" = "200" ]; then echo "OK p_ap"; P=$((P+1)); else echo "FAIL p_ap ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_9.json "$H/api/pulm_asthma/occupational_asthma")
if [ "$C" = "200" ]; then echo "OK p_oa"; P=$((P+1)); else echo "FAIL p_oa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_10.json "$H/api/pulm_sleep/sleep_study")
if [ "$C" = "200" ]; then echo "OK p_stu"; P=$((P+1)); else echo "FAIL p_stu ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_11.json "$H/api/pulm_sleep/osa_severity")
if [ "$C" = "200" ]; then echo "OK p_osa"; P=$((P+1)); else echo "FAIL p_osa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_12.json "$H/api/pulm_sleep/cpap_titration")
if [ "$C" = "200" ]; then echo "OK p_tit"; P=$((P+1)); else echo "FAIL p_tit ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_13.json "$H/api/pulm_sleep/sleep_hygiene")
if [ "$C" = "200" ]; then echo "OK p_hyg"; P=$((P+1)); else echo "FAIL p_hyg ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_14.json "$H/api/pulm_sleep/sleep_medication")
if [ "$C" = "200" ]; then echo "OK p_med"; P=$((P+1)); else echo "FAIL p_med ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_15.json "$H/api/pulm_ild/ild_classification")
if [ "$C" = "200" ]; then echo "OK p_ildc"; P=$((P+1)); else echo "FAIL p_ildc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_16.json "$H/api/pulm_ild/ild_progression")
if [ "$C" = "200" ]; then echo "OK p_ildp"; P=$((P+1)); else echo "FAIL p_ildp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_17.json "$H/api/pulm_ild/antifibrotic_therapy")
if [ "$C" = "200" ]; then echo "OK p_anti"; P=$((P+1)); else echo "FAIL p_anti ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_18.json "$H/api/pulm_ild/oxygen_ild")
if [ "$C" = "200" ]; then echo "OK p_o2i"; P=$((P+1)); else echo "FAIL p_o2i ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_19.json "$H/api/pulm_ild/lung_transplant_eval")
if [ "$C" = "200" ]; then echo "OK p_ltx"; P=$((P+1)); else echo "FAIL p_ltx ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_20.json "$H/api/pulm_pc/ventilator_management")
if [ "$C" = "200" ]; then echo "OK p_vent"; P=$((P+1)); else echo "FAIL p_vent ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_21.json "$H/api/pulm_pc/weaning_protocol")
if [ "$C" = "200" ]; then echo "OK p_wean"; P=$((P+1)); else echo "FAIL p_wean ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_22.json "$H/api/pulm_pc/ards_protocol")
if [ "$C" = "200" ]; then echo "OK p_ards"; P=$((P+1)); else echo "FAIL p_ards ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_23.json "$H/api/pulm_pc/tracheostomy")
if [ "$C" = "200" ]; then echo "OK p_trach"; P=$((P+1)); else echo "FAIL p_trach ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_24.json "$H/api/pulm_pc/icu_bronchoscopy")
if [ "$C" = "200" ]; then echo "OK p_bronc"; P=$((P+1)); else echo "FAIL p_bronc ($C)"; fi
echo PASS=$P FAIL=$F
