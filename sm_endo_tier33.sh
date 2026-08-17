#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_0.json "$H/api/endo_diabetes/dm_diagnosis")
if [ "$C" = "200" ]; then echo "OK e_dd"; P=$((P+1)); else echo "FAIL e_dd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_1.json "$H/api/endo_diabetes/hba1c_target")
if [ "$C" = "200" ]; then echo "OK e_ht"; P=$((P+1)); else echo "FAIL e_ht ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_2.json "$H/api/endo_diabetes/insulin_regimen")
if [ "$C" = "200" ]; then echo "OK e_ir"; P=$((P+1)); else echo "FAIL e_ir ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_3.json "$H/api/endo_diabetes/glucose_monitoring")
if [ "$C" = "200" ]; then echo "OK e_gm"; P=$((P+1)); else echo "FAIL e_gm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_4.json "$H/api/endo_diabetes/dm_complications")
if [ "$C" = "200" ]; then echo "OK e_dm"; P=$((P+1)); else echo "FAIL e_dm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_5.json "$H/api/endo_thyroid/thyroid_function")
if [ "$C" = "200" ]; then echo "OK e_tf"; P=$((P+1)); else echo "FAIL e_tf ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_6.json "$H/api/endo_thyroid/thyroid_nodule")
if [ "$C" = "200" ]; then echo "OK e_tn"; P=$((P+1)); else echo "FAIL e_tn ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_7.json "$H/api/endo_thyroid/hyperthyroid")
if [ "$C" = "200" ]; then echo "OK e_hy"; P=$((P+1)); else echo "FAIL e_hy ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_8.json "$H/api/endo_thyroid/hypothyroid")
if [ "$C" = "200" ]; then echo "OK e_ho"; P=$((P+1)); else echo "FAIL e_ho ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_9.json "$H/api/endo_thyroid/thyroid_cancer")
if [ "$C" = "200" ]; then echo "OK e_tc"; P=$((P+1)); else echo "FAIL e_tc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_10.json "$H/api/endo_adrenal/adrenal_incidentaloma")
if [ "$C" = "200" ]; then echo "OK e_ai"; P=$((P+1)); else echo "FAIL e_ai ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_11.json "$H/api/endo_adrenal/cushing_syndrome")
if [ "$C" = "200" ]; then echo "OK e_cu"; P=$((P+1)); else echo "FAIL e_cu ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_12.json "$H/api/endo_adrenal/adrenal_insufficiency")
if [ "$C" = "200" ]; then echo "OK e_insuf"; P=$((P+1)); else echo "FAIL e_insuf ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_13.json "$H/api/endo_adrenal/primary_aldosteronism")
if [ "$C" = "200" ]; then echo "OK e_pa"; P=$((P+1)); else echo "FAIL e_pa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_14.json "$H/api/endo_adrenal/pheochromocytoma")
if [ "$C" = "200" ]; then echo "OK e_ph"; P=$((P+1)); else echo "FAIL e_ph ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_15.json "$H/api/endo_pituitary/pituitary_adenoma")
if [ "$C" = "200" ]; then echo "OK e_pa2"; P=$((P+1)); else echo "FAIL e_pa2 ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_16.json "$H/api/endo_pituitary/prolactinoma")
if [ "$C" = "200" ]; then echo "OK e_prl"; P=$((P+1)); else echo "FAIL e_prl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_17.json "$H/api/endo_pituitary/acromegaly")
if [ "$C" = "200" ]; then echo "OK e_ac"; P=$((P+1)); else echo "FAIL e_ac ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_18.json "$H/api/endo_pituitary/diabetes_insipidus")
if [ "$C" = "200" ]; then echo "OK e_di"; P=$((P+1)); else echo "FAIL e_di ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_19.json "$H/api/endo_pituitary/pituitary_apoplexy")
if [ "$C" = "200" ]; then echo "OK e_ap"; P=$((P+1)); else echo "FAIL e_ap ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_20.json "$H/api/endo_metabolic/obesity_management")
if [ "$C" = "200" ]; then echo "OK e_ob"; P=$((P+1)); else echo "FAIL e_ob ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_21.json "$H/api/endo_metabolic/lipid_management")
if [ "$C" = "200" ]; then echo "OK e_lp"; P=$((P+1)); else echo "FAIL e_lp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_22.json "$H/api/endo_metabolic/osteoporosis")
if [ "$C" = "200" ]; then echo "OK e_os"; P=$((P+1)); else echo "FAIL e_os ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_23.json "$H/api/endo_metabolic/pcos")
if [ "$C" = "200" ]; then echo "OK e_pc"; P=$((P+1)); else echo "FAIL e_pc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/endo_body_24.json "$H/api/endo_metabolic/gender_dysphoria")
if [ "$C" = "200" ]; then echo "OK e_gd"; P=$((P+1)); else echo "FAIL e_gd ($C)"; fi
echo PASS=$P FAIL=$F
