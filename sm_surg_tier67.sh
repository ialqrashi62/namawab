#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/surg_body_0.json "$H/api/surg_pre_admit/pre_admission_testing")
if [ "$C" = "200" ]; then echo "OK s_pat"; P=$((P+1)); else echo "FAIL s_pat ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/surg_body_1.json "$H/api/surg_pre_admit/anesthesia_eval")
if [ "$C" = "200" ]; then echo "OK s_ae"; P=$((P+1)); else echo "FAIL s_ae ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/surg_body_2.json "$H/api/surg_pre_admit/pre_op_orders")
if [ "$C" = "200" ]; then echo "OK s_po"; P=$((P+1)); else echo "FAIL s_po ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/surg_body_3.json "$H/api/surg_pre_admit/pre_op_education")
if [ "$C" = "200" ]; then echo "OK s_pe"; P=$((P+1)); else echo "FAIL s_pe ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/surg_body_4.json "$H/api/surg_pre_admit/pre_admission_clearance")
if [ "$C" = "200" ]; then echo "OK s_pac"; P=$((P+1)); else echo "FAIL s_pac ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/surg_body_5.json "$H/api/surg_intraop/operative_note")
if [ "$C" = "200" ]; then echo "OK s_on"; P=$((P+1)); else echo "FAIL s_on ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/surg_body_6.json "$H/api/surg_intraop/timed_out")
if [ "$C" = "200" ]; then echo "OK s_to"; P=$((P+1)); else echo "FAIL s_to ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/surg_body_7.json "$H/api/surg_intraop/time_out")
if [ "$C" = "200" ]; then echo "OK s_tos"; P=$((P+1)); else echo "FAIL s_tos ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/surg_body_8.json "$H/api/surg_intraop/positioning")
if [ "$C" = "200" ]; then echo "OK s_po2"; P=$((P+1)); else echo "FAIL s_po2 ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/surg_body_9.json "$H/api/surg_intraop/anesthesia_record")
if [ "$C" = "200" ]; then echo "OK s_ar"; P=$((P+1)); else echo "FAIL s_ar ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/surg_body_10.json "$H/api/surg_postop/pacu_phase1")
if [ "$C" = "200" ]; then echo "OK s_p1"; P=$((P+1)); else echo "FAIL s_p1 ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/surg_body_11.json "$H/api/surg_postop/pacu_phase2")
if [ "$C" = "200" ]; then echo "OK s_p2"; P=$((P+1)); else echo "FAIL s_p2 ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/surg_body_12.json "$H/api/surg_postop/post_op_orders")
if [ "$C" = "200" ]; then echo "OK s_poo"; P=$((P+1)); else echo "FAIL s_poo ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/surg_body_13.json "$H/api/surg_postop/discharge_recovery")
if [ "$C" = "200" ]; then echo "OK s_dr"; P=$((P+1)); else echo "FAIL s_dr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/surg_body_14.json "$H/api/surg_postop/post_op_followup")
if [ "$C" = "200" ]; then echo "OK s_pof"; P=$((P+1)); else echo "FAIL s_pof ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/surg_body_15.json "$H/api/surg_complications/intraop_complication")
if [ "$C" = "200" ]; then echo "OK s_ic"; P=$((P+1)); else echo "FAIL s_ic ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/surg_body_16.json "$H/api/surg_complications/postop_complication")
if [ "$C" = "200" ]; then echo "OK s_pc"; P=$((P+1)); else echo "FAIL s_pc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/surg_body_17.json "$H/api/surg_complications/readmission_30d")
if [ "$C" = "200" ]; then echo "OK s_r30"; P=$((P+1)); else echo "FAIL s_r30 ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/surg_body_18.json "$H/api/surg_complications/reoperation")
if [ "$C" = "200" ]; then echo "OK s_reop"; P=$((P+1)); else echo "FAIL s_reop ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/surg_body_19.json "$H/api/surg_complications/ssi_tracking")
if [ "$C" = "200" ]; then echo "OK s_ssi"; P=$((P+1)); else echo "FAIL s_ssi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/surg_body_20.json "$H/api/surg_quality/or_efficiency")
if [ "$C" = "200" ]; then echo "OK s_oe"; P=$((P+1)); else echo "FAIL s_oe ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/surg_body_21.json "$H/api/surg_quality/case_duration_review")
if [ "$C" = "200" ]; then echo "OK s_cdr"; P=$((P+1)); else echo "FAIL s_cdr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/surg_body_22.json "$H/api/surg_quality/instrument_count")
if [ "$C" = "200" ]; then echo "OK s_icnt"; P=$((P+1)); else echo "FAIL s_icnt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/surg_body_23.json "$H/api/surg_quality/sponge_count")
if [ "$C" = "200" ]; then echo "OK s_scnt"; P=$((P+1)); else echo "FAIL s_scnt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/surg_body_24.json "$H/api/surg_quality/sharps_count")
if [ "$C" = "200" ]; then echo "OK s_shcnt"; P=$((P+1)); else echo "FAIL s_shcnt ($C)"; fi
echo PASS=$P FAIL=$F
