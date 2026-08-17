#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ai_body_0.json "$H/api/ai_clin_dec/clinical_decision_support")
if [ "$C" = "200" ]; then echo "OK a_cds"; P=$((P+1)); else echo "FAIL a_cds ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ai_body_1.json "$H/api/ai_clin_dec/risk_stratification")
if [ "$C" = "200" ]; then echo "OK a_rsk"; P=$((P+1)); else echo "FAIL a_rsk ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ai_body_2.json "$H/api/ai_clin_dec/differential_diagnosis")
if [ "$C" = "200" ]; then echo "OK a_dxd"; P=$((P+1)); else echo "FAIL a_dxd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ai_body_3.json "$H/api/ai_clin_dec/drug_interaction_ai")
if [ "$C" = "200" ]; then echo "OK a_dia"; P=$((P+1)); else echo "FAIL a_dia ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ai_body_4.json "$H/api/ai_clin_dec/sepsis_alert_ai")
if [ "$C" = "200" ]; then echo "OK a_spa"; P=$((P+1)); else echo "FAIL a_spa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ai_body_5.json "$H/api/ai_diag_img/radiology_ai_assist")
if [ "$C" = "200" ]; then echo "OK a_rda"; P=$((P+1)); else echo "FAIL a_rda ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ai_body_6.json "$H/api/ai_diag_img/pathology_ai_assist")
if [ "$C" = "200" ]; then echo "OK a_pda"; P=$((P+1)); else echo "FAIL a_pda ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ai_body_7.json "$H/api/ai_diag_img/dermatology_ai_assist")
if [ "$C" = "200" ]; then echo "OK a_dda"; P=$((P+1)); else echo "FAIL a_dda ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ai_body_8.json "$H/api/ai_diag_img/ecg_ai_assist")
if [ "$C" = "200" ]; then echo "OK a_ega"; P=$((P+1)); else echo "FAIL a_ega ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ai_body_9.json "$H/api/ai_diag_img/retinal_ai_screening")
if [ "$C" = "200" ]; then echo "OK a_rta"; P=$((P+1)); else echo "FAIL a_rta ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ai_body_10.json "$H/api/ai_nlp_doc/nlp_clinical_note")
if [ "$C" = "200" ]; then echo "OK a_ncn"; P=$((P+1)); else echo "FAIL a_ncn ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ai_body_11.json "$H/api/ai_nlp_doc/nlp_voice_to_text")
if [ "$C" = "200" ]; then echo "OK a_nvt"; P=$((P+1)); else echo "FAIL a_nvt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ai_body_12.json "$H/api/ai_nlp_doc/nlp_code_suggestion")
if [ "$C" = "200" ]; then echo "OK a_ncs"; P=$((P+1)); else echo "FAIL a_ncs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ai_body_13.json "$H/api/ai_nlp_doc/nlp_soap_auto")
if [ "$C" = "200" ]; then echo "OK a_nsa"; P=$((P+1)); else echo "FAIL a_nsa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ai_body_14.json "$H/api/ai_nlp_doc/nlp_drug_extract")
if [ "$C" = "200" ]; then echo "OK a_nde"; P=$((P+1)); else echo "FAIL a_nde ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ai_body_15.json "$H/api/ai_forecast/ed_volume_forecast")
if [ "$C" = "200" ]; then echo "OK a_evf"; P=$((P+1)); else echo "FAIL a_evf ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ai_body_16.json "$H/api/ai_forecast/bed_demand_forecast")
if [ "$C" = "200" ]; then echo "OK a_bdf"; P=$((P+1)); else echo "FAIL a_bdf ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ai_body_17.json "$H/api/ai_forecast/staff_optimization")
if [ "$C" = "200" ]; then echo "OK a_sop"; P=$((P+1)); else echo "FAIL a_sop ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ai_body_18.json "$H/api/ai_forecast/readmission_risk")
if [ "$C" = "200" ]; then echo "OK a_rra"; P=$((P+1)); else echo "FAIL a_rra ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ai_body_19.json "$H/api/ai_forecast/length_of_stay")
if [ "$C" = "200" ]; then echo "OK a_los"; P=$((P+1)); else echo "FAIL a_los ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ai_body_20.json "$H/api/ai_chatbot/patient_chatbot_triage")
if [ "$C" = "200" ]; then echo "OK a_pct"; P=$((P+1)); else echo "FAIL a_pct ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ai_body_21.json "$H/api/ai_chatbot/patient_chatbot_followup")
if [ "$C" = "200" ]; then echo "OK a_pcf"; P=$((P+1)); else echo "FAIL a_pcf ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ai_body_22.json "$H/api/ai_chatbot/patient_chatbot_med_reminder")
if [ "$C" = "200" ]; then echo "OK a_pmr"; P=$((P+1)); else echo "FAIL a_pmr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ai_body_23.json "$H/api/ai_chatbot/patient_chatbot_education")
if [ "$C" = "200" ]; then echo "OK a_pce"; P=$((P+1)); else echo "FAIL a_pce ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ai_body_24.json "$H/api/ai_chatbot/patient_chatbot_feedback")
if [ "$C" = "200" ]; then echo "OK a_pfb"; P=$((P+1)); else echo "FAIL a_pfb ($C)"; fi
echo PASS=$P FAIL=$F
