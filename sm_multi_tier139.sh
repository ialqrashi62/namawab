#!/usr/bin/env bash
HOST="127.0.0.1"; PORT="3000"; T="m1testA"; PASS=0; FAIL=0
chk(){ local l="$1"; local f="$2"; local p="$3"; local c=$(curl -s -o /tmp/last.json -w "%{http_code}" -H "Content-Type: application/json" -H "x-tenant-id: $T" -X POST --data @"$f" "http://$HOST:$PORT$p"); if [ "$c" = "200" ]; then echo "PASS $p ($c)"; PASS=$((PASS+1)); else echo "FAIL $p ($c)"; cat /tmp/last.json | head -c 200; echo; FAIL=$((FAIL+1)); fi; }
chk t1 /tmp/multi_body_0.json /api/tri_ai_v2/trial_create
chk t2 /tmp/multi_body_1.json /api/tri_ai_v2/enroll
chk t3 /tmp/multi_body_2.json /api/tri_ai_v2/visit
chk t4 /tmp/multi_body_3.json /api/tri_ai_v2/ae_report
chk t5 /tmp/multi_body_4.json /api/tri_ai_v2/trial_outcome
chk w1 /tmp/multi_body_5.json /api/wear_ai_v2/device_register
chk w2 /tmp/multi_body_6.json /api/wear_ai_v2/telemetry
chk w3 /tmp/multi_body_7.json /api/wear_ai_v2/anomaly
chk w4 /tmp/multi_body_8.json /api/wear_ai_v2/adherence
chk w5 /tmp/multi_body_9.json /api/wear_ai_v2/iot_alert
chk c1 /tmp/multi_body_10.json /api/claim_ai_v2/claim_submit
chk c2 /tmp/multi_body_11.json /api/claim_ai_v2/claim_adjudicate
chk c3 /tmp/multi_body_12.json /api/claim_ai_v2/fraud_score
chk c4 /tmp/multi_body_13.json /api/claim_ai_v2/denial_appeal
chk c5 /tmp/multi_body_14.json /api/claim_ai_v2/remittance
chk r1 /tmp/multi_body_15.json /api/rob_ai_v2/surgical_plan
chk r2 /tmp/multi_body_16.json /api/rob_ai_v2/instrument_track
chk r3 /tmp/multi_body_17.json /api/rob_ai_v2/ai_assist
chk r4 /tmp/multi_body_18.json /api/rob_ai_v2/motion_analyze
chk r5 /tmp/multi_body_19.json /api/rob_ai_v2/post_op
echo "SMOKE: PASS=$PASS FAIL=$FAIL"; exit $FAIL
