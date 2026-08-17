#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/der_body_0.json "$H/api/derm_infla/atopic_dermatitis")
if [ "$C" = "200" ]; then echo "OK d_atp"; P=$((P+1)); else echo "FAIL d_atp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/der_body_1.json "$H/api/derm_infla/psoriasis_severe")
if [ "$C" = "200" ]; then echo "OK d_psv"; P=$((P+1)); else echo "FAIL d_psv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/der_body_2.json "$H/api/derm_infla/lichen_planus")
if [ "$C" = "200" ]; then echo "OK d_lp"; P=$((P+1)); else echo "FAIL d_lp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/der_body_3.json "$H/api/derm_infla/vitiligo")
if [ "$C" = "200" ]; then echo "OK d_vtl"; P=$((P+1)); else echo "FAIL d_vtl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/der_body_4.json "$H/api/derm_infla/hidradenitis_suppurativa")
if [ "$C" = "200" ]; then echo "OK d_hs"; P=$((P+1)); else echo "FAIL d_hs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/der_body_5.json "$H/api/derm_inf/bacterial_cellulitis")
if [ "$C" = "200" ]; then echo "OK d_cel"; P=$((P+1)); else echo "FAIL d_cel ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/der_body_6.json "$H/api/derm_inf/fungal_skin")
if [ "$C" = "200" ]; then echo "OK d_fun"; P=$((P+1)); else echo "FAIL d_fun ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/der_body_7.json "$H/api/derm_inf/parasitic_skin")
if [ "$C" = "200" ]; then echo "OK d_par"; P=$((P+1)); else echo "FAIL d_par ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/der_body_8.json "$H/api/derm_inf/viral_herpes")
if [ "$C" = "200" ]; then echo "OK d_hsv"; P=$((P+1)); else echo "FAIL d_hsv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/der_body_9.json "$H/api/derm_inf/warts_molluscum")
if [ "$C" = "200" ]; then echo "OK d_war"; P=$((P+1)); else echo "FAIL d_war ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/der_body_10.json "$H/api/derm_neo/melanoma_skin")
if [ "$C" = "200" ]; then echo "OK d_mel"; P=$((P+1)); else echo "FAIL d_mel ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/der_body_11.json "$H/api/derm_neo/bcc_skin")
if [ "$C" = "200" ]; then echo "OK d_bcc"; P=$((P+1)); else echo "FAIL d_bcc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/der_body_12.json "$H/api/derm_neo/scc_skin")
if [ "$C" = "200" ]; then echo "OK d_scc"; P=$((P+1)); else echo "FAIL d_scc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/der_body_13.json "$H/api/derm_neo/lymphoma_cutaneous")
if [ "$C" = "200" ]; then echo "OK d_lym"; P=$((P+1)); else echo "FAIL d_lym ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/der_body_14.json "$H/api/derm_neo/kaposi")
if [ "$C" = "200" ]; then echo "OK d_kap"; P=$((P+1)); else echo "FAIL d_kap ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/der_body_15.json "$H/api/derm_pig/melasma")
if [ "$C" = "200" ]; then echo "OK d_mel"; P=$((P+1)); else echo "FAIL d_mel ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/der_body_16.json "$H/api/derm_pig/post_inflammatory_hyperpig")
if [ "$C" = "200" ]; then echo "OK d_pih"; P=$((P+1)); else echo "FAIL d_pih ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/der_body_17.json "$H/api/derm_pig/alopecia_areata")
if [ "$C" = "200" ]; then echo "OK d_al"; P=$((P+1)); else echo "FAIL d_al ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/der_body_18.json "$H/api/derm_pig/hyperpig_workup")
if [ "$C" = "200" ]; then echo "OK d_hyp"; P=$((P+1)); else echo "FAIL d_hyp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/der_body_19.json "$H/api/derm_pig/hypopig_workup")
if [ "$C" = "200" ]; then echo "OK d_hyp"; P=$((P+1)); else echo "FAIL d_hyp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/der_body_20.json "$H/api/derm_proced/excisional_biopsy")
if [ "$C" = "200" ]; then echo "OK d_exc"; P=$((P+1)); else echo "FAIL d_exc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/der_body_21.json "$H/api/derm_proced/shave_biopsy")
if [ "$C" = "200" ]; then echo "OK d_sha"; P=$((P+1)); else echo "FAIL d_sha ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/der_body_22.json "$H/api/derm_proced/punch_biopsy")
if [ "$C" = "200" ]; then echo "OK d_pun"; P=$((P+1)); else echo "FAIL d_pun ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/der_body_23.json "$H/api/derm_proced/cryotherapy")
if [ "$C" = "200" ]; then echo "OK d_cry"; P=$((P+1)); else echo "FAIL d_cry ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/der_body_24.json "$H/api/derm_proced/phototherapy")
if [ "$C" = "200" ]; then echo "OK d_pht"; P=$((P+1)); else echo "FAIL d_pht ($C)"; fi
echo PASS=$P FAIL=$F
