#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_0.json "$H/api/onc_breast/early_breast_cancer")
if [ "$C" = "200" ]; then echo "OK o_ebr"; P=$((P+1)); else echo "FAIL o_ebr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_1.json "$H/api/onc_breast/advanced_breast_cancer")
if [ "$C" = "200" ]; then echo "OK o_adv"; P=$((P+1)); else echo "FAIL o_adv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_2.json "$H/api/onc_breast/dcis")
if [ "$C" = "200" ]; then echo "OK o_dci"; P=$((P+1)); else echo "FAIL o_dci ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_3.json "$H/api/onc_breast/her2_pos_breast")
if [ "$C" = "200" ]; then echo "OK o_h2p"; P=$((P+1)); else echo "FAIL o_h2p ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_4.json "$H/api/onc_breast/triple_neg_breast")
if [ "$C" = "200" ]; then echo "OK o_tnb"; P=$((P+1)); else echo "FAIL o_tnb ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_5.json "$H/api/onc_lung/nsclc_early")
if [ "$C" = "200" ]; then echo "OK o_nel"; P=$((P+1)); else echo "FAIL o_nel ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_6.json "$H/api/onc_lung/nsclc_advanced")
if [ "$C" = "200" ]; then echo "OK o_nla"; P=$((P+1)); else echo "FAIL o_nla ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_7.json "$H/api/onc_lung/sclc_limited")
if [ "$C" = "200" ]; then echo "OK o_scl"; P=$((P+1)); else echo "FAIL o_scl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_8.json "$H/api/onc_lung/sclc_extensive")
if [ "$C" = "200" ]; then echo "OK o_sce"; P=$((P+1)); else echo "FAIL o_sce ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_9.json "$H/api/onc_lung/mesothelioma")
if [ "$C" = "200" ]; then echo "OK o_mes"; P=$((P+1)); else echo "FAIL o_mes ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_10.json "$H/api/onc_gi/colon_cancer")
if [ "$C" = "200" ]; then echo "OK o_col"; P=$((P+1)); else echo "FAIL o_col ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_11.json "$H/api/onc_gi/rectal_cancer")
if [ "$C" = "200" ]; then echo "OK o_rec"; P=$((P+1)); else echo "FAIL o_rec ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_12.json "$H/api/onc_gi/pancreatic_cancer")
if [ "$C" = "200" ]; then echo "OK o_pan"; P=$((P+1)); else echo "FAIL o_pan ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_13.json "$H/api/onc_gi/gastric_cancer")
if [ "$C" = "200" ]; then echo "OK o_gas"; P=$((P+1)); else echo "FAIL o_gas ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_14.json "$H/api/onc_gi/esophageal_cancer")
if [ "$C" = "200" ]; then echo "OK o_eso"; P=$((P+1)); else echo "FAIL o_eso ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_15.json "$H/api/onc_gu/renal_cancer")
if [ "$C" = "200" ]; then echo "OK o_ren"; P=$((P+1)); else echo "FAIL o_ren ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_16.json "$H/api/onc_gu/bladder_cancer")
if [ "$C" = "200" ]; then echo "OK o_bla"; P=$((P+1)); else echo "FAIL o_bla ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_17.json "$H/api/onc_gu/prostate_cancer")
if [ "$C" = "200" ]; then echo "OK o_pro"; P=$((P+1)); else echo "FAIL o_pro ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_18.json "$H/api/onc_gu/testicular_cancer")
if [ "$C" = "200" ]; then echo "OK o_tes"; P=$((P+1)); else echo "FAIL o_tes ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_19.json "$H/api/onc_gu/ovarian_cancer")
if [ "$C" = "200" ]; then echo "OK o_ova"; P=$((P+1)); else echo "FAIL o_ova ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_20.json "$H/api/onc_heme/aml")
if [ "$C" = "200" ]; then echo "OK o_aml"; P=$((P+1)); else echo "FAIL o_aml ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_21.json "$H/api/onc_heme/all")
if [ "$C" = "200" ]; then echo "OK o_all"; P=$((P+1)); else echo "FAIL o_all ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_22.json "$H/api/onc_heme/cml")
if [ "$C" = "200" ]; then echo "OK o_cml"; P=$((P+1)); else echo "FAIL o_cml ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_23.json "$H/api/onc_heme/cll")
if [ "$C" = "200" ]; then echo "OK o_cll"; P=$((P+1)); else echo "FAIL o_cll ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/onc_body_24.json "$H/api/onc_heme/nhl_lymphoma")
if [ "$C" = "200" ]; then echo "OK o_nhl"; P=$((P+1)); else echo "FAIL o_nhl ($C)"; fi
echo PASS=$P FAIL=$F
