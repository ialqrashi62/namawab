#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/em_body_0.json "$H/api/ed_triage/esi")
if [ "$C" = "200" ]; then echo "OK e_esi"; P=$((P+1)); else echo "FAIL e_esi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/em_body_1.json "$H/api/ed_triage/chief_complaint")
if [ "$C" = "200" ]; then echo "OK e_cc"; P=$((P+1)); else echo "FAIL e_cc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/em_body_2.json "$H/api/ed_triage/vitals_early_warning")
if [ "$C" = "200" ]; then echo "OK e_ews"; P=$((P+1)); else echo "FAIL e_ews ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/em_body_3.json "$H/api/ed_triage/disposition")
if [ "$C" = "200" ]; then echo "OK e_disp"; P=$((P+1)); else echo "FAIL e_disp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/em_body_4.json "$H/api/ed_triage/chief_complaint_v2")
if [ "$C" = "200" ]; then echo "OK e_cc2"; P=$((P+1)); else echo "FAIL e_cc2 ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/em_body_5.json "$H/api/ed_resus/acls")
if [ "$C" = "200" ]; then echo "OK e_acls"; P=$((P+1)); else echo "FAIL e_acls ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/em_body_6.json "$H/api/ed_resus/sepsis_bundle")
if [ "$C" = "200" ]; then echo "OK e_sep"; P=$((P+1)); else echo "FAIL e_sep ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/em_body_7.json "$H/api/ed_resus/stroke_alert")
if [ "$C" = "200" ]; then echo "OK e_stk"; P=$((P+1)); else echo "FAIL e_stk ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/em_body_8.json "$H/api/ed_resus/massive_transfusion")
if [ "$C" = "200" ]; then echo "OK e_mtp"; P=$((P+1)); else echo "FAIL e_mtp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/em_body_9.json "$H/api/ed_resus/code_blue")
if [ "$C" = "200" ]; then echo "OK e_cb"; P=$((P+1)); else echo "FAIL e_cb ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/em_body_10.json "$H/api/ed_trauma/trauma_activation")
if [ "$C" = "200" ]; then echo "OK e_act"; P=$((P+1)); else echo "FAIL e_act ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/em_body_11.json "$H/api/ed_trauma/iss_score")
if [ "$C" = "200" ]; then echo "OK e_iss"; P=$((P+1)); else echo "FAIL e_iss ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/em_body_12.json "$H/api/ed_trauma/mechanism")
if [ "$C" = "200" ]; then echo "OK e_mech"; P=$((P+1)); else echo "FAIL e_mech ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/em_body_13.json "$H/api/ed_trauma/secondary_survey")
if [ "$C" = "200" ]; then echo "OK e_sec"; P=$((P+1)); else echo "FAIL e_sec ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/em_body_14.json "$H/api/ed_trauma/transfer_trauma")
if [ "$C" = "200" ]; then echo "OK e_tx"; P=$((P+1)); else echo "FAIL e_tx ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/em_body_15.json "$H/api/ed_tox/toxidrome")
if [ "$C" = "200" ]; then echo "OK e_txm"; P=$((P+1)); else echo "FAIL e_txm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/em_body_16.json "$H/api/ed_tox/antidote")
if [ "$C" = "200" ]; then echo "OK e_ant"; P=$((P+1)); else echo "FAIL e_ant ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/em_body_17.json "$H/api/ed_tox/ingest")
if [ "$C" = "200" ]; then echo "OK e_ing"; P=$((P+1)); else echo "FAIL e_ing ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/em_body_18.json "$H/api/ed_tox/withdrawal")
if [ "$C" = "200" ]; then echo "OK e_wd"; P=$((P+1)); else echo "FAIL e_wd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/em_body_19.json "$H/api/ed_tox/envenomation")
if [ "$C" = "200" ]; then echo "OK e_env"; P=$((P+1)); else echo "FAIL e_env ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/em_body_20.json "$H/api/ed_ems/dispatch")
if [ "$C" = "200" ]; then echo "OK e_dsp"; P=$((P+1)); else echo "FAIL e_dsp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/em_body_21.json "$H/api/ed_ems/handoff")
if [ "$C" = "200" ]; then echo "OK e_hd"; P=$((P+1)); else echo "FAIL e_hd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/em_body_22.json "$H/api/ed_ems/telemetry")
if [ "$C" = "200" ]; then echo "OK e_tel"; P=$((P+1)); else echo "FAIL e_tel ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/em_body_23.json "$H/api/ed_ems/transport_mode")
if [ "$C" = "200" ]; then echo "OK e_tm"; P=$((P+1)); else echo "FAIL e_tm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/em_body_24.json "$H/api/ed_ems/documentation_ems")
if [ "$C" = "200" ]; then echo "OK e_doc"; P=$((P+1)); else echo "FAIL e_doc ($C)"; fi
echo PASS=$P FAIL=$F
