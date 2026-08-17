#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/phr_body_0.json "$H/api/pharm_onco/chemo_regimen")
if [ "$C" = "200" ]; then echo "OK p_che"; P=$((P+1)); else echo "FAIL p_che ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/phr_body_1.json "$H/api/pharm_onco/targeted_therapy")
if [ "$C" = "200" ]; then echo "OK p_tar"; P=$((P+1)); else echo "FAIL p_tar ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/phr_body_2.json "$H/api/pharm_onco/immunotherapy")
if [ "$C" = "200" ]; then echo "OK p_imm"; P=$((P+1)); else echo "FAIL p_imm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/phr_body_3.json "$H/api/pharm_onco/supportive_care")
if [ "$C" = "200" ]; then echo "OK p_sup"; P=$((P+1)); else echo "FAIL p_sup ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/phr_body_4.json "$H/api/pharm_onco/chemo_toxicity")
if [ "$C" = "200" ]; then echo "OK p_tox"; P=$((P+1)); else echo "FAIL p_tox ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/phr_body_5.json "$H/api/pharm_antinf/antibiotic_stewardship")
if [ "$C" = "200" ]; then echo "OK p_stw"; P=$((P+1)); else echo "FAIL p_stw ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/phr_body_6.json "$H/api/pharm_antinf/antifungal_therapy")
if [ "$C" = "200" ]; then echo "OK p_fun"; P=$((P+1)); else echo "FAIL p_fun ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/phr_body_7.json "$H/api/pharm_antinf/antiviral_therapy")
if [ "$C" = "200" ]; then echo "OK p_vir"; P=$((P+1)); else echo "FAIL p_vir ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/phr_body_8.json "$H/api/pharm_antinf/antiparasitic")
if [ "$C" = "200" ]; then echo "OK p_par"; P=$((P+1)); else echo "FAIL p_par ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/phr_body_9.json "$H/api/pharm_antinf/resistance_review")
if [ "$C" = "200" ]; then echo "OK p_res"; P=$((P+1)); else echo "FAIL p_res ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/phr_body_10.json "$H/api/pharm_chronic/antihypertensive")
if [ "$C" = "200" ]; then echo "OK p_htn"; P=$((P+1)); else echo "FAIL p_htn ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/phr_body_11.json "$H/api/pharm_chronic/antidiabetic")
if [ "$C" = "200" ]; then echo "OK p_dm"; P=$((P+1)); else echo "FAIL p_dm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/phr_body_12.json "$H/api/pharm_chronic/statin_therapy")
if [ "$C" = "200" ]; then echo "OK p_sta"; P=$((P+1)); else echo "FAIL p_sta ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/phr_body_13.json "$H/api/pharm_chronic/anticoagulation_oral")
if [ "$C" = "200" ]; then echo "OK p_aco"; P=$((P+1)); else echo "FAIL p_aco ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/phr_body_14.json "$H/api/pharm_chronic/asthma_controller")
if [ "$C" = "200" ]; then echo "OK p_ast"; P=$((P+1)); else echo "FAIL p_ast ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/phr_body_15.json "$H/api/pharm_pain/opioid_chronic_pain")
if [ "$C" = "200" ]; then echo "OK p_opi"; P=$((P+1)); else echo "FAIL p_opi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/phr_body_16.json "$H/api/pharm_pain/nsaid")
if [ "$C" = "200" ]; then echo "OK p_nsa"; P=$((P+1)); else echo "FAIL p_nsa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/phr_body_17.json "$H/api/pharm_pain/neuropathic_pain")
if [ "$C" = "200" ]; then echo "OK p_nrp"; P=$((P+1)); else echo "FAIL p_nrp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/phr_body_18.json "$H/api/pharm_pain/palliative_pain")
if [ "$C" = "200" ]; then echo "OK p_pal"; P=$((P+1)); else echo "FAIL p_pal ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/phr_body_19.json "$H/api/pharm_pain/multimodal_pain")
if [ "$C" = "200" ]; then echo "OK p_mul"; P=$((P+1)); else echo "FAIL p_mul ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/phr_body_20.json "$H/api/pharm_special/biologic_therapy")
if [ "$C" = "200" ]; then echo "OK p_bio"; P=$((P+1)); else echo "FAIL p_bio ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/phr_body_21.json "$H/api/pharm_special/controlled_substance")
if [ "$C" = "200" ]; then echo "OK p_ctr"; P=$((P+1)); else echo "FAIL p_ctr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/phr_body_22.json "$H/api/pharm_special/compounding")
if [ "$C" = "200" ]; then echo "OK p_cmp"; P=$((P+1)); else echo "FAIL p_cmp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/phr_body_23.json "$H/api/pharm_special/investigational_drug")
if [ "$C" = "200" ]; then echo "OK p_inv"; P=$((P+1)); else echo "FAIL p_inv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/phr_body_24.json "$H/api/pharm_special/drug_shortage")
if [ "$C" = "200" ]; then echo "OK p_sht"; P=$((P+1)); else echo "FAIL p_sht ($C)"; fi
echo PASS=$P FAIL=$F
