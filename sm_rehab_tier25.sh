#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rehab_body_0.json "$H/api/rehab_function/fim_score")
if [ "$C" = "200" ]; then echo "OK r_fim"; P=$((P+1)); else echo "FAIL r_fim ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rehab_body_1.json "$H/api/rehab_function/barthel")
if [ "$C" = "200" ]; then echo "OK r_brt"; P=$((P+1)); else echo "FAIL r_brt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rehab_body_2.json "$H/api/rehab_function/mobility_index")
if [ "$C" = "200" ]; then echo "OK r_mob"; P=$((P+1)); else echo "FAIL r_mob ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rehab_body_3.json "$H/api/rehab_function/grip_strength")
if [ "$C" = "200" ]; then echo "OK r_gri"; P=$((P+1)); else echo "FAIL r_gri ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rehab_body_4.json "$H/api/rehab_function/rom")
if [ "$C" = "200" ]; then echo "OK r_rom"; P=$((P+1)); else echo "FAIL r_rom ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rehab_body_5.json "$H/api/rehab_therapy/pt_plan")
if [ "$C" = "200" ]; then echo "OK r_pt"; P=$((P+1)); else echo "FAIL r_pt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rehab_body_6.json "$H/api/rehab_therapy/ot_plan")
if [ "$C" = "200" ]; then echo "OK r_ot"; P=$((P+1)); else echo "FAIL r_ot ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rehab_body_7.json "$H/api/rehab_therapy/slp_plan")
if [ "$C" = "200" ]; then echo "OK r_slp"; P=$((P+1)); else echo "FAIL r_slp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rehab_body_8.json "$H/api/rehab_therapy/discharge_plan")
if [ "$C" = "200" ]; then echo "OK r_dc"; P=$((P+1)); else echo "FAIL r_dc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rehab_body_9.json "$H/api/rehab_therapy/progress")
if [ "$C" = "200" ]; then echo "OK r_prg"; P=$((P+1)); else echo "FAIL r_prg ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rehab_body_10.json "$H/api/rehab_prosthetic/prosthetic_assess")
if [ "$C" = "200" ]; then echo "OK r_pra"; P=$((P+1)); else echo "FAIL r_pra ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rehab_body_11.json "$H/api/rehab_prosthetic/prosthetic_socket")
if [ "$C" = "200" ]; then echo "OK r_soc"; P=$((P+1)); else echo "FAIL r_soc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rehab_body_12.json "$H/api/rehab_prosthetic/orthotic_assess")
if [ "$C" = "200" ]; then echo "OK r_ort"; P=$((P+1)); else echo "FAIL r_ort ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rehab_body_13.json "$H/api/rehab_prosthetic/wheelchair_assess")
if [ "$C" = "200" ]; then echo "OK r_whl"; P=$((P+1)); else echo "FAIL r_whl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rehab_body_14.json "$H/api/rehab_prosthetic/gait_train")
if [ "$C" = "200" ]; then echo "OK r_gt"; P=$((P+1)); else echo "FAIL r_gt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rehab_body_15.json "$H/api/rehab_neuro/nih_stroke")
if [ "$C" = "200" ]; then echo "OK r_nih"; P=$((P+1)); else echo "FAIL r_nih ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rehab_body_16.json "$H/api/rehab_neuro/coma_recovery")
if [ "$C" = "200" ]; then echo "OK r_crs"; P=$((P+1)); else echo "FAIL r_crs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rehab_body_17.json "$H/api/rehab_neuro/sci_assess")
if [ "$C" = "200" ]; then echo "OK r_sci"; P=$((P+1)); else echo "FAIL r_sci ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rehab_body_18.json "$H/api/rehab_neuro/dysphagia")
if [ "$C" = "200" ]; then echo "OK r_dys"; P=$((P+1)); else echo "FAIL r_dys ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rehab_body_19.json "$H/api/rehab_neuro/balance_train")
if [ "$C" = "200" ]; then echo "OK r_bal"; P=$((P+1)); else echo "FAIL r_bal ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rehab_body_20.json "$H/api/rehab_pediatric/developmental")
if [ "$C" = "200" ]; then echo "OK r_dev"; P=$((P+1)); else echo "FAIL r_dev ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rehab_body_21.json "$H/api/rehab_pediatric/gmfc")
if [ "$C" = "200" ]; then echo "OK r_gmf"; P=$((P+1)); else echo "FAIL r_gmf ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rehab_body_22.json "$H/api/rehab_pediatric/feeding_pediatric")
if [ "$C" = "200" ]; then echo "OK r_feed"; P=$((P+1)); else echo "FAIL r_feed ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rehab_body_23.json "$H/api/rehab_pediatric/early_intervention")
if [ "$C" = "200" ]; then echo "OK r_ei"; P=$((P+1)); else echo "FAIL r_ei ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rehab_body_24.json "$H/api/rehab_pediatric/school_rehab")
if [ "$C" = "200" ]; then echo "OK r_sch"; P=$((P+1)); else echo "FAIL r_sch ($C)"; fi
echo PASS=$P FAIL=$F
