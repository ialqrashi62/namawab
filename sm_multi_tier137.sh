#!/usr/bin/env bash
HOST="127.0.0.1"; PORT="3000"; T="m1testA"; PASS=0; FAIL=0
chk(){ local l="$1"; local f="$2"; local p="$3"; local c=$(curl -s -o /tmp/last.json -w "%{http_code}" -H "Content-Type: application/json" -H "x-tenant-id: $T" -X POST --data @"$f" "http://$HOST:$PORT$p"); if [ "$c" = "200" ]; then echo "PASS $p ($c)"; PASS=$((PASS+1)); else echo "FAIL $p ($c)"; cat /tmp/last.json | head -c 200; echo; FAIL=$((FAIL+1)); fi; }
chk c1 /tmp/multi_body_0.json /api/cds_ai_v2/differential_dx
chk c2 /tmp/multi_body_1.json /api/cds_ai_v2/risk_score
chk c3 /tmp/multi_body_2.json /api/cds_ai_v2/drug_interaction
chk c4 /tmp/multi_body_3.json /api/cds_ai_v2/sepsis_alert
chk c5 /tmp/multi_body_4.json /api/cds_ai_v2/alert_fatigue
chk n1 /tmp/multi_body_5.json /api/nlp_ai_v2/ner_extract
chk n2 /tmp/multi_body_6.json /api/nlp_ai_v2/sentiment
chk n3 /tmp/multi_body_7.json /api/nlp_ai_v2/summarization
chk n4 /tmp/multi_body_8.json /api/nlp_ai_v2/icd_coding
chk n5 /tmp/multi_body_9.json /api/nlp_ai_v2/transcription
chk i1 /tmp/multi_body_10.json /api/img_ai_v2/cnn_inference
chk i2 /tmp/multi_body_11.json /api/img_ai_v2/lesion_detect
chk i3 /tmp/multi_body_12.json /api/img_ai_v2/segmentation
chk i4 /tmp/multi_body_13.json /api/img_ai_v2/registration
chk i5 /tmp/multi_body_14.json /api/img_ai_v2/triage
chk p1 /tmp/multi_body_15.json /api/pred_ai_v2/readmission
chk p2 /tmp/multi_body_16.json /api/pred_ai_v2/mortality
chk p3 /tmp/multi_body_17.json /api/pred_ai_v2/los_predict
chk p4 /tmp/multi_body_18.json /api/pred_ai_v2/fall_risk
chk p5 /tmp/multi_body_19.json /api/pred_ai_v2/deterioration
echo "SMOKE: PASS=$PASS FAIL=$FAIL"; exit $FAIL
