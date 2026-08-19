#!/usr/bin/env bash
HOST="127.0.0.1"; PORT="3000"; T="m1testA"; PASS=0; FAIL=0
chk(){ local l="$1"; local f="$2"; local p="$3"; local c=$(curl -s -o /tmp/last.json -w "%{http_code}" -H "Content-Type: application/json" -H "x-tenant-id: $T" -X POST --data @"$f" "http://$HOST:$PORT$p"); if [ "$c" = "200" ]; then echo "PASS $p ($c)"; PASS=$((PASS+1)); else echo "FAIL $p ($c)"; cat /tmp/last.json | head -c 200; echo; FAIL=$((FAIL+1)); fi; }
chk i1 /tmp/multi_body_0.json /api/gen_v2/genetic_test
chk i2 /tmp/multi_body_1.json /api/gen_v2/variant_call
chk i3 /tmp/multi_body_2.json /api/gen_v2/counseling
chk i4 /tmp/multi_body_3.json /api/gen_v2/family_history
chk i5 /tmp/multi_body_4.json /api/gen_v2/risk_calc
chk i6 /tmp/multi_body_5.json /api/pcu_v2/picu_admission
chk i7 /tmp/multi_body_6.json /api/pcu_v2/vent_mgmt
chk i8 /tmp/multi_body_7.json /api/pcu_v2/sedation
chk i9 /tmp/multi_body_8.json /api/pcu_v2/ecmo
chk i10 /tmp/multi_body_9.json /api/pcu_v2/code_event
chk i11 /tmp/multi_body_10.json /api/rob_v2/preop
chk i12 /tmp/multi_body_11.json /api/rob_v2/console
chk i13 /tmp/multi_body_12.json /api/rob_v2/outcomes
chk i14 /tmp/multi_body_13.json /api/rob_v2/training
chk i15 /tmp/multi_body_14.json /api/rob_v2/complication
chk i16 /tmp/multi_body_15.json /api/irc_v2/angio
chk i17 /tmp/multi_body_16.json /api/irc_v2/stenting
chk i18 /tmp/multi_body_17.json /api/irc_v2/embolization
chk i19 /tmp/multi_body_18.json /api/irc_v2/thrombectomy
chk i20 /tmp/multi_body_19.json /api/irc_v2/ablation
echo "SMOKE: PASS=$PASS FAIL=$FAIL"; exit $FAIL
