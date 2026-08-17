#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_0.json "$H/api/ob_high_risk/preeclampsia")
if [ "$C" = "200" ]; then echo "OK o_pe"; P=$((P+1)); else echo "FAIL o_pe ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_1.json "$H/api/ob_high_risk/gestational_diabetes")
if [ "$C" = "200" ]; then echo "OK o_gd"; P=$((P+1)); else echo "FAIL o_gd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_2.json "$H/api/ob_high_risk/placenta_previa")
if [ "$C" = "200" ]; then echo "OK o_pp"; P=$((P+1)); else echo "FAIL o_pp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_3.json "$H/api/ob_high_risk/preterm_labor")
if [ "$C" = "200" ]; then echo "OK o_ptl"; P=$((P+1)); else echo "FAIL o_ptl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_4.json "$H/api/ob_high_risk/intrauterine_growth_restriction")
if [ "$C" = "200" ]; then echo "OK o_iugr"; P=$((P+1)); else echo "FAIL o_iugr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_5.json "$H/api/ob_fetal/non_stress_test")
if [ "$C" = "200" ]; then echo "OK o_nst"; P=$((P+1)); else echo "FAIL o_nst ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_6.json "$H/api/ob_fetal/biophysical_profile")
if [ "$C" = "200" ]; then echo "OK o_bpp"; P=$((P+1)); else echo "FAIL o_bpp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_7.json "$H/api/ob_fetal/amniotic_fluid_index")
if [ "$C" = "200" ]; then echo "OK o_afi"; P=$((P+1)); else echo "FAIL o_afi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_8.json "$H/api/ob_fetal/doppler_ultrasound")
if [ "$C" = "200" ]; then echo "OK o_dop"; P=$((P+1)); else echo "FAIL o_dop ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_9.json "$H/api/ob_fetal/fetal_heart_rate")
if [ "$C" = "200" ]; then echo "OK o_fhr"; P=$((P+1)); else echo "FAIL o_fhr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_10.json "$H/api/ob_procedures/amniocentesis")
if [ "$C" = "200" ]; then echo "OK o_amn"; P=$((P+1)); else echo "FAIL o_amn ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_11.json "$H/api/ob_procedures/cvs")
if [ "$C" = "200" ]; then echo "OK o_cvs"; P=$((P+1)); else echo "FAIL o_cvs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_12.json "$H/api/ob_procedures/cerclage")
if [ "$C" = "200" ]; then echo "OK o_cer"; P=$((P+1)); else echo "FAIL o_cer ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_13.json "$H/api/ob_procedures/version")
if [ "$C" = "200" ]; then echo "OK o_ver"; P=$((P+1)); else echo "FAIL o_ver ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_14.json "$H/api/ob_procedures/induction_labor")
if [ "$C" = "200" ]; then echo "OK o_ind"; P=$((P+1)); else echo "FAIL o_ind ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_15.json "$H/api/ob_postpartum/postpartum_hemorrhage")
if [ "$C" = "200" ]; then echo "OK o_pph"; P=$((P+1)); else echo "FAIL o_pph ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_16.json "$H/api/ob_postpartum/postpartum_depression")
if [ "$C" = "200" ]; then echo "OK o_ppd"; P=$((P+1)); else echo "FAIL o_ppd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_17.json "$H/api/ob_postpartum/puerperal_sepsis")
if [ "$C" = "200" ]; then echo "OK o_psep"; P=$((P+1)); else echo "FAIL o_psep ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_18.json "$H/api/ob_postpartum/wound_check")
if [ "$C" = "200" ]; then echo "OK o_wc"; P=$((P+1)); else echo "FAIL o_wc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_19.json "$H/api/ob_postpartum/contraception_counseling")
if [ "$C" = "200" ]; then echo "OK o_cc"; P=$((P+1)); else echo "FAIL o_cc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_20.json "$H/api/ob_lactation/latching_problem")
if [ "$C" = "200" ]; then echo "OK o_lat"; P=$((P+1)); else echo "FAIL o_lat ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_21.json "$H/api/ob_lactation/mastitis")
if [ "$C" = "200" ]; then echo "OK o_mas"; P=$((P+1)); else echo "FAIL o_mas ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_22.json "$H/api/ob_lactation/low_milk_supply")
if [ "$C" = "200" ]; then echo "OK o_lms"; P=$((P+1)); else echo "FAIL o_lms ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_23.json "$H/api/ob_lactation/weaning")
if [ "$C" = "200" ]; then echo "OK o_wea"; P=$((P+1)); else echo "FAIL o_wea ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_24.json "$H/api/ob_lactation/breastfeeding_medication")
if [ "$C" = "200" ]; then echo "OK o_med"; P=$((P+1)); else echo "FAIL o_med ($C)"; fi
echo PASS=$P FAIL=$F
