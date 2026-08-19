#!/usr/bin/env bash
HOST="127.0.0.1"; PORT="3000"; T="m1testA"; PASS=0; FAIL=0
chk(){ local l="$1"; local f="$2"; local p="$3"; local c=$(curl -s -o /tmp/last.json -w "%{http_code}" -H "Content-Type: application/json" -H "x-tenant-id: $T" -X POST --data @"$f" "http://$HOST:$PORT$p"); if [ "$c" = "200" ]; then echo "PASS $p ($c)"; PASS=$((PASS+1)); else echo "FAIL $p ($c)"; cat /tmp/last.json | head -c 200; echo; FAIL=$((FAIL+1)); fi; }
chk s1 /tmp/multi_body_0.json /api/sec_ai_v2/threat_detect
chk s2 /tmp/multi_body_1.json /api/sec_ai_v2/phi_access
chk s3 /tmp/multi_body_2.json /api/sec_ai_v2/anomaly_session
chk s4 /tmp/multi_body_3.json /api/sec_ai_v2/key_rotation
chk s5 /tmp/multi_body_4.json /api/sec_ai_v2/incident_response
chk b1 /tmp/multi_body_5.json /api/bio_ai_v2/syndromic_surveillance
chk b2 /tmp/multi_body_6.json /api/bio_ai_v2/lab_anomaly
chk b3 /tmp/multi_body_7.json /api/bio_ai_v2/travel_health
chk b4 /tmp/multi_body_8.json /api/bio_ai_v2/outbreak_trace
chk b5 /tmp/multi_body_9.json /api/bio_ai_v2/biorisk_score
chk c1 /tmp/multi_body_10.json /api/com_ai_v2/audit_log
chk c2 /tmp/multi_body_11.json /api/com_ai_v2/race_condition
chk c3 /tmp/multi_body_12.json /api/com_ai_v2/compliance_check
chk c4 /tmp/multi_body_13.json /api/com_ai_v2/policy_eval
chk c5 /tmp/multi_body_14.json /api/com_ai_v2/attestation
chk p1 /tmp/multi_body_15.json /api/pen_ai_v2/pentest_target
chk p2 /tmp/multi_body_16.json /api/pen_ai_v2/vuln_scan
chk p3 /tmp/multi_body_17.json /api/pen_ai_v2/exploit_chain
chk p4 /tmp/multi_body_18.json /api/pen_ai_v2/auth_attack
chk p5 /tmp/multi_body_19.json /api/pen_ai_v2/report
echo "SMOKE: PASS=$PASS FAIL=$FAIL"; exit $FAIL
