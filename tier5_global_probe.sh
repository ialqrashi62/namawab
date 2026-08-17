#!/bin/bash
# Comprehensive probe: scan all mounted /api/* routes by listing every POST endpoint
HOST="http://127.0.0.1:3000"
PASS=0; FAIL=0; NOT_FOUND=0; INVALID=0
echo "=== Tier5_EXT wave probe (one per mount) ==="

probe_prefix() {
  local prefix="$1"
  local base="$HOST/api/$prefix"
  # Try common endpoint names
  for ep in home screen intake register manage hook hook_patient_view sync notify validate_order translate convert transform reconcile status list query check process handle action review audit index start run apply reset dispatch register_v2; do
    local code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$base/$ep" -H 'Content-Type: application/json' -d '{"_probe":true}')
    if [ "$code" = "200" ] || [ "$code" = "400" ]; then
      echo "ALIVE  $prefix/$ep ($code)"
      PASS=$((PASS+1))
    elif [ "$code" = "404" ]; then
      NOT_FOUND=$((NOT_FOUND+1))
    elif [ "$code" = "500" ]; then
      echo "BROKEN $prefix/$ep ($code)"
      FAIL=$((FAIL+1))
    else
      INVALID=$((INVALID+1))
    fi
  done
}

# All tier5_ext mount prefixes from server.js
for prefix in sdoh_screen sdoh_lit sdoh_econ sdoh_sup sdoh_func sdoh_ref \
  forensic_mlc forensic_sa forensic_work forensic_doc forensic_court forensic_ethic \
  genobrca genopgx genopren genocar genonbs genotrio \
  integ_cds integ_fhir integ_hl7 integ_ter integ_cpl integ_ctn \
  ops_ext ops_bed ops_staff ops_qual ops_acc ops_inc ops_audit \
  rehab_assess rehab_treat rehab_outc rehab_complex rehab_prosth rehab_discharge \
  ph_rc ph_sw ph_in ph_to ph_pe ph_on \
  rare_dis rare_gen rare_rehab rare_pro rare_res rare_imm \
  pain_c pain_a pain_cx pain_h pain_p pain_e \
  surg_spec_ct surg_spec_ns surg_spec_vs surg_spec_tr surg_spec_pl surg_spec_pd \
  imus imct immri imir imnuc immam \
  in_iv in_pc in_ch in_is in_ho in_sp \
  dent_car dent_per dent_orth dent_endo dent_pros dent_max \
  add_scr add_det add_mat add_bhv add_hrm add_rec; do
  probe_prefix "$prefix"
done

echo ""
echo "ALIVE=$PASS  BROKEN=$FAIL  NOT_FOUND=$NOT_FOUND  INVALID=$INVALID"