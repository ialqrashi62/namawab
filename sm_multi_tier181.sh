#!/bin/bash
pass=0
fail=0
chk() {
  local n=$1
  local url=$(echo $n | sed -E "s/^(tier[0-9]+_[a-z0-9]+_[0-9]+)_(.+)/\1\/\2/")
  local r=$(curl -s -X POST http://127.0.0.1:3000/$url -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -d @/tmp/$n.json)
  if echo "$r" | grep -q "ok..true"; then echo "OK $n"; pass=$((pass+1)); else echo "FAIL $n"; fail=$((fail+1)); fi
}
chk tier181_cdi_846_cdi_infection_assessment
chk tier181_cdi_846_cdi_infection_screening
chk tier181_cdi_846_cdi_infection_followup
chk tier181_cdi_846_cdi_infection_procedure
chk tier181_cdi_846_cdi_infection_outcome
chk tier181_cdp_847_cdp_prevention_assessment
chk tier181_cdp_847_cdp_prevention_screening
chk tier181_cdp_847_cdp_prevention_followup
chk tier181_cdp_847_cdp_prevention_procedure
chk tier181_cdp_847_cdp_prevention_outcome
chk tier181_cdt_848_cdt_treatment_assessment
chk tier181_cdt_848_cdt_treatment_screening
chk tier181_cdt_848_cdt_treatment_followup
chk tier181_cdt_848_cdt_treatment_procedure
chk tier181_cdt_848_cdt_treatment_outcome
chk tier181_cdm_849_cdm_monitoring_assessment
chk tier181_cdm_849_cdm_monitoring_screening
chk tier181_cdm_849_cdm_monitoring_followup
chk tier181_cdm_849_cdm_monitoring_procedure
chk tier181_cdm_849_cdm_monitoring_outcome
chk tier181_cdx_850_cdx_diagnostics_assessment
chk tier181_cdx_850_cdx_diagnostics_screening
chk tier181_cdx_850_cdx_diagnostics_followup
chk tier181_cdx_850_cdx_diagnostics_procedure
chk tier181_cdx_850_cdx_diagnostics_outcome

echo "TOTALS: pass=$pass fail=$fail"
