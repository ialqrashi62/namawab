#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_0.json "$H/api/cardio_stress/exercise_stress")
if [ "$C" = "200" ]; then echo "OK c_es"; P=$((P+1)); else echo "FAIL c_es ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_1.json "$H/api/cardio_stress/nuclear_stress")
if [ "$C" = "200" ]; then echo "OK c_ns"; P=$((P+1)); else echo "FAIL c_ns ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_2.json "$H/api/cardio_stress/echo_stress")
if [ "$C" = "200" ]; then echo "OK c_es2"; P=$((P+1)); else echo "FAIL c_es2 ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_3.json "$H/api/cardio_stress/ct_angio")
if [ "$C" = "200" ]; then echo "OK c_ct"; P=$((P+1)); else echo "FAIL c_ct ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_4.json "$H/api/cardio_stress/ami_marker")
if [ "$C" = "200" ]; then echo "OK c_ami"; P=$((P+1)); else echo "FAIL c_ami ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_5.json "$H/api/cardio_echo/tte_assess")
if [ "$C" = "200" ]; then echo "OK c_tte"; P=$((P+1)); else echo "FAIL c_tte ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_6.json "$H/api/cardio_echo/strain")
if [ "$C" = "200" ]; then echo "OK c_str"; P=$((P+1)); else echo "FAIL c_str ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_7.json "$H/api/cardio_echo/tee_assess")
if [ "$C" = "200" ]; then echo "OK c_tee"; P=$((P+1)); else echo "FAIL c_tee ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_8.json "$H/api/cardio_echo/pulmonary_htn")
if [ "$C" = "200" ]; then echo "OK c_ph"; P=$((P+1)); else echo "FAIL c_ph ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_9.json "$H/api/cardio_echo/diastolic")
if [ "$C" = "200" ]; then echo "OK c_dia"; P=$((P+1)); else echo "FAIL c_dia ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_10.json "$H/api/cardio_cath/cath_plan")
if [ "$C" = "200" ]; then echo "OK c_cp"; P=$((P+1)); else echo "FAIL c_cp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_11.json "$H/api/cardio_cath/pci_outcome")
if [ "$C" = "200" ]; then echo "OK c_pci"; P=$((P+1)); else echo "FAIL c_pci ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_12.json "$H/api/cardio_cath/tav")
if [ "$C" = "200" ]; then echo "OK c_tav"; P=$((P+1)); else echo "FAIL c_tav ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_13.json "$H/api/cardio_cath/mitraclip")
if [ "$C" = "200" ]; then echo "OK c_mc"; P=$((P+1)); else echo "FAIL c_mc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_14.json "$H/api/cardio_cath/lad_revascularization")
if [ "$C" = "200" ]; then echo "OK c_rev"; P=$((P+1)); else echo "FAIL c_rev ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_15.json "$H/api/cardio_ep/afib_management")
if [ "$C" = "200" ]; then echo "OK c_af"; P=$((P+1)); else echo "FAIL c_af ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_16.json "$H/api/cardio_ep/ablation")
if [ "$C" = "200" ]; then echo "OK c_abl"; P=$((P+1)); else echo "FAIL c_abl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_17.json "$H/api/cardio_ep/pacemaker")
if [ "$C" = "200" ]; then echo "OK c_pm"; P=$((P+1)); else echo "FAIL c_pm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_18.json "$H/api/cardio_ep/icd")
if [ "$C" = "200" ]; then echo "OK c_icd"; P=$((P+1)); else echo "FAIL c_icd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_19.json "$H/api/cardio_ep/anticoag_monitoring")
if [ "$C" = "200" ]; then echo "OK c_ac"; P=$((P+1)); else echo "FAIL c_ac ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_20.json "$H/api/cardio_hf/hf_classification")
if [ "$C" = "200" ]; then echo "OK c_hfc"; P=$((P+1)); else echo "FAIL c_hfc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_21.json "$H/api/cardio_hf/gdmt")
if [ "$C" = "200" ]; then echo "OK c_gd"; P=$((P+1)); else echo "FAIL c_gd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_22.json "$H/api/cardio_hf/lvad")
if [ "$C" = "200" ]; then echo "OK c_lv"; P=$((P+1)); else echo "FAIL c_lv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_23.json "$H/api/cardio_hf/pulmonary_h")
if [ "$C" = "200" ]; then echo "OK c_puh"; P=$((P+1)); else echo "FAIL c_puh ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/cardio_body_24.json "$H/api/cardio_hf/transplant_bridge")
if [ "$C" = "200" ]; then echo "OK c_tb"; P=$((P+1)); else echo "FAIL c_tb ($C)"; fi
echo PASS=$P FAIL=$F
