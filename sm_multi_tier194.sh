#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier194_px1_911_px1_pre_assessment
chk tier194_px1_911_px1_pre_screening
chk tier194_px1_911_px1_pre_followup
chk tier194_px1_911_px1_pre_procedure
chk tier194_px1_911_px1_pre_outcome
chk tier194_px2_912_px2_intra_assessment
chk tier194_px2_912_px2_intra_screening
chk tier194_px2_912_px2_intra_followup
chk tier194_px2_912_px2_intra_procedure
chk tier194_px2_912_px2_intra_outcome
chk tier194_px3_913_px3_post_assessment
chk tier194_px3_913_px3_post_screening
chk tier194_px3_913_px3_post_followup
chk tier194_px3_913_px3_post_procedure
chk tier194_px3_913_px3_post_outcome
chk tier194_px4_914_px4_complication_assessment
chk tier194_px4_914_px4_complication_screening
chk tier194_px4_914_px4_complication_followup
chk tier194_px4_914_px4_complication_procedure
chk tier194_px4_914_px4_complication_outcome
chk tier194_px5_915_px5_outcome_assessment
chk tier194_px5_915_px5_outcome_screening
chk tier194_px5_915_px5_outcome_followup
chk tier194_px5_915_px5_outcome_procedure
chk tier194_px5_915_px5_outcome_outcome

echo "TOTALS: pass=$pass fail=$fail"
