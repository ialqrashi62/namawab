#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tri_body_0.json "$H/api/triage_acu/esi_level_1")
if [ "$C" = "200" ]; then echo "OK t_esi1"; P=$((P+1)); else echo "FAIL t_esi1 ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tri_body_1.json "$H/api/triage_acu/esi_level_2")
if [ "$C" = "200" ]; then echo "OK t_esi2"; P=$((P+1)); else echo "FAIL t_esi2 ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tri_body_2.json "$H/api/triage_acu/esi_level_3")
if [ "$C" = "200" ]; then echo "OK t_esi3"; P=$((P+1)); else echo "FAIL t_esi3 ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tri_body_3.json "$H/api/triage_acu/esi_level_4")
if [ "$C" = "200" ]; then echo "OK t_esi4"; P=$((P+1)); else echo "FAIL t_esi4 ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tri_body_4.json "$H/api/triage_acu/esi_level_5")
if [ "$C" = "200" ]; then echo "OK t_esi5"; P=$((P+1)); else echo "FAIL t_esi5 ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tri_body_5.json "$H/api/triage_intake/chief_complaint_evaluation")
if [ "$C" = "200" ]; then echo "OK t_chf"; P=$((P+1)); else echo "FAIL t_chf ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tri_body_6.json "$H/api/triage_intake/vital_signs_triage")
if [ "$C" = "200" ]; then echo "OK t_vst"; P=$((P+1)); else echo "FAIL t_vst ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tri_body_7.json "$H/api/triage_intake/presenting_symptoms")
if [ "$C" = "200" ]; then echo "OK t_psm"; P=$((P+1)); else echo "FAIL t_psm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tri_body_8.json "$H/api/triage_intake/allergy_history")
if [ "$C" = "200" ]; then echo "OK t_alg"; P=$((P+1)); else echo "FAIL t_alg ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tri_body_9.json "$H/api/triage_intake/medication_reconciliation")
if [ "$C" = "200" ]; then echo "OK t_med"; P=$((P+1)); else echo "FAIL t_med ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tri_body_10.json "$H/api/triage_screen/suicide_risk_screen")
if [ "$C" = "200" ]; then echo "OK t_sui"; P=$((P+1)); else echo "FAIL t_sui ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tri_body_11.json "$H/api/triage_screen/substance_use_screen")
if [ "$C" = "200" ]; then echo "OK t_sub"; P=$((P+1)); else echo "FAIL t_sub ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tri_body_12.json "$H/api/triage_screen/domestic_violence_screen")
if [ "$C" = "200" ]; then echo "OK t_dv"; P=$((P+1)); else echo "FAIL t_dv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tri_body_13.json "$H/api/triage_screen/trauma_screen")
if [ "$C" = "200" ]; then echo "OK t_trm"; P=$((P+1)); else echo "FAIL t_trm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tri_body_14.json "$H/api/triage_screen/psychiatric_screen")
if [ "$C" = "200" ]; then echo "OK t_psy"; P=$((P+1)); else echo "FAIL t_psy ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tri_body_15.json "$H/api/triage_ped/ped_assessment_triangle")
if [ "$C" = "200" ]; then echo "OK t_ped"; P=$((P+1)); else echo "FAIL t_ped ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tri_body_16.json "$H/api/triage_ped/ped_color_breath_circulation")
if [ "$C" = "200" ]; then echo "OK t_cbc"; P=$((P+1)); else echo "FAIL t_cbc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tri_body_17.json "$H/api/triage_ped/ped_illness_severity")
if [ "$C" = "200" ]; then echo "OK t_pis"; P=$((P+1)); else echo "FAIL t_pis ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tri_body_18.json "$H/api/triage_ped/ped_pain_assessment")
if [ "$C" = "200" ]; then echo "OK t_ppa"; P=$((P+1)); else echo "FAIL t_ppa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tri_body_19.json "$H/api/triage_ped/ped_growth_review")
if [ "$C" = "200" ]; then echo "OK t_pgr"; P=$((P+1)); else echo "FAIL t_pgr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tri_body_20.json "$H/api/triage_disp/discharge_instructions")
if [ "$C" = "200" ]; then echo "OK t_dci"; P=$((P+1)); else echo "FAIL t_dci ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tri_body_21.json "$H/api/triage_disp/referral_placement")
if [ "$C" = "200" ]; then echo "OK t_ref"; P=$((P+1)); else echo "FAIL t_ref ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tri_body_22.json "$H/api/triage_disp/follow_up_appointment")
if [ "$C" = "200" ]; then echo "OK t_fup"; P=$((P+1)); else echo "FAIL t_fup ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tri_body_23.json "$H/api/triage_disp/return_precaution")
if [ "$C" = "200" ]; then echo "OK t_rtc"; P=$((P+1)); else echo "FAIL t_rtc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tri_body_24.json "$H/api/triage_disp/community_resources")
if [ "$C" = "200" ]; then echo "OK t_cmr"; P=$((P+1)); else echo "FAIL t_cmr ($C)"; fi
echo PASS=$P FAIL=$F
