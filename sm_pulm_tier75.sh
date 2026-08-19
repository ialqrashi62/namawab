#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_0.json "$H/api/pulm_assess/spirometry")
if [ "$C" = "200" ]; then echo "OK p_spi"; P=$((P+1)); else echo "FAIL p_spi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_1.json "$H/api/pulm_assess/peak_flow")
if [ "$C" = "200" ]; then echo "OK p_pf"; P=$((P+1)); else echo "FAIL p_pf ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_2.json "$H/api/pulm_assess/bronchodilator_test")
if [ "$C" = "200" ]; then echo "OK p_bd"; P=$((P+1)); else echo "FAIL p_bd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_3.json "$H/api/pulm_assess/arterial_blood_gas")
if [ "$C" = "200" ]; then echo "OK p_abg"; P=$((P+1)); else echo "FAIL p_abg ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_4.json "$H/api/pulm_assess/oximetry_assessment")
if [ "$C" = "200" ]; then echo "OK p_ox"; P=$((P+1)); else echo "FAIL p_ox ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_5.json "$H/api/pulm_disease/copd_assessment")
if [ "$C" = "200" ]; then echo "OK p_copd"; P=$((P+1)); else echo "FAIL p_copd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_6.json "$H/api/pulm_disease/asthma_classification")
if [ "$C" = "200" ]; then echo "OK p_asm"; P=$((P+1)); else echo "FAIL p_asm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_7.json "$H/api/pulm_disease/interstitial_lung_disease")
if [ "$C" = "200" ]; then echo "OK p_ild"; P=$((P+1)); else echo "FAIL p_ild ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_8.json "$H/api/pulm_disease/pulmonary_hypertension_eval")
if [ "$C" = "200" ]; then echo "OK p_pht"; P=$((P+1)); else echo "FAIL p_pht ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_9.json "$H/api/pulm_disease/bronchiectasis_assessment")
if [ "$C" = "200" ]; then echo "OK p_brx"; P=$((P+1)); else echo "FAIL p_brx ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_10.json "$H/api/pulm_proc/bronchoscopy")
if [ "$C" = "200" ]; then echo "OK p_brc"; P=$((P+1)); else echo "FAIL p_brc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_11.json "$H/api/pulm_proc/thoracentesis")
if [ "$C" = "200" ]; then echo "OK p_thr"; P=$((P+1)); else echo "FAIL p_thr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_12.json "$H/api/pulm_proc/chest_tube_placement")
if [ "$C" = "200" ]; then echo "OK p_cht"; P=$((P+1)); else echo "FAIL p_cht ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_13.json "$H/api/pulm_proc/endobronchial_ultrasound")
if [ "$C" = "200" ]; then echo "OK p_ebus"; P=$((P+1)); else echo "FAIL p_ebus ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_14.json "$H/api/pulm_proc/pleuroscopy")
if [ "$C" = "200" ]; then echo "OK p_pls"; P=$((P+1)); else echo "FAIL p_pls ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_15.json "$H/api/pulm_special/sleep_study_referral")
if [ "$C" = "200" ]; then echo "OK p_ssr"; P=$((P+1)); else echo "FAIL p_ssr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_16.json "$H/api/pulm_special/oxygen_therapy_setup")
if [ "$C" = "200" ]; then echo "OK p_oxt"; P=$((P+1)); else echo "FAIL p_oxt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_17.json "$H/api/pulm_special/cpap_bpap_management")
if [ "$C" = "200" ]; then echo "OK p_cpap"; P=$((P+1)); else echo "FAIL p_cpap ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_18.json "$H/api/pulm_special/pulmonary_rehab")
if [ "$C" = "200" ]; then echo "OK p_prehab"; P=$((P+1)); else echo "FAIL p_prehab ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_19.json "$H/api/pulm_special/inhaler_technique_assessment")
if [ "$C" = "200" ]; then echo "OK p_ita"; P=$((P+1)); else echo "FAIL p_ita ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_20.json "$H/api/pulm_icu/mechanical_vent_setup")
if [ "$C" = "200" ]; then echo "OK p_mvs"; P=$((P+1)); else echo "FAIL p_mvs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_21.json "$H/api/pulm_icu/ventilator_weaning")
if [ "$C" = "200" ]; then echo "OK p_vw"; P=$((P+1)); else echo "FAIL p_vw ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_22.json "$H/api/pulm_icu/ards_management")
if [ "$C" = "200" ]; then echo "OK p_ards"; P=$((P+1)); else echo "FAIL p_ards ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_23.json "$H/api/pulm_icu/tracheostomy_care")
if [ "$C" = "200" ]; then echo "OK p_trc"; P=$((P+1)); else echo "FAIL p_trc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pulm_body_24.json "$H/api/pulm_icu/respiratory_failure_management")
if [ "$C" = "200" ]; then echo "OK p_rfm"; P=$((P+1)); else echo "FAIL p_rfm ($C)"; fi
echo PASS=$P FAIL=$F
