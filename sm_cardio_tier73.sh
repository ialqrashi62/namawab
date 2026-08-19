#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_0.json "$H/api/cardio_ext_ep/cardiac_cath")
if [ "$C" = "200" ]; then echo "OK c_cath"; P=$((P+1)); else echo "FAIL c_cath ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_1.json "$H/api/cardio_ext_ep/electrophysiology_study")
if [ "$C" = "200" ]; then echo "OK c_eps"; P=$((P+1)); else echo "FAIL c_eps ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_2.json "$H/api/cardio_ext_ep/ablation")
if [ "$C" = "200" ]; then echo "OK c_abl"; P=$((P+1)); else echo "FAIL c_abl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_3.json "$H/api/cardio_ext_ep/device_implant")
if [ "$C" = "200" ]; then echo "OK c_dev"; P=$((P+1)); else echo "FAIL c_dev ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_4.json "$H/api/cardio_ext_ep/wearable_loop_recorder")
if [ "$C" = "200" ]; then echo "OK c_wl"; P=$((P+1)); else echo "FAIL c_wl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_5.json "$H/api/cardio_ext_imaging/echo_complete")
if [ "$C" = "200" ]; then echo "OK c_ec"; P=$((P+1)); else echo "FAIL c_ec ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_6.json "$H/api/cardio_ext_imaging/stress_echo")
if [ "$C" = "200" ]; then echo "OK c_se"; P=$((P+1)); else echo "FAIL c_se ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_7.json "$H/api/cardio_ext_imaging/stress_nuclear")
if [ "$C" = "200" ]; then echo "OK c_sn"; P=$((P+1)); else echo "FAIL c_sn ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_8.json "$H/api/cardio_ext_imaging/ct_angiography_coronary")
if [ "$C" = "200" ]; then echo "OK c_ccta"; P=$((P+1)); else echo "FAIL c_ccta ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_9.json "$H/api/cardio_ext_imaging/cardiac_mri")
if [ "$C" = "200" ]; then echo "OK c_cmr"; P=$((P+1)); else echo "FAIL c_cmr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_10.json "$H/api/cardio_ext_chf/chf_intake")
if [ "$C" = "200" ]; then echo "OK c_chf_i"; P=$((P+1)); else echo "FAIL c_chf_i ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_11.json "$H/api/cardio_ext_chf/chf_medication_titration")
if [ "$C" = "200" ]; then echo "OK c_chf_mt"; P=$((P+1)); else echo "FAIL c_chf_mt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_12.json "$H/api/cardio_ext_chf/chf_followup")
if [ "$C" = "200" ]; then echo "OK c_chf_fu"; P=$((P+1)); else echo "FAIL c_chf_fu ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_13.json "$H/api/cardio_ext_chf/chf_decompensation")
if [ "$C" = "200" ]; then echo "OK c_chf_d"; P=$((P+1)); else echo "FAIL c_chf_d ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_14.json "$H/api/cardio_ext_chf/chf_advanced_therapies")
if [ "$C" = "200" ]; then echo "OK c_chf_at"; P=$((P+1)); else echo "FAIL c_chf_at ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_15.json "$H/api/cardio_ext_rehab/cardiac_rehab_intake")
if [ "$C" = "200" ]; then echo "OK c_crei"; P=$((P+1)); else echo "FAIL c_crei ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_16.json "$H/api/cardio_ext_rehab/exercise_prescription")
if [ "$C" = "200" ]; then echo "OK c_exrx"; P=$((P+1)); else echo "FAIL c_exrx ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_17.json "$H/api/cardio_ext_rehab/cardiac_rehab_progress")
if [ "$C" = "200" ]; then echo "OK c_crp"; P=$((P+1)); else echo "FAIL c_crp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_18.json "$H/api/cardio_ext_rehab/cardiac_rehab_discharge")
if [ "$C" = "200" ]; then echo "OK c_crd"; P=$((P+1)); else echo "FAIL c_crd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_19.json "$H/api/cardio_ext_rehab/remote_cardiac_monitoring")
if [ "$C" = "200" ]; then echo "OK c_rcm"; P=$((P+1)); else echo "FAIL c_rcm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_20.json "$H/api/cardio_ext_prevention/lipid_management")
if [ "$C" = "200" ]; then echo "OK c_lm"; P=$((P+1)); else echo "FAIL c_lm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_21.json "$H/api/cardio_ext_prevention/hypertension_specialist")
if [ "$C" = "200" ]; then echo "OK c_hs"; P=$((P+1)); else echo "FAIL c_hs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_22.json "$H/api/cardio_ext_prevention/cardiovascular_risk_assessment")
if [ "$C" = "200" ]; then echo "OK c_cvr"; P=$((P+1)); else echo "FAIL c_cvr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_23.json "$H/api/cardio_ext_prevention/antiplatelet_management")
if [ "$C" = "200" ]; then echo "OK c_ap"; P=$((P+1)); else echo "FAIL c_ap ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_24.json "$H/api/cardio_ext_prevention/smoking_cessation_cardiac")
if [ "$C" = "200" ]; then echo "OK c_sc"; P=$((P+1)); else echo "FAIL c_sc ($C)"; fi
echo PASS=$P FAIL=$F
