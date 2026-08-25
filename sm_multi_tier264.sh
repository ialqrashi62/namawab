#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier264_d1_1261_t264_e1_screen_assessment
chk tier264_d1_1261_t264_e1_screen_screening
chk tier264_d1_1261_t264_e1_screen_followup
chk tier264_d1_1261_t264_e1_screen_procedure
chk tier264_d1_1261_t264_e1_screen_outcome
chk tier264_d2_1262_t264_e2_eval_assessment
chk tier264_d2_1262_t264_e2_eval_screening
chk tier264_d2_1262_t264_e2_eval_followup
chk tier264_d2_1262_t264_e2_eval_procedure
chk tier264_d2_1262_t264_e2_eval_outcome
chk tier264_d3_1263_t264_e3_intervene_assessment
chk tier264_d3_1263_t264_e3_intervene_screening
chk tier264_d3_1263_t264_e3_intervene_followup
chk tier264_d3_1263_t264_e3_intervene_procedure
chk tier264_d3_1263_t264_e3_intervene_outcome
chk tier264_d4_1264_t264_e4_monitor_assessment
chk tier264_d4_1264_t264_e4_monitor_screening
chk tier264_d4_1264_t264_e4_monitor_followup
chk tier264_d4_1264_t264_e4_monitor_procedure
chk tier264_d4_1264_t264_e4_monitor_outcome
chk tier264_d5_1265_t264_e5_close_assessment
chk tier264_d5_1265_t264_e5_close_screening
chk tier264_d5_1265_t264_e5_close_followup
chk tier264_d5_1265_t264_e5_close_procedure
chk tier264_d5_1265_t264_e5_close_outcome

echo "TOTALS: pass=$pass fail=$fail"
