#!/usr/bin/env bash
HOST="127.0.0.1"; PORT="3000"; T="m1testA"; PASS=0; FAIL=0
chk(){ local l="$1"; local f="$2"; local p="$3"; local c=$(curl -s -o /tmp/last.json -w "%{http_code}" -H "Content-Type: application/json" -H "x-tenant-id: $T" -X POST --data @"$f" "http://$HOST:$PORT$p"); if [ "$c" = "200" ]; then echo "PASS $p ($c)"; PASS=$((PASS+1)); else echo "FAIL $p ($c)"; cat /tmp/last.json | head -c 200; echo; FAIL=$((FAIL+1)); fi; }
chk r1 /tmp/multi_body_0.json /api/rag_ai_v2/chunk_embed
chk r2 /tmp/multi_body_1.json /api/rag_ai_v2/vector_search
chk r3 /tmp/multi_body_2.json /api/rag_ai_v2/rerank
chk r4 /tmp/multi_body_3.json /api/rag_ai_v2/rag_query
chk r5 /tmp/multi_body_4.json /api/rag_ai_v2/hallucination_check
chk g1 /tmp/multi_body_5.json /api/gen_ai_v2/fastq_qc
chk g2 /tmp/multi_body_6.json /api/gen_ai_v2/alignment
chk g3 /tmp/multi_body_7.json /api/gen_ai_v2/variant_call
chk g4 /tmp/multi_body_8.json /api/gen_ai_v2/annotation
chk g5 /tmp/multi_body_9.json /api/gen_ai_v2/report
chk t1 /tmp/multi_body_10.json /api/tel_ai_v2/start_session
chk t2 /tmp/multi_body_11.json /api/tel_ai_v2/record
chk t3 /tmp/multi_body_12.json /api/tel_ai_v2/streaming
chk t4 /tmp/multi_body_13.json /api/tel_ai_v2/vitals_stream
chk t5 /tmp/multi_body_14.json /api/tel_ai_v2/end_session
chk a1 /tmp/multi_body_15.json /api/alert_ai_v2/smart_alert
chk a2 /tmp/multi_body_16.json /api/alert_ai_v2/rule_engine
chk a3 /tmp/multi_body_17.json /api/alert_ai_v2/suppression
chk a4 /tmp/multi_body_18.json /api/alert_ai_v2/escalation
chk a5 /tmp/multi_body_19.json /api/alert_ai_v2/feedback
echo "SMOKE: PASS=$PASS FAIL=$FAIL"; exit $FAIL
