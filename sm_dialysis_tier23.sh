#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/dialysis_body_0.json "$H/api/dialysis_access/access_avf")
if [ "$C" = "200" ]; then echo "OK a_avf"; P=$((P+1)); else echo "FAIL a_avf ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/dialysis_body_1.json "$H/api/dialysis_access/access_avg")
if [ "$C" = "200" ]; then echo "OK a_avg"; P=$((P+1)); else echo "FAIL a_avg ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/dialysis_body_2.json "$H/api/dialysis_access/access_catheter")
if [ "$C" = "200" ]; then echo "OK a_cat"; P=$((P+1)); else echo "FAIL a_cat ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/dialysis_body_3.json "$H/api/dialysis_access/access_stenosis")
if [ "$C" = "200" ]; then echo "OK a_ste"; P=$((P+1)); else echo "FAIL a_ste ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/dialysis_body_4.json "$H/api/dialysis_access/access_cannulation")
if [ "$C" = "200" ]; then echo "OK a_can"; P=$((P+1)); else echo "FAIL a_can ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/dialysis_body_5.json "$H/api/dialysis_adequacy/ktv")
if [ "$C" = "200" ]; then echo "OK d_ktv"; P=$((P+1)); else echo "FAIL d_ktv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/dialysis_body_6.json "$H/api/dialysis_adequacy/urr")
if [ "$C" = "200" ]; then echo "OK d_urr"; P=$((P+1)); else echo "FAIL d_urr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/dialysis_body_7.json "$H/api/dialysis_adequacy/dry_weight")
if [ "$C" = "200" ]; then echo "OK d_dw"; P=$((P+1)); else echo "FAIL d_dw ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/dialysis_body_8.json "$H/api/dialysis_adequacy/session_freq")
if [ "$C" = "200" ]; then echo "OK d_frq"; P=$((P+1)); else echo "FAIL d_frq ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/dialysis_body_9.json "$H/api/dialysis_adequacy/clearance")
if [ "$C" = "200" ]; then echo "OK d_clr"; P=$((P+1)); else echo "FAIL d_clr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/dialysis_body_10.json "$H/api/dialysis_complication/hypotension")
if [ "$C" = "200" ]; then echo "OK c_hyp"; P=$((P+1)); else echo "FAIL c_hyp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/dialysis_body_11.json "$H/api/dialysis_complication/arrhythmia")
if [ "$C" = "200" ]; then echo "OK c_arr"; P=$((P+1)); else echo "FAIL c_arr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/dialysis_body_12.json "$H/api/dialysis_complication/cramping")
if [ "$C" = "200" ]; then echo "OK c_cra"; P=$((P+1)); else echo "FAIL c_cra ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/dialysis_body_13.json "$H/api/dialysis_complication/disequilibrium")
if [ "$C" = "200" ]; then echo "OK c_dsq"; P=$((P+1)); else echo "FAIL c_dsq ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/dialysis_body_14.json "$H/api/dialysis_complication/air_embolism")
if [ "$C" = "200" ]; then echo "OK c_air"; P=$((P+1)); else echo "FAIL c_air ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/dialysis_body_15.json "$H/api/dialysis_peritoneal/pet_test")
if [ "$C" = "200" ]; then echo "OK p_pet"; P=$((P+1)); else echo "FAIL p_pet ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/dialysis_body_16.json "$H/api/dialysis_peritoneal/peritonitis")
if [ "$C" = "200" ]; then echo "OK p_prt"; P=$((P+1)); else echo "FAIL p_prt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/dialysis_body_17.json "$H/api/dialysis_peritoneal/uf_capacity")
if [ "$C" = "200" ]; then echo "OK p_ufc"; P=$((P+1)); else echo "FAIL p_ufc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/dialysis_body_18.json "$H/api/dialysis_peritoneal/pd_adequacy")
if [ "$C" = "200" ]; then echo "OK p_adq"; P=$((P+1)); else echo "FAIL p_adq ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/dialysis_body_19.json "$H/api/dialysis_peritoneal/catheter_pd")
if [ "$C" = "200" ]; then echo "OK p_cat"; P=$((P+1)); else echo "FAIL p_cat ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/dialysis_body_20.json "$H/api/dialysis_dialyzer/dialyzer_select")
if [ "$C" = "200" ]; then echo "OK z_sel"; P=$((P+1)); else echo "FAIL z_sel ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/dialysis_body_21.json "$H/api/dialysis_dialyzer/reuse")
if [ "$C" = "200" ]; then echo "OK z_reu"; P=$((P+1)); else echo "FAIL z_reu ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/dialysis_body_22.json "$H/api/dialysis_dialyzer/dialysate")
if [ "$C" = "200" ]; then echo "OK z_dia"; P=$((P+1)); else echo "FAIL z_dia ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/dialysis_body_23.json "$H/api/dialysis_dialyzer/anticoagulation")
if [ "$C" = "200" ]; then echo "OK z_ant"; P=$((P+1)); else echo "FAIL z_ant ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/dialysis_body_24.json "$H/api/dialysis_dialyzer/water_quality")
if [ "$C" = "200" ]; then echo "OK z_wat"; P=$((P+1)); else echo "FAIL z_wat ($C)"; fi
echo PASS=$P FAIL=$F
