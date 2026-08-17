#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_0.json "$H/api/infx_hiv/hiv_diagnosis")
if [ "$C" = "200" ]; then echo "OK i_hd"; P=$((P+1)); else echo "FAIL i_hd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_1.json "$H/api/infx_hiv/art_initiation")
if [ "$C" = "200" ]; then echo "OK i_ai"; P=$((P+1)); else echo "FAIL i_ai ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_2.json "$H/api/infx_hiv/viral_load_monitoring")
if [ "$C" = "200" ]; then echo "OK i_vl"; P=$((P+1)); else echo "FAIL i_vl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_3.json "$H/api/infx_hiv/opportunistic_infection")
if [ "$C" = "200" ]; then echo "OK i_oi"; P=$((P+1)); else echo "FAIL i_oi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_4.json "$H/api/infx_hiv/hiv_prep")
if [ "$C" = "200" ]; then echo "OK i_prep"; P=$((P+1)); else echo "FAIL i_prep ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_5.json "$H/api/infx_tb/tb_diagnosis")
if [ "$C" = "200" ]; then echo "OK i_tbd"; P=$((P+1)); else echo "FAIL i_tbd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_6.json "$H/api/infx_tb/active_tb_treatment")
if [ "$C" = "200" ]; then echo "OK i_atb"; P=$((P+1)); else echo "FAIL i_atb ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_7.json "$H/api/infx_tb/latent_tb")
if [ "$C" = "200" ]; then echo "OK i_ltb"; P=$((P+1)); else echo "FAIL i_ltb ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_8.json "$H/api/infx_tb/drug_resistant_tb")
if [ "$C" = "200" ]; then echo "OK i_drt"; P=$((P+1)); else echo "FAIL i_drt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_9.json "$H/api/infx_tb/tb_contact_tracing")
if [ "$C" = "200" ]; then echo "OK i_ct"; P=$((P+1)); else echo "FAIL i_ct ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_10.json "$H/api/infx_hepa/hepatitis_a")
if [ "$C" = "200" ]; then echo "OK i_ha"; P=$((P+1)); else echo "FAIL i_ha ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_11.json "$H/api/infx_hepa/hepatitis_d")
if [ "$C" = "200" ]; then echo "OK i_hd2"; P=$((P+1)); else echo "FAIL i_hd2 ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_12.json "$H/api/infx_hepa/hepatitis_e")
if [ "$C" = "200" ]; then echo "OK i_he"; P=$((P+1)); else echo "FAIL i_he ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_13.json "$H/api/infx_hepa/chronic_hepb_management")
if [ "$C" = "200" ]; then echo "OK i_chb"; P=$((P+1)); else echo "FAIL i_chb ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_14.json "$H/api/infx_hepa/chronic_hepc_daa")
if [ "$C" = "200" ]; then echo "OK i_chc"; P=$((P+1)); else echo "FAIL i_chc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_15.json "$H/api/infx_trop/malaria")
if [ "$C" = "200" ]; then echo "OK i_mal"; P=$((P+1)); else echo "FAIL i_mal ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_16.json "$H/api/infx_trop/dengue")
if [ "$C" = "200" ]; then echo "OK i_den"; P=$((P+1)); else echo "FAIL i_den ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_17.json "$H/api/infx_trop/typhoid")
if [ "$C" = "200" ]; then echo "OK i_typh"; P=$((P+1)); else echo "FAIL i_typh ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_18.json "$H/api/infx_trop/chikungunya")
if [ "$C" = "200" ]; then echo "OK i_chik"; P=$((P+1)); else echo "FAIL i_chik ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_19.json "$H/api/infx_trop/parasitic_infection")
if [ "$C" = "200" ]; then echo "OK i_par"; P=$((P+1)); else echo "FAIL i_par ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_20.json "$H/api/infx_stew/culture_review")
if [ "$C" = "200" ]; then echo "OK i_cr"; P=$((P+1)); else echo "FAIL i_cr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_21.json "$H/api/infx_stew/antibiotic_review")
if [ "$C" = "200" ]; then echo "OK i_ar"; P=$((P+1)); else echo "FAIL i_ar ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_22.json "$H/api/infx_stew/iv_to_po")
if [ "$C" = "200" ]; then echo "OK i_ivpo"; P=$((P+1)); else echo "FAIL i_ivpo ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_23.json "$H/api/infx_stew/de_escalation")
if [ "$C" = "200" ]; then echo "OK i_de"; P=$((P+1)); else echo "FAIL i_de ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_24.json "$H/api/infx_stew/prospective_audit")
if [ "$C" = "200" ]; then echo "OK i_pa"; P=$((P+1)); else echo "FAIL i_pa ($C)"; fi
echo PASS=$P FAIL=$F
