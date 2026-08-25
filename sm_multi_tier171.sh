#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier171_inf_795_abx_stewardship
chk tier171_inf_795_iv_to_po
chk tier171_inf_795_mdr_organism
chk tier171_inf_795_out_management
chk tier171_inf_795_sepsis_bundle
chk tier171_emp_796_compensation
chk tier171_emp_796_hrm_dashboard
chk tier171_emp_796_performance
chk tier171_emp_796_recruitment
chk tier171_emp_796_training
chk tier171_phr_797_controlled_substance
chk tier171_phr_797_high_alert
chk tier171_phr_797_look_alike
chk tier171_phr_797_med_reconciliation
chk tier171_phr_797_renal_dosing
chk tier171_qui_798_cqi_project
chk tier171_qui_798_fmea
chk tier171_qui_798_incident_report
chk tier171_qui_798_internal_audit
chk tier171_qui_798_root_cause
echo "TOTALS: pass=$pass fail=$fail"
