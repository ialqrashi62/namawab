#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/px_body_0.json "$H/api/px_satis/patient_complaint_resolution")
if [ "$C" = "200" ]; then echo "OK p_pcr"; P=$((P+1)); else echo "FAIL p_pcr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/px_body_1.json "$H/api/px_satis/patient_satisfaction_survey")
if [ "$C" = "200" ]; then echo "OK p_pss"; P=$((P+1)); else echo "FAIL p_pss ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/px_body_2.json "$H/api/px_satis/patient_testimonial")
if [ "$C" = "200" ]; then echo "OK p_ptm"; P=$((P+1)); else echo "FAIL p_ptm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/px_body_3.json "$H/api/px_satis/patient_loyalty")
if [ "$C" = "200" ]; then echo "OK p_plty"; P=$((P+1)); else echo "FAIL p_plty ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/px_body_4.json "$H/api/px_satis/patient_advocacy")
if [ "$C" = "200" ]; then echo "OK p_padv"; P=$((P+1)); else echo "FAIL p_padv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/px_body_5.json "$H/api/px_engage/patient_engagement")
if [ "$C" = "200" ]; then echo "OK p_peg"; P=$((P+1)); else echo "FAIL p_peg ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/px_body_6.json "$H/api/px_engage/patient_community")
if [ "$C" = "200" ]; then echo "OK p_pco"; P=$((P+1)); else echo "FAIL p_pco ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/px_body_7.json "$H/api/px_engage/patient_education_enrollment")
if [ "$C" = "200" ]; then echo "OK p_pee"; P=$((P+1)); else echo "FAIL p_pee ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/px_body_8.json "$H/api/px_engage/patient_workshop")
if [ "$C" = "200" ]; then echo "OK p_pwk"; P=$((P+1)); else echo "FAIL p_pwk ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/px_body_9.json "$H/api/px_engage/patient_app_feature_use")
if [ "$C" = "200" ]; then echo "OK p_paf"; P=$((P+1)); else echo "FAIL p_paf ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/px_body_10.json "$H/api/px_access/patient_self_registration")
if [ "$C" = "200" ]; then echo "OK p_psr"; P=$((P+1)); else echo "FAIL p_psr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/px_body_11.json "$H/api/px_access/patient_portal_access")
if [ "$C" = "200" ]; then echo "OK p_ppa"; P=$((P+1)); else echo "FAIL p_ppa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/px_body_12.json "$H/api/px_access/patient_mobile_app")
if [ "$C" = "200" ]; then echo "OK p_pma"; P=$((P+1)); else echo "FAIL p_pma ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/px_body_13.json "$H/api/px_access/patient_waitlist")
if [ "$C" = "200" ]; then echo "OK p_pwl"; P=$((P+1)); else echo "FAIL p_pwl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/px_body_14.json "$H/api/px_access/patient_referral_tracking")
if [ "$C" = "200" ]; then echo "OK p_prt"; P=$((P+1)); else echo "FAIL p_prt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/px_body_15.json "$H/api/px_feedback/patient_praise")
if [ "$C" = "200" ]; then echo "OK p_pp"; P=$((P+1)); else echo "FAIL p_pp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/px_body_16.json "$H/api/px_feedback/patient_suggestion")
if [ "$C" = "200" ]; then echo "OK p_psg"; P=$((P+1)); else echo "FAIL p_psg ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/px_body_17.json "$H/api/px_feedback/patient_real_time_pulse")
if [ "$C" = "200" ]; then echo "OK p_prp"; P=$((P+1)); else echo "FAIL p_prp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/px_body_18.json "$H/api/px_feedback/patient_focus_group")
if [ "$C" = "200" ]; then echo "OK p_pfg"; P=$((P+1)); else echo "FAIL p_pfg ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/px_body_19.json "$H/api/px_feedback/patient_quality_partner")
if [ "$C" = "200" ]; then echo "OK p_pqp"; P=$((P+1)); else echo "FAIL p_pqp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/px_body_20.json "$H/api/px_journey/patient_journey_map")
if [ "$C" = "200" ]; then echo "OK p_pjm"; P=$((P+1)); else echo "FAIL p_pjm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/px_body_21.json "$H/api/px_journey/patient_first_impression")
if [ "$C" = "200" ]; then echo "OK p_pfi"; P=$((P+1)); else echo "FAIL p_pfi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/px_body_22.json "$H/api/px_journey/patient_visit_summary")
if [ "$C" = "200" ]; then echo "OK p_pvs"; P=$((P+1)); else echo "FAIL p_pvs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/px_body_23.json "$H/api/px_journey/patient_discharge_journey")
if [ "$C" = "200" ]; then echo "OK p_pdj"; P=$((P+1)); else echo "FAIL p_pdj ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/px_body_24.json "$H/api/px_journey/patient_continuity_care")
if [ "$C" = "200" ]; then echo "OK p_pcc"; P=$((P+1)); else echo "FAIL p_pcc ($C)"; fi
echo PASS=$P FAIL=$F
