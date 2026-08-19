#!/usr/bin/env bash
HOST="127.0.0.1"; PORT="3000"; T="m1testA"; PASS=0; FAIL=0
chk(){ local l="$1"; local f="$2"; local p="$3"; local c=$(curl -s -o /tmp/last.json -w "%{http_code}" -H "Content-Type: application/json" -H "x-tenant-id: $T" -X POST --data @"$f" "http://$HOST:$PORT$p"); if [ "$c" = "200" ]; then echo "PASS $p ($c)"; PASS=$((PASS+1)); else echo "FAIL $p ($c)"; cat /tmp/last.json | head -c 200; echo; FAIL=$((FAIL+1)); fi; }
chk c1 /tmp/multi_body_0.json /api/card_v2/cath_lab
chk c2 /tmp/multi_body_1.json /api/card_v2/stress_test
chk c3 /tmp/multi_body_2.json /api/card_v2/echo_study
chk c4 /tmp/multi_body_3.json /api/card_v2/device_check
chk c5 /tmp/multi_body_4.json /api/card_v2/ablation_ep
chk s1 /tmp/multi_body_5.json /api/str_v2/stroke_alert
chk s2 /tmp/multi_body_6.json /api/str_v2/tpa_admin
chk s3 /tmp/multi_body_7.json /api/str_v2/thrombectomy_proc
chk s4 /tmp/multi_body_8.json /api/str_v2/icp_monitor
chk s5 /tmp/multi_body_9.json /api/str_v2/recovery_milestone
chk b1 /tmp/multi_body_10.json /api/bur_v2/burn_assess
chk b2 /tmp/multi_body_11.json /api/bur_v2/fluid_resus
chk b3 /tmp/multi_body_12.json /api/bur_v2/wound_care
chk b4 /tmp/multi_body_13.json /api/bur_v2/inhalation
chk b5 /tmp/multi_body_14.json /api/bur_v2/rehab
chk t1 /tmp/multi_body_15.json /api/tox_v2/tox_screen
chk t2 /tmp/multi_body_16.json /api/tox_v2/poisoning
chk t3 /tmp/multi_body_17.json /api/tox_v2/antidote
chk t4 /tmp/multi_body_18.json /api/tox_v2/decon
chk t5 /tmp/multi_body_19.json /api/tox_v2/tox_follow
echo "SMOKE: PASS=$PASS FAIL=$FAIL"; exit $FAIL
