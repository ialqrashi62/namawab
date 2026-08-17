#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rheum_body_0.json "$H/api/rheum_ra/ra_classification")
if [ "$C" = "200" ]; then echo "OK r_rc"; P=$((P+1)); else echo "FAIL r_rc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rheum_body_1.json "$H/api/rheum_ra/ra_disease_activity")
if [ "$C" = "200" ]; then echo "OK r_da"; P=$((P+1)); else echo "FAIL r_da ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rheum_body_2.json "$H/api/rheum_ra/ra_dmards")
if [ "$C" = "200" ]; then echo "OK r_dm"; P=$((P+1)); else echo "FAIL r_dm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rheum_body_3.json "$H/api/rheum_ra/ra_biologic")
if [ "$C" = "200" ]; then echo "OK r_bio"; P=$((P+1)); else echo "FAIL r_bio ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rheum_body_4.json "$H/api/rheum_ra/ra_joint_protection")
if [ "$C" = "200" ]; then echo "OK r_jp"; P=$((P+1)); else echo "FAIL r_jp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rheum_body_5.json "$H/api/rheum_lupus/sle_classification")
if [ "$C" = "200" ]; then echo "OK r_sc"; P=$((P+1)); else echo "FAIL r_sc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rheum_body_6.json "$H/api/rheum_lupus/sle_disease_activity")
if [ "$C" = "200" ]; then echo "OK r_sd"; P=$((P+1)); else echo "FAIL r_sd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rheum_body_7.json "$H/api/rheum_lupus/sle_renal")
if [ "$C" = "200" ]; then echo "OK r_lr"; P=$((P+1)); else echo "FAIL r_lr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rheum_body_8.json "$H/api/rheum_lupus/sle_neuropsychiatric")
if [ "$C" = "200" ]; then echo "OK r_ln"; P=$((P+1)); else echo "FAIL r_ln ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rheum_body_9.json "$H/api/rheum_lupus/sle_pregnancy")
if [ "$C" = "200" ]; then echo "OK r_lp"; P=$((P+1)); else echo "FAIL r_lp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rheum_body_10.json "$H/api/rheum_vasculitis/anca_vasculitis")
if [ "$C" = "200" ]; then echo "OK r_av"; P=$((P+1)); else echo "FAIL r_av ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rheum_body_11.json "$H/api/rheum_vasculitis/giant_cell_arteritis")
if [ "$C" = "200" ]; then echo "OK r_gca"; P=$((P+1)); else echo "FAIL r_gca ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rheum_body_12.json "$H/api/rheum_vasculitis/takayasu")
if [ "$C" = "200" ]; then echo "OK r_tak"; P=$((P+1)); else echo "FAIL r_tak ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rheum_body_13.json "$H/api/rheum_vasculitis/behcet")
if [ "$C" = "200" ]; then echo "OK r_bec"; P=$((P+1)); else echo "FAIL r_bec ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rheum_body_14.json "$H/api/rheum_vasculitis/iga_vasculitis")
if [ "$C" = "200" ]; then echo "OK r_iga"; P=$((P+1)); else echo "FAIL r_iga ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rheum_body_15.json "$H/api/rheum_myo/dermatomyositis")
if [ "$C" = "200" ]; then echo "OK r_dm1"; P=$((P+1)); else echo "FAIL r_dm1 ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rheum_body_16.json "$H/api/rheum_myo/antisynthetase")
if [ "$C" = "200" ]; then echo "OK r_asy"; P=$((P+1)); else echo "FAIL r_asy ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rheum_body_17.json "$H/api/rheum_myo/inclusion_body_myopathy")
if [ "$C" = "200" ]; then echo "OK r_ibm"; P=$((P+1)); else echo "FAIL r_ibm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rheum_body_18.json "$H/api/rheum_myo/polymyalgia_rheumatica")
if [ "$C" = "200" ]; then echo "OK r_pmr"; P=$((P+1)); else echo "FAIL r_pmr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rheum_body_19.json "$H/api/rheum_myo/myositis_ild")
if [ "$C" = "200" ]; then echo "OK r_myi"; P=$((P+1)); else echo "FAIL r_myi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rheum_body_20.json "$H/api/rheum_spine/ankylosing_spondylitis")
if [ "$C" = "200" ]; then echo "OK r_as"; P=$((P+1)); else echo "FAIL r_as ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rheum_body_21.json "$H/api/rheum_spine/axial_spondyloarthritis")
if [ "$C" = "200" ]; then echo "OK r_axspa"; P=$((P+1)); else echo "FAIL r_axspa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rheum_body_22.json "$H/api/rheum_spine/psoriatic_arthritis")
if [ "$C" = "200" ]; then echo "OK r_psa"; P=$((P+1)); else echo "FAIL r_psa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rheum_body_23.json "$H/api/rheum_spine/reactive_arthritis")
if [ "$C" = "200" ]; then echo "OK r_reac"; P=$((P+1)); else echo "FAIL r_reac ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rheum_body_24.json "$H/api/rheum_spine/enteropathic_arthritis")
if [ "$C" = "200" ]; then echo "OK r_ent"; P=$((P+1)); else echo "FAIL r_ent ($C)"; fi
echo PASS=$P FAIL=$F
