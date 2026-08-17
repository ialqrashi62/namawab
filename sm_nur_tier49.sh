#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nur_body_0.json "$H/api/nurs_assess/vital_signs_full")
if [ "$C" = "200" ]; then echo "OK n_vsf"; P=$((P+1)); else echo "FAIL n_vsf ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nur_body_1.json "$H/api/nurs_assess/neuro_assess")
if [ "$C" = "200" ]; then echo "OK n_neu"; P=$((P+1)); else echo "FAIL n_neu ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nur_body_2.json "$H/api/nurs_assess/pain_assessment")
if [ "$C" = "200" ]; then echo "OK n_pai"; P=$((P+1)); else echo "FAIL n_pai ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nur_body_3.json "$H/api/nurs_assess/fall_risk")
if [ "$C" = "200" ]; then echo "OK n_fal"; P=$((P+1)); else echo "FAIL n_fal ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nur_body_4.json "$H/api/nurs_assess/pressure_injury_risk")
if [ "$C" = "200" ]; then echo "OK n_pir"; P=$((P+1)); else echo "FAIL n_pir ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nur_body_5.json "$H/api/nurs_med/medication_administration")
if [ "$C" = "200" ]; then echo "OK n_med"; P=$((P+1)); else echo "FAIL n_med ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nur_body_6.json "$H/api/nurs_med/iv_management")
if [ "$C" = "200" ]; then echo "OK n_iv"; P=$((P+1)); else echo "FAIL n_iv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nur_body_7.json "$H/api/nurs_med/blood_transfusion")
if [ "$C" = "200" ]; then echo "OK n_btx"; P=$((P+1)); else echo "FAIL n_btx ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nur_body_8.json "$H/api/nurs_med/insulin_drip")
if [ "$C" = "200" ]; then echo "OK n_ins"; P=$((P+1)); else echo "FAIL n_ins ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nur_body_9.json "$H/api/nurs_med/heparin_drip")
if [ "$C" = "200" ]; then echo "OK n_hep"; P=$((P+1)); else echo "FAIL n_hep ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nur_body_10.json "$H/api/nurs_wound/wound_assessment")
if [ "$C" = "200" ]; then echo "OK n_wnd"; P=$((P+1)); else echo "FAIL n_wnd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nur_body_11.json "$H/api/nurs_wound/dressing_change")
if [ "$C" = "200" ]; then echo "OK n_drs"; P=$((P+1)); else echo "FAIL n_drs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nur_body_12.json "$H/api/nurs_wound/ostomy_care")
if [ "$C" = "200" ]; then echo "OK n_ost"; P=$((P+1)); else echo "FAIL n_ost ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nur_body_13.json "$H/api/nurs_wound/trach_care")
if [ "$C" = "200" ]; then echo "OK n_tra"; P=$((P+1)); else echo "FAIL n_tra ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nur_body_14.json "$H/api/nurs_wound/suctioning")
if [ "$C" = "200" ]; then echo "OK n_suc"; P=$((P+1)); else echo "FAIL n_suc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nur_body_15.json "$H/api/nurs_resp/oxygen_therapy")
if [ "$C" = "200" ]; then echo "OK n_ox"; P=$((P+1)); else echo "FAIL n_ox ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nur_body_16.json "$H/api/nurs_resp/suction_nasotracheal")
if [ "$C" = "200" ]; then echo "OK n_nss"; P=$((P+1)); else echo "FAIL n_nss ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nur_body_17.json "$H/api/nurs_resp/cpap_management")
if [ "$C" = "200" ]; then echo "OK n_cpa"; P=$((P+1)); else echo "FAIL n_cpa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nur_body_18.json "$H/api/nurs_resp/chest_tube_care")
if [ "$C" = "200" ]; then echo "OK n_cht"; P=$((P+1)); else echo "FAIL n_cht ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nur_body_19.json "$H/api/nurs_resp/ventilator_alarms")
if [ "$C" = "200" ]; then echo "OK n_ven"; P=$((P+1)); else echo "FAIL n_ven ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nur_body_20.json "$H/api/nurs_safety/restraint_use")
if [ "$C" = "200" ]; then echo "OK n_res"; P=$((P+1)); else echo "FAIL n_res ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nur_body_21.json "$H/api/nurs_safety/patient_identification")
if [ "$C" = "200" ]; then echo "OK n_pid"; P=$((P+1)); else echo "FAIL n_pid ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nur_body_22.json "$H/api/nurs_safety/hand_hygiene")
if [ "$C" = "200" ]; then echo "OK n_hhy"; P=$((P+1)); else echo "FAIL n_hhy ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nur_body_23.json "$H/api/nurs_safety/sbar_communication")
if [ "$C" = "200" ]; then echo "OK n_sba"; P=$((P+1)); else echo "FAIL n_sba ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nur_body_24.json "$H/api/nurs_safety/shift_handoff")
if [ "$C" = "200" ]; then echo "OK n_sft"; P=$((P+1)); else echo "FAIL n_sft ($C)"; fi
echo PASS=$P FAIL=$F
