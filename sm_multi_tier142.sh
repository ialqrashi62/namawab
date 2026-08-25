#!/usr/bin/env bash
HOST="127.0.0.1"; PORT="3000"; T="m1testA"; PASS=0; FAIL=0
chk(){ local l="$1"; local f="$2"; local p="$3"; local c=$(curl -s -o /tmp/last.json -w "%{http_code}" -H "Content-Type: application/json" -H "x-tenant-id: $T" -X POST --data @"$f" "http://$HOST:$PORT$p"); if [ "$c" = "200" ]; then echo "PASS $p ($c)"; PASS=$((PASS+1)); else echo "FAIL $p ($c)"; cat /tmp/last.json | head -c 200; echo; FAIL=$((FAIL+1)); fi; }
chk c1 /tmp/multi_body_0.json /api/csx_ai_v2/cabg
chk c2 /tmp/multi_body_1.json /api/csx_ai_v2/valve
chk c3 /tmp/multi_body_2.json /api/csx_ai_v2/aortic
chk c4 /tmp/multi_body_3.json /api/csx_ai_v2/lung_resect
chk c5 /tmp/multi_body_4.json /api/csx_ai_v2/congenital
chk s1 /tmp/multi_body_5.json /api/smx_ai_v2/preparticipation
chk s2 /tmp/multi_body_6.json /api/smx_ai_v2/injury_assess
chk s3 /tmp/multi_body_7.json /api/smx_ai_v2/concussion
chk s4 /tmp/multi_body_8.json /api/smx_ai_v2/rehab
chk s5 /tmp/multi_body_9.json /api/smx_ai_v2/performance
chk p1 /tmp/multi_body_10.json /api/pax_ai_v2/pain_assess
chk p2 /tmp/multi_body_11.json /api/pax_ai_v2/nerve_block
chk p3 /tmp/multi_body_12.json /api/pax_ai_v2/pump
chk p4 /tmp/multi_body_13.json /api/pax_ai_v2/spinal_cord_stim
chk p5 /tmp/multi_body_14.json /api/pax_ai_v2/intrathecal
chk o1 /tmp/multi_body_15.json /api/ophx_ai_v2/refraction
chk o2 /tmp/multi_body_16.json /api/ophx_ai_v2/cataract
chk o3 /tmp/multi_body_17.json /api/ophx_ai_v2/retina
chk o4 /tmp/multi_body_18.json /api/ophx_ai_v2/glaucoma
chk o5 /tmp/multi_body_19.json /api/ophx_ai_v2/lasik
echo "SMOKE: PASS=$PASS FAIL=$FAIL"; exit $FAIL
