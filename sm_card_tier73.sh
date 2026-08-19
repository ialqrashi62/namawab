#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/card_body_0.json "$H/api/card_echo/echo_complete")
if [ "$C" = "200" ]; then echo "OK c_eco"; P=$((P+1)); else echo "FAIL c_eco ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/card_body_1.json "$H/api/card_echo/echo_limited")
if [ "$C" = "200" ]; then echo "OK c_elm"; P=$((P+1)); else echo "FAIL c_elm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/card_body_2.json "$H/api/card_echo/stress_echo")
if [ "$C" = "200" ]; then echo "OK c_se"; P=$((P+1)); else echo "FAIL c_se ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/card_body_3.json "$H/api/card_echo/tte_followup")
if [ "$C" = "200" ]; then echo "OK c_tf"; P=$((P+1)); else echo "FAIL c_tf ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/card_body_4.json "$H/api/card_echo/tee")
if [ "$C" = "200" ]; then echo "OK c_tee"; P=$((P+1)); else echo "FAIL c_tee ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/card_body_5.json "$H/api/card_cath/diagnostic_cath")
if [ "$C" = "200" ]; then echo "OK c_dc"; P=$((P+1)); else echo "FAIL c_dc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/card_body_6.json "$H/api/card_cath/intervention_pci")
if [ "$C" = "200" ]; then echo "OK c_ip"; P=$((P+1)); else echo "FAIL c_ip ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/card_body_7.json "$H/api/card_cath/right_heart_cath")
if [ "$C" = "200" ]; then echo "OK c_rhc"; P=$((P+1)); else echo "FAIL c_rhc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/card_body_8.json "$H/api/card_cath/ivus")
if [ "$C" = "200" ]; then echo "OK c_iv"; P=$((P+1)); else echo "FAIL c_iv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/card_body_9.json "$H/api/card_cath/oct")
if [ "$C" = "200" ]; then echo "OK c_oct"; P=$((P+1)); else echo "FAIL c_oct ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/card_body_10.json "$H/api/card_ep/cardioversion")
if [ "$C" = "200" ]; then echo "OK c_cv"; P=$((P+1)); else echo "FAIL c_cv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/card_body_11.json "$H/api/card_ep/loop_recorder")
if [ "$C" = "200" ]; then echo "OK c_lr"; P=$((P+1)); else echo "FAIL c_lr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/card_body_12.json "$H/api/card_ep/device_interrogation")
if [ "$C" = "200" ]; then echo "OK c_di"; P=$((P+1)); else echo "FAIL c_di ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/card_body_13.json "$H/api/card_ep/ablation_avnrt")
if [ "$C" = "200" ]; then echo "OK c_aa"; P=$((P+1)); else echo "FAIL c_aa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/card_body_14.json "$H/api/card_ep/ablation_afib")
if [ "$C" = "200" ]; then echo "OK c_af"; P=$((P+1)); else echo "FAIL c_af ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/card_body_15.json "$H/api/card_hf/heart_failure_intake")
if [ "$C" = "200" ]; then echo "OK c_hfi"; P=$((P+1)); else echo "FAIL c_hfi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/card_body_16.json "$H/api/card_hf/heart_failure_followup")
if [ "$C" = "200" ]; then echo "OK c_hff"; P=$((P+1)); else echo "FAIL c_hff ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/card_body_17.json "$H/api/card_hf/cardiac_rehab")
if [ "$C" = "200" ]; then echo "OK c_cr"; P=$((P+1)); else echo "FAIL c_cr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/card_body_18.json "$H/api/card_hf/fluid_mgmt")
if [ "$C" = "200" ]; then echo "OK c_fm"; P=$((P+1)); else echo "FAIL c_fm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/card_body_19.json "$H/api/card_hf/gwtg_hf_care")
if [ "$C" = "200" ]; then echo "OK c_gw"; P=$((P+1)); else echo "FAIL c_gw ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/card_body_20.json "$H/api/card_admin/cardiac_consent")
if [ "$C" = "200" ]; then echo "OK c_cc"; P=$((P+1)); else echo "FAIL c_cc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/card_body_21.json "$H/api/card_admin/cardiac_quality")
if [ "$C" = "200" ]; then echo "OK c_cq"; P=$((P+1)); else echo "FAIL c_cq ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/card_body_22.json "$H/api/card_admin/cardiac_readmission")
if [ "$C" = "200" ]; then echo "OK c_cr2"; P=$((P+1)); else echo "FAIL c_cr2 ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/card_body_23.json "$H/api/card_admin/cardiac_med_rec")
if [ "$C" = "200" ]; then echo "OK c_cmr"; P=$((P+1)); else echo "FAIL c_cmr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/card_body_24.json "$H/api/card_admin/cardiac_infection")
if [ "$C" = "200" ]; then echo "OK c_ci"; P=$((P+1)); else echo "FAIL c_ci ($C)"; fi
echo PASS=$P FAIL=$F
