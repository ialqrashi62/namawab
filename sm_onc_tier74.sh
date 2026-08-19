#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_0.json "$H/api/onc_ext_treat/chemo_regimen_select")
if [ "$C" = "200" ]; then echo "OK o_crs"; P=$((P+1)); else echo "FAIL o_crs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_1.json "$H/api/onc_ext_treat/targeted_therapy_order")
if [ "$C" = "200" ]; then echo "OK o_tto"; P=$((P+1)); else echo "FAIL o_tto ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_2.json "$H/api/onc_ext_treat/immunotherapy_order")
if [ "$C" = "200" ]; then echo "OK o_io"; P=$((P+1)); else echo "FAIL o_io ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_3.json "$H/api/onc_ext_treat/hormone_therapy_order")
if [ "$C" = "200" ]; then echo "OK o_hto"; P=$((P+1)); else echo "FAIL o_hto ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_4.json "$H/api/onc_ext_treat/radiation_oncology_order")
if [ "$C" = "200" ]; then echo "OK o_roo"; P=$((P+1)); else echo "FAIL o_roo ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_5.json "$H/api/onc_ext_followup/cancer_surveillance")
if [ "$C" = "200" ]; then echo "OK o_cs"; P=$((P+1)); else echo "FAIL o_cs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_6.json "$H/api/onc_ext_followup/recurrence_detection")
if [ "$C" = "200" ]; then echo "OK o_rd"; P=$((P+1)); else echo "FAIL o_rd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_7.json "$H/api/onc_ext_followup/survivorship_care_plan")
if [ "$C" = "200" ]; then echo "OK o_scp"; P=$((P+1)); else echo "FAIL o_scp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_8.json "$H/api/onc_ext_followup/late_effects_screening")
if [ "$C" = "200" ]; then echo "OK o_les"; P=$((P+1)); else echo "FAIL o_les ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_9.json "$H/api/onc_ext_followup/palliative_care_integration")
if [ "$C" = "200" ]; then echo "OK o_pci"; P=$((P+1)); else echo "FAIL o_pci ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_10.json "$H/api/onc_ext_special/tumor_board_review")
if [ "$C" = "200" ]; then echo "OK o_tbr"; P=$((P+1)); else echo "FAIL o_tbr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_11.json "$H/api/onc_ext_special/genetic_counseling_onc")
if [ "$C" = "200" ]; then echo "OK o_gco"; P=$((P+1)); else echo "FAIL o_gco ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_12.json "$H/api/onc_ext_special/cancer_staging")
if [ "$C" = "200" ]; then echo "OK o_cs2"; P=$((P+1)); else echo "FAIL o_cs2 ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_13.json "$H/api/onc_ext_special/performance_status")
if [ "$C" = "200" ]; then echo "OK o_ps"; P=$((P+1)); else echo "FAIL o_ps ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_14.json "$H/api/onc_ext_special/clinical_trial_screening")
if [ "$C" = "200" ]; then echo "OK o_cts"; P=$((P+1)); else echo "FAIL o_cts ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_15.json "$H/api/onc_ext_symptom/cancer_pain_management")
if [ "$C" = "200" ]; then echo "OK o_cpm"; P=$((P+1)); else echo "FAIL o_cpm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_16.json "$H/api/onc_ext_symptom/nausea_management_chemo")
if [ "$C" = "200" ]; then echo "OK o_nmc"; P=$((P+1)); else echo "FAIL o_nmc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_17.json "$H/api/onc_ext_symptom/fatigue_assessment")
if [ "$C" = "200" ]; then echo "OK o_fa"; P=$((P+1)); else echo "FAIL o_fa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_18.json "$H/api/onc_ext_symptom/cancer_associated_thrombosis")
if [ "$C" = "200" ]; then echo "OK o_cat"; P=$((P+1)); else echo "FAIL o_cat ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_19.json "$H/api/onc_ext_symptom/cachexia_assessment")
if [ "$C" = "200" ]; then echo "OK o_ca2"; P=$((P+1)); else echo "FAIL o_ca2 ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_20.json "$H/api/onc_ext_support/psycho_oncology_support")
if [ "$C" = "200" ]; then echo "OK o_pos"; P=$((P+1)); else echo "FAIL o_pos ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_21.json "$H/api/onc_ext_support/spiritual_care")
if [ "$C" = "200" ]; then echo "OK o_sc"; P=$((P+1)); else echo "FAIL o_sc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_22.json "$H/api/onc_ext_support/financial_navigation_cancer")
if [ "$C" = "200" ]; then echo "OK o_fnc"; P=$((P+1)); else echo "FAIL o_fnc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_23.json "$H/api/onc_ext_support/survivorship_program")
if [ "$C" = "200" ]; then echo "OK o_sp"; P=$((P+1)); else echo "FAIL o_sp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_24.json "$H/api/onc_ext_support/caregiver_assessment")
if [ "$C" = "200" ]; then echo "OK o_cga"; P=$((P+1)); else echo "FAIL o_cga ($C)"; fi
echo PASS=$P FAIL=$F
