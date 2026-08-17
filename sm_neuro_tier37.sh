#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/neuro_body_0.json "$H/api/neuro_stroke/stroke_classification")
if [ "$C" = "200" ]; then echo "OK n_sc"; P=$((P+1)); else echo "FAIL n_sc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/neuro_body_1.json "$H/api/neuro_stroke/tpa_eligibility")
if [ "$C" = "200" ]; then echo "OK n_tpa"; P=$((P+1)); else echo "FAIL n_tpa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/neuro_body_2.json "$H/api/neuro_stroke/thrombectomy")
if [ "$C" = "200" ]; then echo "OK n_thr"; P=$((P+1)); else echo "FAIL n_thr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/neuro_body_3.json "$H/api/neuro_stroke/secondary_prevention")
if [ "$C" = "200" ]; then echo "OK n_sp"; P=$((P+1)); else echo "FAIL n_sp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/neuro_body_4.json "$H/api/neuro_stroke/stroke_rehab")
if [ "$C" = "200" ]; then echo "OK n_sr"; P=$((P+1)); else echo "FAIL n_sr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/neuro_body_5.json "$H/api/neuro_epi/epilepsy_diagnosis")
if [ "$C" = "200" ]; then echo "OK n_ed"; P=$((P+1)); else echo "FAIL n_ed ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/neuro_body_6.json "$H/api/neuro_epi/asm_selection")
if [ "$C" = "200" ]; then echo "OK n_as"; P=$((P+1)); else echo "FAIL n_as ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/neuro_body_7.json "$H/api/neuro_epi/status_epilepticus")
if [ "$C" = "200" ]; then echo "OK n_se"; P=$((P+1)); else echo "FAIL n_se ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/neuro_body_8.json "$H/api/neuro_epi/epilepsy_surgery")
if [ "$C" = "200" ]; then echo "OK n_ess"; P=$((P+1)); else echo "FAIL n_ess ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/neuro_body_9.json "$H/api/neuro_epi/eeg_review")
if [ "$C" = "200" ]; then echo "OK n_eeg"; P=$((P+1)); else echo "FAIL n_eeg ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/neuro_body_10.json "$H/api/neuro_ms/ms_diagnosis")
if [ "$C" = "200" ]; then echo "OK n_mdd"; P=$((P+1)); else echo "FAIL n_mdd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/neuro_body_11.json "$H/api/neuro_ms/ms_disease_modifying")
if [ "$C" = "200" ]; then echo "OK n_dm"; P=$((P+1)); else echo "FAIL n_dm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/neuro_body_12.json "$H/api/neuro_ms/ms_relapse")
if [ "$C" = "200" ]; then echo "OK n_mr"; P=$((P+1)); else echo "FAIL n_mr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/neuro_body_13.json "$H/api/neuro_ms/ms_progression")
if [ "$C" = "200" ]; then echo "OK n_mp"; P=$((P+1)); else echo "FAIL n_mp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/neuro_body_14.json "$H/api/neuro_ms/ms_symptom_management")
if [ "$C" = "200" ]; then echo "OK n_sm"; P=$((P+1)); else echo "FAIL n_sm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/neuro_body_15.json "$H/api/neuro_mov/parkinson_diagnosis")
if [ "$C" = "200" ]; then echo "OK n_pd"; P=$((P+1)); else echo "FAIL n_pd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/neuro_body_16.json "$H/api/neuro_mov/deep_brain_stimulation")
if [ "$C" = "200" ]; then echo "OK n_dbs"; P=$((P+1)); else echo "FAIL n_dbs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/neuro_body_17.json "$H/api/neuro_mov/essential_tremor")
if [ "$C" = "200" ]; then echo "OK n_et"; P=$((P+1)); else echo "FAIL n_et ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/neuro_body_18.json "$H/api/neuro_mov/dystonia")
if [ "$C" = "200" ]; then echo "OK n_dy"; P=$((P+1)); else echo "FAIL n_dy ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/neuro_body_19.json "$H/api/neuro_mov/ataxia")
if [ "$C" = "200" ]; then echo "OK n_at"; P=$((P+1)); else echo "FAIL n_at ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/neuro_body_20.json "$H/api/neuro_nm/als_diagnosis")
if [ "$C" = "200" ]; then echo "OK n_als"; P=$((P+1)); else echo "FAIL n_als ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/neuro_body_21.json "$H/api/neuro_nm/myasthenia")
if [ "$C" = "200" ]; then echo "OK n_my"; P=$((P+1)); else echo "FAIL n_my ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/neuro_body_22.json "$H/api/neuro_nm/peripheral_neuropathy")
if [ "$C" = "200" ]; then echo "OK n_pn"; P=$((P+1)); else echo "FAIL n_pn ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/neuro_body_23.json "$H/api/neuro_nm/muscular_dystrophy")
if [ "$C" = "200" ]; then echo "OK n_md"; P=$((P+1)); else echo "FAIL n_md ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/neuro_body_24.json "$H/api/neuro_nm/autonomic_dysfunction")
if [ "$C" = "200" ]; then echo "OK n_ad"; P=$((P+1)); else echo "FAIL n_ad ($C)"; fi
echo PASS=$P FAIL=$F
