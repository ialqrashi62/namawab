#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pop_body_0.json "$H/api/pop_registries/diabetes_registry")
if [ "$C" = "200" ]; then echo "OK p_dr"; P=$((P+1)); else echo "FAIL p_dr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pop_body_1.json "$H/api/pop_registries/hypertension_registry")
if [ "$C" = "200" ]; then echo "OK p_hr"; P=$((P+1)); else echo "FAIL p_hr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pop_body_2.json "$H/api/pop_registries/ckd_registry")
if [ "$C" = "200" ]; then echo "OK p_cr"; P=$((P+1)); else echo "FAIL p_cr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pop_body_3.json "$H/api/pop_registries/asthma_registry")
if [ "$C" = "200" ]; then echo "OK p_ar"; P=$((P+1)); else echo "FAIL p_ar ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pop_body_4.json "$H/api/pop_registries/heart_failure_registry")
if [ "$C" = "200" ]; then echo "OK p_hfr"; P=$((P+1)); else echo "FAIL p_hfr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pop_body_5.json "$H/api/pop_screen/cancer_screening")
if [ "$C" = "200" ]; then echo "OK p_cas"; P=$((P+1)); else echo "FAIL p_cas ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pop_body_6.json "$H/api/pop_screen/preventive_care_gaps")
if [ "$C" = "200" ]; then echo "OK p_pcg"; P=$((P+1)); else echo "FAIL p_pcg ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pop_body_7.json "$H/api/pop_screen/immunization_gaps")
if [ "$C" = "200" ]; then echo "OK p_img"; P=$((P+1)); else echo "FAIL p_img ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pop_body_8.json "$H/api/pop_screen/wellness_visit")
if [ "$C" = "200" ]; then echo "OK p_wv"; P=$((P+1)); else echo "FAIL p_wv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pop_body_9.json "$H/api/pop_screen/social_determinants")
if [ "$C" = "200" ]; then echo "OK p_sdh"; P=$((P+1)); else echo "FAIL p_sdh ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pop_body_10.json "$H/api/pop_cohort/risk_cohort_build")
if [ "$C" = "200" ]; then echo "OK p_rcb"; P=$((P+1)); else echo "FAIL p_rcb ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pop_body_11.json "$H/api/pop_cohort/high_risk_panel")
if [ "$C" = "200" ]; then echo "OK p_hrp"; P=$((P+1)); else echo "FAIL p_hrp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pop_body_12.json "$H/api/pop_cohort/care_gap_panel")
if [ "$C" = "200" ]; then echo "OK p_cgp"; P=$((P+1)); else echo "FAIL p_cgp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pop_body_13.json "$H/api/pop_cohort/outreach_panel")
if [ "$C" = "200" ]; then echo "OK p_op"; P=$((P+1)); else echo "FAIL p_op ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pop_body_14.json "$H/api/pop_cohort/disenrollment_panel")
if [ "$C" = "200" ]; then echo "OK p_dp"; P=$((P+1)); else echo "FAIL p_dp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pop_body_15.json "$H/api/pop_outreach/outreach_call")
if [ "$C" = "200" ]; then echo "OK p_oc"; P=$((P+1)); else echo "FAIL p_oc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pop_body_16.json "$H/api/pop_outreach/outreach_message")
if [ "$C" = "200" ]; then echo "OK p_om"; P=$((P+1)); else echo "FAIL p_om ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pop_body_17.json "$H/api/pop_outreach/outreach_visit")
if [ "$C" = "200" ]; then echo "OK p_ov"; P=$((P+1)); else echo "FAIL p_ov ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pop_body_18.json "$H/api/pop_outreach/outreach_education")
if [ "$C" = "200" ]; then echo "OK p_oe"; P=$((P+1)); else echo "FAIL p_oe ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pop_body_19.json "$H/api/pop_outreach/outreach_reminder")
if [ "$C" = "200" ]; then echo "OK p_or"; P=$((P+1)); else echo "FAIL p_or ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pop_body_20.json "$H/api/pop_metrics/hEDIS_measure")
if [ "$C" = "200" ]; then echo "OK p_hm"; P=$((P+1)); else echo "FAIL p_hm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pop_body_21.json "$H/api/pop_metrics/quality_pay_performance")
if [ "$C" = "200" ]; then echo "OK p_qpp"; P=$((P+1)); else echo "FAIL p_qpp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pop_body_22.json "$H/api/pop_metrics/metric_trend")
if [ "$C" = "200" ]; then echo "OK p_mt"; P=$((P+1)); else echo "FAIL p_mt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pop_body_23.json "$H/api/pop_metrics/benchmark_comparison")
if [ "$C" = "200" ]; then echo "OK p_bc"; P=$((P+1)); else echo "FAIL p_bc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/pop_body_24.json "$H/api/pop_metrics/intervention_roi")
if [ "$C" = "200" ]; then echo "OK p_ir"; P=$((P+1)); else echo "FAIL p_ir ($C)"; fi
echo PASS=$P FAIL=$F
