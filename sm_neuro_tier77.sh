#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/neuro_stroke_v2/stroke_initial|n_stroke_init"
  "1|/api/neuro_stroke_v2/stroke_thrombolysis|n_stroke_thr"
  "2|/api/neuro_stroke_v2/stroke_post_care|n_stroke_post"
  "3|/api/neuro_stroke_v2/stroke_rehab|n_stroke_reh"
  "4|/api/neuro_stroke_v2/stroke_secondary_prevention|n_stroke_sec"
  "5|/api/neuro_epilepsy_v2/epilepsy_initial|n_ep_init"
  "6|/api/neuro_epilepsy_v2/seizure_classification|n_ep_seiz"
  "7|/api/neuro_epilepsy_v2/aed_management|n_ep_aed"
  "8|/api/neuro_epilepsy_v2/eeg_review|n_ep_eeg"
  "9|/api/neuro_epilepsy_v2/epilepsy_surgery_eval|n_ep_surg"
  "10|/api/neuro_movement_v2/movement_initial|n_mv_init"
  "11|/api/neuro_movement_v2/parkinson_meds|n_mv_pd"
  "12|/api/neuro_movement_v2/dystonia_botox|n_mv_bot"
  "13|/api/neuro_movement_v2/tremor_workup|n_mv_trem"
  "14|/api/neuro_movement_v2/deep_brain_stimulation|n_mv_dbs"
  "15|/api/neuro_neuromuscular_v2/neuropathy_workup|n_nm_neurop"
  "16|/api/neuro_neuromuscular_v2/myasthenia_gravis|n_nm_mg"
  "17|/api/neuro_neuromuscular_v2/als_management|n_nm_als"
  "18|/api/neuro_neuromuscular_v2/gbs_assessment|n_nm_gbs"
  "19|/api/neuro_neuromuscular_v2/cnm_referral|n_nm_cnm"
  "20|/api/neuro_headache_v2/headache_initial|n_hd_init"
  "21|/api/neuro_headache_v2/migraine_prevention|n_hd_mig"
  "22|/api/neuro_headache_v2/cluster_headache|n_hd_clust"
  "23|/api/neuro_headache_v2/medication_overuse|n_hd_mou"
  "24|/api/neuro_headache_v2/botox_for_migraine|n_hd_botox"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1)
  URL=$(echo "$T" | cut -d'|' -f2)
  TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/neuro_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"
