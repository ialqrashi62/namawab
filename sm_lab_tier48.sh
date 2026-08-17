#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_0.json "$H/api/lab_heme/complete_blood_count")
if [ "$C" = "200" ]; then echo "OK l_cbc"; P=$((P+1)); else echo "FAIL l_cbc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_1.json "$H/api/lab_heme/coagulation_panel")
if [ "$C" = "200" ]; then echo "OK l_coa"; P=$((P+1)); else echo "FAIL l_coa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_2.json "$H/api/lab_heme/d_dimer")
if [ "$C" = "200" ]; then echo "OK l_ddi"; P=$((P+1)); else echo "FAIL l_ddi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_3.json "$H/api/lab_heme/fibrinogen")
if [ "$C" = "200" ]; then echo "OK l_fib"; P=$((P+1)); else echo "FAIL l_fib ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_4.json "$H/api/lab_heme/blood_smear")
if [ "$C" = "200" ]; then echo "OK l_bsm"; P=$((P+1)); else echo "FAIL l_bsm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_5.json "$H/api/lab_chem/basic_metabolic")
if [ "$C" = "200" ]; then echo "OK l_bmp"; P=$((P+1)); else echo "FAIL l_bmp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_6.json "$H/api/lab_chem/comprehensive_metabolic")
if [ "$C" = "200" ]; then echo "OK l_cmp"; P=$((P+1)); else echo "FAIL l_cmp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_7.json "$H/api/lab_chem/liver_function")
if [ "$C" = "200" ]; then echo "OK l_lft"; P=$((P+1)); else echo "FAIL l_lft ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_8.json "$H/api/lab_chem/lipid_panel")
if [ "$C" = "200" ]; then echo "OK l_lip"; P=$((P+1)); else echo "FAIL l_lip ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_9.json "$H/api/lab_chem/thyroid_function")
if [ "$C" = "200" ]; then echo "OK l_thy"; P=$((P+1)); else echo "FAIL l_thy ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_10.json "$H/api/lab_micro/blood_culture")
if [ "$C" = "200" ]; then echo "OK l_bcx"; P=$((P+1)); else echo "FAIL l_bcx ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_11.json "$H/api/lab_micro/urine_culture")
if [ "$C" = "200" ]; then echo "OK l_ucx"; P=$((P+1)); else echo "FAIL l_ucx ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_12.json "$H/api/lab_micro/sputum_culture")
if [ "$C" = "200" ]; then echo "OK l_scx"; P=$((P+1)); else echo "FAIL l_scx ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_13.json "$H/api/lab_micro/stool_culture")
if [ "$C" = "200" ]; then echo "OK l_stx"; P=$((P+1)); else echo "FAIL l_stx ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_14.json "$H/api/lab_micro/wound_culture")
if [ "$C" = "200" ]; then echo "OK l_wcx"; P=$((P+1)); else echo "FAIL l_wcx ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_15.json "$H/api/lab_immuno/autoimmune_panel")
if [ "$C" = "200" ]; then echo "OK l_ai"; P=$((P+1)); else echo "FAIL l_ai ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_16.json "$H/api/lab_immuno/immunoglobulins")
if [ "$C" = "200" ]; then echo "OK l_ig"; P=$((P+1)); else echo "FAIL l_ig ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_17.json "$H/api/lab_immuno/complement_levels")
if [ "$C" = "200" ]; then echo "OK l_cmp"; P=$((P+1)); else echo "FAIL l_cmp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_18.json "$H/api/lab_immuno/cytokines")
if [ "$C" = "200" ]; then echo "OK l_cyt"; P=$((P+1)); else echo "FAIL l_cyt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_19.json "$H/api/lab_immuno/allergy_panel")
if [ "$C" = "200" ]; then echo "OK l_al"; P=$((P+1)); else echo "FAIL l_al ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_20.json "$H/api/lab_mol/pcr_panel")
if [ "$C" = "200" ]; then echo "OK l_pcr"; P=$((P+1)); else echo "FAIL l_pcr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_21.json "$H/api/lab_mol/next_gen_sequencing")
if [ "$C" = "200" ]; then echo "OK l_ngs"; P=$((P+1)); else echo "FAIL l_ngs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_22.json "$H/api/lab_mol/fish_analysis")
if [ "$C" = "200" ]; then echo "OK l_fsh"; P=$((P+1)); else echo "FAIL l_fsh ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_23.json "$H/api/lab_mol/karyotyping")
if [ "$C" = "200" ]; then echo "OK l_kar"; P=$((P+1)); else echo "FAIL l_kar ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_24.json "$H/api/lab_mol/methylation_assay")
if [ "$C" = "200" ]; then echo "OK l_met"; P=$((P+1)); else echo "FAIL l_met ($C)"; fi
echo PASS=$P FAIL=$F
