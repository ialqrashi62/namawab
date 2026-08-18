#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nut_body_0.json "$H/api/nut_assess/nutrition_screening")
if [ "$C" = "200" ]; then echo "OK n_ns"; P=$((P+1)); else echo "FAIL n_ns ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nut_body_1.json "$H/api/nut_assess/malnutrition_assessment")
if [ "$C" = "200" ]; then echo "OK n_ma"; P=$((P+1)); else echo "FAIL n_ma ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nut_body_2.json "$H/api/nut_assess/anthropometric_measurements")
if [ "$C" = "200" ]; then echo "OK n_am"; P=$((P+1)); else echo "FAIL n_am ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nut_body_3.json "$H/api/nut_assess/dietary_intake_assessment")
if [ "$C" = "200" ]; then echo "OK n_dia"; P=$((P+1)); else echo "FAIL n_dia ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nut_body_4.json "$H/api/nut_assess/food_allergy_assessment")
if [ "$C" = "200" ]; then echo "OK n_faa"; P=$((P+1)); else echo "FAIL n_faa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nut_body_5.json "$H/api/nut_intervention/nutrition_counseling")
if [ "$C" = "200" ]; then echo "OK n_nc"; P=$((P+1)); else echo "FAIL n_nc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nut_body_6.json "$H/api/nut_intervention/medical_nutrition_therapy")
if [ "$C" = "200" ]; then echo "OK n_mnt"; P=$((P+1)); else echo "FAIL n_mnt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nut_body_7.json "$H/api/nut_intervention/supplement_recommendation")
if [ "$C" = "200" ]; then echo "OK n_sr"; P=$((P+1)); else echo "FAIL n_sr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nut_body_8.json "$H/api/nut_intervention/enteral_feeding")
if [ "$C" = "200" ]; then echo "OK n_ef"; P=$((P+1)); else echo "FAIL n_ef ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nut_body_9.json "$H/api/nut_intervention/parenteral_nutrition")
if [ "$C" = "200" ]; then echo "OK n_pn"; P=$((P+1)); else echo "FAIL n_pn ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nut_body_10.json "$H/api/nut_clinical/diabetes_medical_nutrition")
if [ "$C" = "200" ]; then echo "OK n_dmn"; P=$((P+1)); else echo "FAIL n_dmn ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nut_body_11.json "$H/api/nut_clinical/renal_diet_education")
if [ "$C" = "200" ]; then echo "OK n_rde"; P=$((P+1)); else echo "FAIL n_rde ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nut_body_12.json "$H/api/nut_clinical/cardiac_diet_education")
if [ "$C" = "200" ]; then echo "OK n_cde"; P=$((P+1)); else echo "FAIL n_cde ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nut_body_13.json "$H/api/nut_clinical/oncology_nutrition_support")
if [ "$C" = "200" ]; then echo "OK n_ons"; P=$((P+1)); else echo "FAIL n_ons ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nut_body_14.json "$H/api/nut_clinical/weight_management")
if [ "$C" = "200" ]; then echo "OK n_wm"; P=$((P+1)); else echo "FAIL n_wm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nut_body_15.json "$H/api/nut_pediatric/breast_feeding_support")
if [ "$C" = "200" ]; then echo "OK n_bfs"; P=$((P+1)); else echo "FAIL n_bfs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nut_body_16.json "$H/api/nut_pediatric/infant_formula")
if [ "$C" = "200" ]; then echo "OK n_if"; P=$((P+1)); else echo "FAIL n_if ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nut_body_17.json "$H/api/nut_pediatric/intolerance_assessment_pediatric")
if [ "$C" = "200" ]; then echo "OK n_iap"; P=$((P+1)); else echo "FAIL n_iap ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nut_body_18.json "$H/api/nut_pediatric/pediatric_growth_assessment")
if [ "$C" = "200" ]; then echo "OK n_pga"; P=$((P+1)); else echo "FAIL n_pga ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nut_body_19.json "$H/api/nut_pediatric/pediatric_nutrition_counseling")
if [ "$C" = "200" ]; then echo "OK n_pnc"; P=$((P+1)); else echo "FAIL n_pnc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nut_body_20.json "$H/api/nut_admin/tpn_compounding")
if [ "$C" = "200" ]; then echo "OK n_tpn"; P=$((P+1)); else echo "FAIL n_tpn ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nut_body_21.json "$H/api/nut_admin/formula_room")
if [ "$C" = "200" ]; then echo "OK n_fr"; P=$((P+1)); else echo "FAIL n_fr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nut_body_22.json "$H/api/nut_admin/diet_office_orders")
if [ "$C" = "200" ]; then echo "OK n_doo"; P=$((P+1)); else echo "FAIL n_doo ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nut_body_23.json "$H/api/nut_admin/food_service_isolation")
if [ "$C" = "200" ]; then echo "OK n_fsi"; P=$((P+1)); else echo "FAIL n_fsi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nut_body_24.json "$H/api/nut_admin/catering_therapeutic")
if [ "$C" = "200" ]; then echo "OK n_ct"; P=$((P+1)); else echo "FAIL n_ct ($C)"; fi
echo PASS=$P FAIL=$F
