#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_0.json "$H/api/endo_diabetes_v2/diabetes_initial")
if [ "$C" = "200" ]; then echo "OK e_di"; P=$((P+1)); else echo "FAIL e_di ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_1.json "$H/api/endo_diabetes_v2/diabetes_followup")
if [ "$C" = "200" ]; then echo "OK e_df"; P=$((P+1)); else echo "FAIL e_df ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_2.json "$H/api/endo_diabetes_v2/diabetes_insulin_pump")
if [ "$C" = "200" ]; then echo "OK e_dip"; P=$((P+1)); else echo "FAIL e_dip ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_3.json "$H/api/endo_diabetes_v2/diabetes_cgm")
if [ "$C" = "200" ]; then echo "OK e_dcgm"; P=$((P+1)); else echo "FAIL e_dcgm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_4.json "$H/api/endo_diabetes_v2/diabetes_complications")
if [ "$C" = "200" ]; then echo "OK e_dc"; P=$((P+1)); else echo "FAIL e_dc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_5.json "$H/api/endo_thyroid_v2/thyroid_assessment")
if [ "$C" = "200" ]; then echo "OK e_ta"; P=$((P+1)); else echo "FAIL e_ta ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_6.json "$H/api/endo_thyroid_v2/thyroid_ultrasound")
if [ "$C" = "200" ]; then echo "OK e_tu"; P=$((P+1)); else echo "FAIL e_tu ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_7.json "$H/api/endo_thyroid_v2/thyroid_biopsy")
if [ "$C" = "200" ]; then echo "OK e_tb"; P=$((P+1)); else echo "FAIL e_tb ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_8.json "$H/api/endo_thyroid_v2/thyroid_cancer")
if [ "$C" = "200" ]; then echo "OK e_tc"; P=$((P+1)); else echo "FAIL e_tc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_9.json "$H/api/endo_thyroid_v2/thyroid_eye_disease")
if [ "$C" = "200" ]; then echo "OK e_te"; P=$((P+1)); else echo "FAIL e_te ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_10.json "$H/api/endo_adrenal_v2/adrenal_incidentaloma")
if [ "$C" = "200" ]; then echo "OK e_ai"; P=$((P+1)); else echo "FAIL e_ai ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_11.json "$H/api/endo_adrenal_v2/adrenal_workup")
if [ "$C" = "200" ]; then echo "OK e_aw"; P=$((P+1)); else echo "FAIL e_aw ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_12.json "$H/api/endo_adrenal_v2/adrenal_surgery")
if [ "$C" = "200" ]; then echo "OK e_as"; P=$((P+1)); else echo "FAIL e_as ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_13.json "$H/api/endo_adrenal_v2/cushings_workup")
if [ "$C" = "200" ]; then echo "OK e_cw"; P=$((P+1)); else echo "FAIL e_cw ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_14.json "$H/api/endo_adrenal_v2/adrenal_insufficiency")
if [ "$C" = "200" ]; then echo "OK e_ai2"; P=$((P+1)); else echo "FAIL e_ai2 ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_15.json "$H/api/endo_pituitary_v2/pituitary_incidentaloma")
if [ "$C" = "200" ]; then echo "OK e_pi"; P=$((P+1)); else echo "FAIL e_pi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_16.json "$H/api/endo_pituitary_v2/pituitary_function")
if [ "$C" = "200" ]; then echo "OK e_pf"; P=$((P+1)); else echo "FAIL e_pf ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_17.json "$H/api/endo_pituitary_v2/prolactinoma")
if [ "$C" = "200" ]; then echo "OK e_pa"; P=$((P+1)); else echo "FAIL e_pa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_18.json "$H/api/endo_pituitary_v2/acromegaly")
if [ "$C" = "200" ]; then echo "OK e_ac"; P=$((P+1)); else echo "FAIL e_ac ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_19.json "$H/api/endo_pituitary_v2/pituitary_surgery")
if [ "$C" = "200" ]; then echo "OK e_ps"; P=$((P+1)); else echo "FAIL e_ps ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_20.json "$H/api/endo_special_v2/bone_metabolic")
if [ "$C" = "200" ]; then echo "OK e_bm"; P=$((P+1)); else echo "FAIL e_bm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_21.json "$H/api/endo_special_v2/osteoporosis")
if [ "$C" = "200" ]; then echo "OK e_op"; P=$((P+1)); else echo "FAIL e_op ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_22.json "$H/api/endo_special_v2/calcium_disorder")
if [ "$C" = "200" ]; then echo "OK e_cd"; P=$((P+1)); else echo "FAIL e_cd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_23.json "$H/api/endo_special_v2/lipid_specialist")
if [ "$C" = "200" ]; then echo "OK e_ls"; P=$((P+1)); else echo "FAIL e_ls ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_24.json "$H/api/endo_special_v2/pc_os")
if [ "$C" = "200" ]; then echo "OK e_pcos"; P=$((P+1)); else echo "FAIL e_pcos ($C)"; fi
echo PASS=$P FAIL=$F


