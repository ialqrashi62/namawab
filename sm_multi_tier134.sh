#!/usr/bin/env bash
HOST="127.0.0.1"; PORT="3000"; T="m1testA"; PASS=0; FAIL=0
chk(){ local l="$1"; local f="$2"; local p="$3"; local c=$(curl -s -o /tmp/last.json -w "%{http_code}" -H "Content-Type: application/json" -H "x-tenant-id: $T" -X POST --data @"$f" "http://$HOST:$PORT$p"); if [ "$c" = "200" ]; then echo "PASS $p ($c)"; PASS=$((PASS+1)); else echo "FAIL $p ($c)"; cat /tmp/last.json | head -c 200; echo; FAIL=$((FAIL+1)); fi; }
chk c1 /tmp/multi_body_0.json /api/onc_v2/chemo_order
chk c2 /tmp/multi_body_1.json /api/onc_v2/radiation_session
chk c3 /tmp/multi_body_2.json /api/onc_v2/tumor_board
chk c4 /tmp/multi_body_3.json /api/onc_v2/survivorship
chk c5 /tmp/multi_body_4.json /api/onc_v2/palliative_care
chk c6 /tmp/multi_body_5.json /api/beh_v2/screening
chk c7 /tmp/multi_body_6.json /api/beh_v2/counseling
chk c8 /tmp/multi_body_7.json /api/beh_v2/crisis
chk c9 /tmp/multi_body_8.json /api/beh_v2/substance
chk c10 /tmp/multi_body_9.json /api/beh_v2/therapy
chk c11 /tmp/multi_body_10.json /api/txp_v2/donor_eval
chk c12 /tmp/multi_body_11.json /api/txp_v2/recipient_list
chk c13 /tmp/multi_body_12.json /api/txp_v2/immunosuppression
chk c14 /tmp/multi_body_13.json /api/txp_v2/rejection_event
chk c15 /tmp/multi_body_14.json /api/txp_v2/post_tx_followup
chk c16 /tmp/multi_body_15.json /api/hos_v2/admission
chk c17 /tmp/multi_body_16.json /api/hos_v2/comfort_care
chk c18 /tmp/multi_body_17.json /api/hos_v2/bereavement
chk c19 /tmp/multi_body_18.json /api/hos_v2/respite
chk c20 /tmp/multi_body_19.json /api/hos_v2/spiritual_care
echo "SMOKE: PASS=$PASS FAIL=$FAIL"; exit $FAIL
