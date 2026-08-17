#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_0.json "$H/api/pharm_order/pharm_prescribe")
if [ "$C" = "200" ]; then echo "OK rx_prescribe"; P=$((P+1)); else echo "FAIL rx_prescribe ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_1.json "$H/api/pharm_order/pharm_dispense")
if [ "$C" = "200" ]; then echo "OK rx_dispense"; P=$((P+1)); else echo "FAIL rx_dispense ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_2.json "$H/api/pharm_order/pharm_administer")
if [ "$C" = "200" ]; then echo "OK rx_admin"; P=$((P+1)); else echo "FAIL rx_admin ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_3.json "$H/api/pharm_order/pharm_refill")
if [ "$C" = "200" ]; then echo "OK rx_refill"; P=$((P+1)); else echo "FAIL rx_refill ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_4.json "$H/api/pharm_order/pharm_discontinue")
if [ "$C" = "200" ]; then echo "OK rx_disc"; P=$((P+1)); else echo "FAIL rx_disc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_5.json "$H/api/pharm_compounding/compound_recipe_validate")
if [ "$C" = "200" ]; then echo "OK cpt_recipe"; P=$((P+1)); else echo "FAIL cpt_recipe ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_6.json "$H/api/pharm_compounding/compound_iso_environment")
if [ "$C" = "200" ]; then echo "OK cpt_iso"; P=$((P+1)); else echo "FAIL cpt_iso ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_7.json "$H/api/pharm_compounding/compound_hazardous")
if [ "$C" = "200" ]; then echo "OK cpt_haz"; P=$((P+1)); else echo "FAIL cpt_haz ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_8.json "$H/api/pharm_compounding/compound_batching")
if [ "$C" = "200" ]; then echo "OK cpt_batch"; P=$((P+1)); else echo "FAIL cpt_batch ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_9.json "$H/api/pharm_compounding/compound_release")
if [ "$C" = "200" ]; then echo "OK cpt_rel"; P=$((P+1)); else echo "FAIL cpt_rel ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_10.json "$H/api/pharm_interaction/drug_interaction_check")
if [ "$C" = "200" ]; then echo "OK rx_inter"; P=$((P+1)); else echo "FAIL rx_inter ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_11.json "$H/api/pharm_interaction/drug_allergy_check")
if [ "$C" = "200" ]; then echo "OK rx_allergy"; P=$((P+1)); else echo "FAIL rx_allergy ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_12.json "$H/api/pharm_interaction/dose_range_check")
if [ "$C" = "200" ]; then echo "OK rx_dose"; P=$((P+1)); else echo "FAIL rx_dose ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_13.json "$H/api/pharm_interaction/renal_dose_adjust")
if [ "$C" = "200" ]; then echo "OK rx_renal"; P=$((P+1)); else echo "FAIL rx_renal ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_14.json "$H/api/pharm_interaction/pgx_alert")
if [ "$C" = "200" ]; then echo "OK rx_pgx"; P=$((P+1)); else echo "FAIL rx_pgx ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_15.json "$H/api/pharm_formulary/formulary_lookup")
if [ "$C" = "200" ]; then echo "OK fm_lookup"; P=$((P+1)); else echo "FAIL fm_lookup ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_16.json "$H/api/pharm_formulary/formulary_interchange")
if [ "$C" = "200" ]; then echo "OK fm_inter"; P=$((P+1)); else echo "FAIL fm_inter ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_17.json "$H/api/pharm_formulary/prior_auth_check")
if [ "$C" = "200" ]; then echo "OK fm_pa"; P=$((P+1)); else echo "FAIL fm_pa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_18.json "$H/api/pharm_formulary/formulary_therapeutic_class")
if [ "$C" = "200" ]; then echo "OK fm_class"; P=$((P+1)); else echo "FAIL fm_class ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_19.json "$H/api/pharm_formulary/formulary_drug_shortage")
if [ "$C" = "200" ]; then echo "OK fm_short"; P=$((P+1)); else echo "FAIL fm_short ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_20.json "$H/api/pharm_inventory/stock_receive")
if [ "$C" = "200" ]; then echo "OK inv_recv"; P=$((P+1)); else echo "FAIL inv_recv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_21.json "$H/api/pharm_inventory/par_level_check")
if [ "$C" = "200" ]; then echo "OK inv_par"; P=$((P+1)); else echo "FAIL inv_par ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_22.json "$H/api/pharm_inventory/expiration_check")
if [ "$C" = "200" ]; then echo "OK inv_exp"; P=$((P+1)); else echo "FAIL inv_exp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_23.json "$H/api/pharm_inventory/recall_check")
if [ "$C" = "200" ]; then echo "OK inv_rec"; P=$((P+1)); else echo "FAIL inv_rec ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_24.json "$H/api/pharm_inventory/narcotic_inventory")
if [ "$C" = "200" ]; then echo "OK inv_narc"; P=$((P+1)); else echo "FAIL inv_narc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_25.json "$H/api/pharm_stewardship/abx_review")
if [ "$C" = "200" ]; then echo "OK st_review"; P=$((P+1)); else echo "FAIL st_review ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_26.json "$H/api/pharm_stewardship/abx_iv_to_oral")
if [ "$C" = "200" ]; then echo "OK st_iv"; P=$((P+1)); else echo "FAIL st_iv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_27.json "$H/api/pharm_stewardship/opioid_stewardship")
if [ "$C" = "200" ]; then echo "OK st_op"; P=$((P+1)); else echo "FAIL st_op ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_28.json "$H/api/pharm_stewardship/stewardship_metric")
if [ "$C" = "200" ]; then echo "OK st_metric"; P=$((P+1)); else echo "FAIL st_metric ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pharm_body_29.json "$H/api/pharm_stewardship/stewardship_dashboard")
if [ "$C" = "200" ]; then echo "OK st_dash"; P=$((P+1)); else echo "FAIL st_dash ($C)"; fi
echo PASS=$P FAIL=$F
