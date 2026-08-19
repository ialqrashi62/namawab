#!/usr/bin/env bash
HOST="127.0.0.1"; PORT="3000"; T="m1testA"; PASS=0; FAIL=0
chk(){ local l="$1"; local f="$2"; local p="$3"; local c=$(curl -s -o /tmp/last.json -w "%{http_code}" -H "Content-Type: application/json" -H "x-tenant-id: $T" -X POST --data @"$f" "http://$HOST:$PORT$p"); if [ "$c" = "200" ]; then echo "PASS $p ($c)"; PASS=$((PASS+1)); else echo "FAIL $p ($c)"; cat /tmp/last.json | head -c 200; echo; FAIL=$((FAIL+1)); fi; }
chk o1 /tmp/multi_body_0.json /api/ops_ai_v2/bed_assign
chk o2 /tmp/multi_body_1.json /api/ops_ai_v2/staff_assign
chk o3 /tmp/multi_body_2.json /api/ops_ai_v2/utilization
chk o4 /tmp/multi_body_3.json /api/ops_ai_v2/housekeeping
chk o5 /tmp/multi_body_4.json /api/ops_ai_v2/transport
chk s1 /tmp/multi_body_5.json /api/sup_ai_v2/inventory
chk s2 /tmp/multi_body_6.json /api/sup_ai_v2/purchase_order
chk s3 /tmp/multi_body_7.json /api/sup_ai_v2/shortage
chk s4 /tmp/multi_body_8.json /api/sup_ai_v2/recall
chk s5 /tmp/multi_body_9.json /api/sup_ai_v2/cost_analysis
chk h1 /tmp/multi_body_10.json /api/hec_ai_v2/cost_qaly
chk h2 /tmp/multi_body_11.json /api/hec_ai_v2/budget_impact
chk h3 /tmp/multi_body_12.json /api/hec_ai_v2/value_based
chk h4 /tmp/multi_body_13.json /api/hec_ai_v2/payor_mix
chk h5 /tmp/multi_body_14.json /api/hec_ai_v2/price_transparency
chk v1 /tmp/multi_body_15.json /api/vox_ai_v2/voice_command
chk v2 /tmp/multi_body_16.json /api/vox_ai_v2/wake_word
chk v3 /tmp/multi_body_17.json /api/vox_ai_v2/dictation
chk v4 /tmp/multi_body_18.json /api/vox_ai_v2/biometric_voice
chk v5 /tmp/multi_body_19.json /api/vox_ai_v2/ambient_listen
echo "SMOKE: PASS=$PASS FAIL=$FAIL"; exit $FAIL
