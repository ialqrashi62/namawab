#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/gi_body_0.json "$H/api/gi_ibd/ibd_classification")
if [ "$C" = "200" ]; then echo "OK g_ic"; P=$((P+1)); else echo "FAIL g_ic ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/gi_body_1.json "$H/api/gi_ibd/ibd_disease_activity")
if [ "$C" = "200" ]; then echo "OK g_da"; P=$((P+1)); else echo "FAIL g_da ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/gi_body_2.json "$H/api/gi_ibd/ibd_medication")
if [ "$C" = "200" ]; then echo "OK g_im"; P=$((P+1)); else echo "FAIL g_im ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/gi_body_3.json "$H/api/gi_ibd/ibd_surveillance")
if [ "$C" = "200" ]; then echo "OK g_sur"; P=$((P+1)); else echo "FAIL g_sur ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/gi_body_4.json "$H/api/gi_ibd/ibd_surgery")
if [ "$C" = "200" ]; then echo "OK g_sx"; P=$((P+1)); else echo "FAIL g_sx ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/gi_body_5.json "$H/api/gi_hepa/liver_function")
if [ "$C" = "200" ]; then echo "OK g_lf"; P=$((P+1)); else echo "FAIL g_lf ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/gi_body_6.json "$H/api/gi_hepa/hepatitis_b")
if [ "$C" = "200" ]; then echo "OK g_hb"; P=$((P+1)); else echo "FAIL g_hb ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/gi_body_7.json "$H/api/gi_hepa/hepatitis_c")
if [ "$C" = "200" ]; then echo "OK g_hc"; P=$((P+1)); else echo "FAIL g_hc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/gi_body_8.json "$H/api/gi_hepa/nafld_mash")
if [ "$C" = "200" ]; then echo "OK g_nafld"; P=$((P+1)); else echo "FAIL g_nafld ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/gi_body_9.json "$H/api/gi_hepa/liver_transplant")
if [ "$C" = "200" ]; then echo "OK g_ltx"; P=$((P+1)); else echo "FAIL g_ltx ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/gi_body_10.json "$H/api/gi_end/egd_findings")
if [ "$C" = "200" ]; then echo "OK g_egd"; P=$((P+1)); else echo "FAIL g_egd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/gi_body_11.json "$H/api/gi_end/colonoscopy_quality")
if [ "$C" = "200" ]; then echo "OK g_col"; P=$((P+1)); else echo "FAIL g_col ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/gi_body_12.json "$H/api/gi_end/ercp")
if [ "$C" = "200" ]; then echo "OK g_ercp"; P=$((P+1)); else echo "FAIL g_ercp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/gi_body_13.json "$H/api/gi_end/eus_evaluation")
if [ "$C" = "200" ]; then echo "OK g_eus"; P=$((P+1)); else echo "FAIL g_eus ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/gi_body_14.json "$H/api/gi_end/endoscopic_bleeding")
if [ "$C" = "200" ]; then echo "OK g_ebl"; P=$((P+1)); else echo "FAIL g_ebl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/gi_body_15.json "$H/api/gi_onco/colon_cancer_staging")
if [ "$C" = "200" ]; then echo "OK g_cc"; P=$((P+1)); else echo "FAIL g_cc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/gi_body_16.json "$H/api/gi_onco/gi_lymphoma")
if [ "$C" = "200" ]; then echo "OK g_ln"; P=$((P+1)); else echo "FAIL g_ln ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/gi_body_17.json "$H/api/gi_onco/gist")
if [ "$C" = "200" ]; then echo "OK g_gist"; P=$((P+1)); else echo "FAIL g_gist ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/gi_body_18.json "$H/api/gi_onco/pancreatic_cancer")
if [ "$C" = "200" ]; then echo "OK g_pc"; P=$((P+1)); else echo "FAIL g_pc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/gi_body_19.json "$H/api/gi_onco/neuroendocrine_tumor")
if [ "$C" = "200" ]; then echo "OK g_net"; P=$((P+1)); else echo "FAIL g_net ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/gi_body_20.json "$H/api/gi_nut/malnutrition_screen")
if [ "$C" = "200" ]; then echo "OK g_ms"; P=$((P+1)); else echo "FAIL g_ms ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/gi_body_21.json "$H/api/gi_nut/enteral_nutrition")
if [ "$C" = "200" ]; then echo "OK g_ent"; P=$((P+1)); else echo "FAIL g_ent ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/gi_body_22.json "$H/api/gi_nut/parenteral_nutrition")
if [ "$C" = "200" ]; then echo "OK g_pn"; P=$((P+1)); else echo "FAIL g_pn ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/gi_body_23.json "$H/api/gi_nut/gi_diet_therapy")
if [ "$C" = "200" ]; then echo "OK g_diet"; P=$((P+1)); else echo "FAIL g_diet ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/gi_body_24.json "$H/api/gi_nut/fecal_microbiota")
if [ "$C" = "200" ]; then echo "OK g_fmt"; P=$((P+1)); else echo "FAIL g_fmt ($C)"; fi
echo PASS=$P FAIL=$F
