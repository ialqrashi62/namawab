#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier183_imx_856_imx_xray_assessment
chk tier183_imx_856_imx_xray_screening
chk tier183_imx_856_imx_xray_followup
chk tier183_imx_856_imx_xray_procedure
chk tier183_imx_856_imx_xray_outcome
chk tier183_imc_857_imc_ct_assessment
chk tier183_imc_857_imc_ct_screening
chk tier183_imc_857_imc_ct_followup
chk tier183_imc_857_imc_ct_procedure
chk tier183_imc_857_imc_ct_outcome
chk tier183_imm_858_imm_mri_assessment
chk tier183_imm_858_imm_mri_screening
chk tier183_imm_858_imm_mri_followup
chk tier183_imm_858_imm_mri_procedure
chk tier183_imm_858_imm_mri_outcome
chk tier183_imu_859_imu_ultrasound_assessment
chk tier183_imu_859_imu_ultrasound_screening
chk tier183_imu_859_imu_ultrasound_followup
chk tier183_imu_859_imu_ultrasound_procedure
chk tier183_imu_859_imu_ultrasound_outcome
chk tier183_imn_860_imn_nuclear_assessment
chk tier183_imn_860_imn_nuclear_screening
chk tier183_imn_860_imn_nuclear_followup
chk tier183_imn_860_imn_nuclear_procedure
chk tier183_imn_860_imn_nuclear_outcome

echo "TOTALS: pass=$pass fail=$fail"
