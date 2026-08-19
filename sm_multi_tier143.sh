#!/usr/bin/env bash
HOST="127.0.0.1"; PORT="3000"; T="m1testA"; PASS=0; FAIL=0
chk(){ local l="$1"; local f="$2"; local p="$3"; local c=$(curl -s -o /tmp/last.json -w "%{http_code}" -H "Content-Type: application/json" -H "x-tenant-id: $T" -X POST --data @"$f" "http://$HOST:$PORT$p"); if [ "$c" = "200" ]; then echo "PASS $p ($c)"; PASS=$((PASS+1)); else echo "FAIL $p ($c)"; cat /tmp/last.json | head -c 200; echo; FAIL=$((FAIL+1)); fi; }
chk o1 /tmp/multi_body_0.json /api/obx_ai_v2/pregnancy_register
chk o2 /tmp/multi_body_1.json /api/obx_ai_v2/antenatal_visit
chk o3 /tmp/multi_body_2.json /api/obx_ai_v2/ultrasound
chk o4 /tmp/multi_body_3.json /api/obx_ai_v2/delivery
chk o5 /tmp/multi_body_4.json /api/obx_ai_v2/postpartum
chk e1 /tmp/multi_body_5.json /api/entx_ai_v2/audiogram
chk e2 /tmp/multi_body_6.json /api/entx_ai_v2/endoscopy
chk e3 /tmp/multi_body_7.json /api/entx_ai_v2/tinnitus
chk e4 /tmp/multi_body_8.json /api/entx_ai_v2/sinus_ct
chk e5 /tmp/multi_body_9.json /api/entx_ai_v2/voice
chk u1 /tmp/multi_body_10.json /api/urox_ai_v2/psa
chk u2 /tmp/multi_body_11.json /api/urox_ai_v2/uroflow
chk u3 /tmp/multi_body_12.json /api/urox_ai_v2/biopsy
chk u4 /tmp/multi_body_13.json /api/urox_ai_v2/stone
chk u5 /tmp/multi_body_14.json /api/urox_ai_v2/urinary
chk d1 /tmp/multi_body_15.json /api/dentx_ai_v2/tooth_chart
chk d2 /tmp/multi_body_16.json /api/dentx_ai_v2/period
chk d3 /tmp/multi_body_17.json /api/dentx_ai_v2/caries
chk d4 /tmp/multi_body_18.json /api/dentx_ai_v2/ortho
chk d5 /tmp/multi_body_19.json /api/dentx_ai_v2/implant
echo "SMOKE: PASS=$PASS FAIL=$FAIL"; exit $FAIL
