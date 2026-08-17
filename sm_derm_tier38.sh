#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/derm_body_0.json "$H/api/derm_psor/psoriasis_severity")
if [ "$C" = "200" ]; then echo "OK d_pss"; P=$((P+1)); else echo "FAIL d_pss ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/derm_body_1.json "$H/api/derm_psor/topical_psoriasis")
if [ "$C" = "200" ]; then echo "OK d_pt"; P=$((P+1)); else echo "FAIL d_pt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/derm_body_2.json "$H/api/derm_psor/systemic_psoriasis")
if [ "$C" = "200" ]; then echo "OK d_ps"; P=$((P+1)); else echo "FAIL d_ps ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/derm_body_3.json "$H/api/derm_psor/biologic_psoriasis")
if [ "$C" = "200" ]; then echo "OK d_pb"; P=$((P+1)); else echo "FAIL d_pb ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/derm_body_4.json "$H/api/derm_psor/psoriasis_arthritis_screen")
if [ "$C" = "200" ]; then echo "OK d_par"; P=$((P+1)); else echo "FAIL d_par ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/derm_body_5.json "$H/api/derm_ecz/atopic_dermatitis")
if [ "$C" = "200" ]; then echo "OK d_ad"; P=$((P+1)); else echo "FAIL d_ad ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/derm_body_6.json "$H/api/derm_ecz/eczema_severity")
if [ "$C" = "200" ]; then echo "OK d_es"; P=$((P+1)); else echo "FAIL d_es ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/derm_body_7.json "$H/api/derm_ecz/eczema_topical")
if [ "$C" = "200" ]; then echo "OK d_et"; P=$((P+1)); else echo "FAIL d_et ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/derm_body_8.json "$H/api/derm_ecz/eczema_systemic")
if [ "$C" = "200" ]; then echo "OK d_eu"; P=$((P+1)); else echo "FAIL d_eu ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/derm_body_9.json "$H/api/derm_ecz/wound_care_eczema")
if [ "$C" = "200" ]; then echo "OK d_ew"; P=$((P+1)); else echo "FAIL d_ew ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/derm_body_10.json "$H/api/derm_skin/melanoma_staging")
if [ "$C" = "200" ]; then echo "OK d_ms"; P=$((P+1)); else echo "FAIL d_ms ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/derm_body_11.json "$H/api/derm_skin/basal_cell")
if [ "$C" = "200" ]; then echo "OK d_bcc"; P=$((P+1)); else echo "FAIL d_bcc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/derm_body_12.json "$H/api/derm_skin/squamous_cell")
if [ "$C" = "200" ]; then echo "OK d_scc"; P=$((P+1)); else echo "FAIL d_scc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/derm_body_13.json "$H/api/derm_skin/actinic_keratosis")
if [ "$C" = "200" ]; then echo "OK d_ak"; P=$((P+1)); else echo "FAIL d_ak ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/derm_body_14.json "$H/api/derm_skin/mohs_surgery")
if [ "$C" = "200" ]; then echo "OK d_mohs"; P=$((P+1)); else echo "FAIL d_mohs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/derm_body_15.json "$H/api/derm_acne/acne_severity")
if [ "$C" = "200" ]; then echo "OK d_acs"; P=$((P+1)); else echo "FAIL d_acs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/derm_body_16.json "$H/api/derm_acne/acne_topical")
if [ "$C" = "200" ]; then echo "OK d_at"; P=$((P+1)); else echo "FAIL d_at ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/derm_body_17.json "$H/api/derm_acne/acne_systemic")
if [ "$C" = "200" ]; then echo "OK d_as"; P=$((P+1)); else echo "FAIL d_as ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/derm_body_18.json "$H/api/derm_acne/isotretinoin")
if [ "$C" = "200" ]; then echo "OK d_aiso"; P=$((P+1)); else echo "FAIL d_aiso ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/derm_body_19.json "$H/api/derm_acne/acne_scar")
if [ "$C" = "200" ]; then echo "OK d_asc"; P=$((P+1)); else echo "FAIL d_asc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/derm_body_20.json "$H/api/derm_hair/alopecia")
if [ "$C" = "200" ]; then echo "OK d_al"; P=$((P+1)); else echo "FAIL d_al ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/derm_body_21.json "$H/api/derm_hair/hair_loss_workup")
if [ "$C" = "200" ]; then echo "OK d_hl"; P=$((P+1)); else echo "FAIL d_hl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/derm_body_22.json "$H/api/derm_hair/onychomycosis")
if [ "$C" = "200" ]; then echo "OK d_on"; P=$((P+1)); else echo "FAIL d_on ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/derm_body_23.json "$H/api/derm_hair/paronychia")
if [ "$C" = "200" ]; then echo "OK d_pa"; P=$((P+1)); else echo "FAIL d_pa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/derm_body_24.json "$H/api/derm_hair/autoimmune_skin")
if [ "$C" = "200" ]; then echo "OK d_ais"; P=$((P+1)); else echo "FAIL d_ais ($C)"; fi
echo PASS=$P FAIL=$F
