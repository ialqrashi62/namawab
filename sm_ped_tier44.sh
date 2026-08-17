#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ped_body_0.json "$H/api/ped_resp/asthma")
if [ "$C" = "200" ]; then echo "OK k_ast"; P=$((P+1)); else echo "FAIL k_ast ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ped_body_1.json "$H/api/ped_resp/bronchiolitis")
if [ "$C" = "200" ]; then echo "OK k_brn"; P=$((P+1)); else echo "FAIL k_brn ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ped_body_2.json "$H/api/ped_resp/pneumonia")
if [ "$C" = "200" ]; then echo "OK k_pnm"; P=$((P+1)); else echo "FAIL k_pnm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ped_body_3.json "$H/api/ped_resp/croup")
if [ "$C" = "200" ]; then echo "OK k_crp"; P=$((P+1)); else echo "FAIL k_crp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ped_body_4.json "$H/api/ped_resp/foreign_body_aspiration")
if [ "$C" = "200" ]; then echo "OK k_fba"; P=$((P+1)); else echo "FAIL k_fba ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ped_body_5.json "$H/api/ped_neonat/premature_infant")
if [ "$C" = "200" ]; then echo "OK k_pre"; P=$((P+1)); else echo "FAIL k_pre ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ped_body_6.json "$H/api/ped_neonat/respiratory_distress")
if [ "$C" = "200" ]; then echo "OK k_rds"; P=$((P+1)); else echo "FAIL k_rds ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ped_body_7.json "$H/api/ped_neonat/neonatal_jaundice")
if [ "$C" = "200" ]; then echo "OK k_njl"; P=$((P+1)); else echo "FAIL k_njl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ped_body_8.json "$H/api/ped_neonat/sepsis_neonatal")
if [ "$C" = "200" ]; then echo "OK k_nsp"; P=$((P+1)); else echo "FAIL k_nsp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ped_body_9.json "$H/api/ped_neonat/feeding_problem")
if [ "$C" = "200" ]; then echo "OK k_fed"; P=$((P+1)); else echo "FAIL k_fed ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ped_body_10.json "$H/api/ped_gastro/gerd")
if [ "$C" = "200" ]; then echo "OK k_grd"; P=$((P+1)); else echo "FAIL k_grd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ped_body_11.json "$H/api/ped_gastro/constipation_ped")
if [ "$C" = "200" ]; then echo "OK k_cst"; P=$((P+1)); else echo "FAIL k_cst ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ped_body_12.json "$H/api/ped_gastro/celiac_disease")
if [ "$C" = "200" ]; then echo "OK k_clc"; P=$((P+1)); else echo "FAIL k_clc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ped_body_13.json "$H/api/ped_gastro/failure_to_thrive")
if [ "$C" = "200" ]; then echo "OK k_ftt"; P=$((P+1)); else echo "FAIL k_ftt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ped_body_14.json "$H/api/ped_gastro/ibd_ped")
if [ "$C" = "200" ]; then echo "OK k_ibd"; P=$((P+1)); else echo "FAIL k_ibd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ped_body_15.json "$H/api/ped_endo/type1_diabetes_ped")
if [ "$C" = "200" ]; then echo "OK k_dm1"; P=$((P+1)); else echo "FAIL k_dm1 ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ped_body_16.json "$H/api/ped_endo/growth_hormone_deficiency")
if [ "$C" = "200" ]; then echo "OK k_ghd"; P=$((P+1)); else echo "FAIL k_ghd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ped_body_17.json "$H/api/ped_endo/puberty_disorder")
if [ "$C" = "200" ]; then echo "OK k_pub"; P=$((P+1)); else echo "FAIL k_pub ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ped_body_18.json "$H/api/ped_endo/congenital_adrenal_hyp")
if [ "$C" = "200" ]; then echo "OK k_cah"; P=$((P+1)); else echo "FAIL k_cah ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ped_body_19.json "$H/api/ped_endo/thyroid_ped")
if [ "$C" = "200" ]; then echo "OK k_thy"; P=$((P+1)); else echo "FAIL k_thy ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ped_body_20.json "$H/api/ped_immuno/primary_immunodeficiency")
if [ "$C" = "200" ]; then echo "OK k_pid"; P=$((P+1)); else echo "FAIL k_pid ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ped_body_21.json "$H/api/ped_immuno/kawasaki_disease")
if [ "$C" = "200" ]; then echo "OK k_kaw"; P=$((P+1)); else echo "FAIL k_kaw ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ped_body_22.json "$H/api/ped_immuno/juvenile_arthritis_ped")
if [ "$C" = "200" ]; then echo "OK k_jia"; P=$((P+1)); else echo "FAIL k_jia ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ped_body_23.json "$H/api/ped_immuno/vaccination_review")
if [ "$C" = "200" ]; then echo "OK k_vac"; P=$((P+1)); else echo "FAIL k_vac ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ped_body_24.json "$H/api/ped_immuno/allergy_ped")
if [ "$C" = "200" ]; then echo "OK k_alg"; P=$((P+1)); else echo "FAIL k_alg ($C)"; fi
echo PASS=$P FAIL=$F
