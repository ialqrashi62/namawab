#!/usr/bin/env bash
HOST="127.0.0.1"; PORT="3000"; T="m1testA"; PASS=0; FAIL=0
chk(){ local l="$1"; local f="$2"; local p="$3"; local c=$(curl -s -o /tmp/last.json -w "%{http_code}" -H "Content-Type: application/json" -H "x-tenant-id: $T" -X POST --data @"$f" "http://$HOST:$PORT$p"); if [ "$c" = "200" ]; then echo "PASS $p ($c)"; PASS=$((PASS+1)); else echo "FAIL $p ($c)"; cat /tmp/last.json | head -c 200; echo; FAIL=$((FAIL+1)); fi; }
chk n1 /tmp/multi_body_0.json /api/neon_ai_v2/apgar
chk n2 /tmp/multi_body_1.json /api/neon_ai_v2/bilimeter
chk n3 /tmp/multi_body_2.json /api/neon_ai_v2/feeding
chk n4 /tmp/multi_body_3.json /api/neon_ai_v2/kangaroo
chk n5 /tmp/multi_body_4.json /api/neon_ai_v2/screening
chk p1 /tmp/multi_body_5.json /api/psy_ai_v2/ect
chk p2 /tmp/multi_body_6.json /api/psy_ai_v2/tms
chk p3 /tmp/multi_body_7.json /api/psy_ai_v2/ketamine
chk p4 /tmp/multi_body_8.json /api/psy_ai_v2/monitoring
chk p5 /tmp/multi_body_9.json /api/psy_ai_v2/community
chk g1 /tmp/multi_body_10.json /api/ger_ai_v2/cga
chk g2 /tmp/multi_body_11.json /api/ger_ai_v2/frailty
chk g3 /tmp/multi_body_12.json /api/ger_ai_v2/polypharm
chk g4 /tmp/multi_body_13.json /api/ger_ai_v2/geriatric_syn
chk g5 /tmp/multi_body_14.json /api/ger_ai_v2/goals
chk a1 /tmp/multi_body_15.json /api/all_ai_v2/skin_test
chk a2 /tmp/multi_body_16.json /api/all_ai_v2/ige
chk a3 /tmp/multi_body_17.json /api/all_ai_v2/immunotherapy
chk a4 /tmp/multi_body_18.json /api/all_ai_v2/anaphylaxis
chk a5 /tmp/multi_body_19.json /api/all_ai_v2/biologic
echo "SMOKE: PASS=$PASS FAIL=$FAIL"; exit $FAIL
