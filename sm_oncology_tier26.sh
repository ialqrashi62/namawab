#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_0.json "$H/api/oncology_tumor/tnm_stage")
if [ "$C" = "200" ]; then echo "OK o_tnm"; P=$((P+1)); else echo "FAIL o_tnm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_1.json "$H/api/oncology_tumor/tumor_board")
if [ "$C" = "200" ]; then echo "OK o_tb"; P=$((P+1)); else echo "FAIL o_tb ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_2.json "$H/api/oncology_tumor/molecular")
if [ "$C" = "200" ]; then echo "OK o_mol"; P=$((P+1)); else echo "FAIL o_mol ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_3.json "$H/api/oncology_tumor/ecog")
if [ "$C" = "200" ]; then echo "OK o_eco"; P=$((P+1)); else echo "FAIL o_eco ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_4.json "$H/api/oncology_tumor/mdt_coordination")
if [ "$C" = "200" ]; then echo "OK o_mdt"; P=$((P+1)); else echo "FAIL o_mdt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_5.json "$H/api/oncology_chemo/bsa")
if [ "$C" = "200" ]; then echo "OK o_bsa"; P=$((P+1)); else echo "FAIL o_bsa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_6.json "$H/api/oncology_chemo/regimen")
if [ "$C" = "200" ]; then echo "OK o_reg"; P=$((P+1)); else echo "FAIL o_reg ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_7.json "$H/api/oncology_chemo/toxicity")
if [ "$C" = "200" ]; then echo "OK o_tox"; P=$((P+1)); else echo "FAIL o_tox ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_8.json "$H/api/oncology_chemo/premed")
if [ "$C" = "200" ]; then echo "OK o_pre"; P=$((P+1)); else echo "FAIL o_pre ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_9.json "$H/api/oncology_chemo/response")
if [ "$C" = "200" ]; then echo "OK o_res"; P=$((P+1)); else echo "FAIL o_res ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_10.json "$H/api/oncology_radiation/radiation_dose")
if [ "$C" = "200" ]; then echo "OK o_dose"; P=$((P+1)); else echo "FAIL o_dose ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_11.json "$H/api/oncology_radiation/organs_at_risk")
if [ "$C" = "200" ]; then echo "OK o_oar"; P=$((P+1)); else echo "FAIL o_oar ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_12.json "$H/api/oncology_radiation/simulation")
if [ "$C" = "200" ]; then echo "OK o_sim"; P=$((P+1)); else echo "FAIL o_sim ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_13.json "$H/api/oncology_radiation/brachy")
if [ "$C" = "200" ]; then echo "OK o_brch"; P=$((P+1)); else echo "FAIL o_brch ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_14.json "$H/api/oncology_radiation/followup_radiation")
if [ "$C" = "200" ]; then echo "OK o_fu"; P=$((P+1)); else echo "FAIL o_fu ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_15.json "$H/api/oncology_palliative/pain_assess")
if [ "$C" = "200" ]; then echo "OK o_pain"; P=$((P+1)); else echo "FAIL o_pain ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_16.json "$H/api/oncology_palliative/hospice")
if [ "$C" = "200" ]; then echo "OK o_hos"; P=$((P+1)); else echo "FAIL o_hos ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_17.json "$H/api/oncology_palliative/symptoms")
if [ "$C" = "200" ]; then echo "OK o_sym"; P=$((P+1)); else echo "FAIL o_sym ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_18.json "$H/api/oncology_palliative/goals_care")
if [ "$C" = "200" ]; then echo "OK o_gl"; P=$((P+1)); else echo "FAIL o_gl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_19.json "$H/api/oncology_palliative/bereavement")
if [ "$C" = "200" ]; then echo "OK o_brv"; P=$((P+1)); else echo "FAIL o_brv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_20.json "$H/api/oncology_survivor/surveillance")
if [ "$C" = "200" ]; then echo "OK o_sur"; P=$((P+1)); else echo "FAIL o_sur ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_21.json "$H/api/oncology_survivor/late_effects")
if [ "$C" = "200" ]; then echo "OK o_le"; P=$((P+1)); else echo "FAIL o_le ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_22.json "$H/api/oncology_survivor/survivorship_care")
if [ "$C" = "200" ]; then echo "OK o_sc"; P=$((P+1)); else echo "FAIL o_sc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_23.json "$H/api/oncology_survivor/cardio_oncology")
if [ "$C" = "200" ]; then echo "OK o_co"; P=$((P+1)); else echo "FAIL o_co ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_24.json "$H/api/oncology_survivor/fertility")
if [ "$C" = "200" ]; then echo "OK o_ft"; P=$((P+1)); else echo "FAIL o_ft ($C)"; fi
echo PASS=$P FAIL=$F
