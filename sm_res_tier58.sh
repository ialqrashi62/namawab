#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/res_body_0.json "$H/api/res_trial/clinical_trial_enroll")
if [ "$C" = "200" ]; then echo "OK r_cte"; P=$((P+1)); else echo "FAIL r_cte ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/res_body_1.json "$H/api/res_trial/clinical_trial_followup")
if [ "$C" = "200" ]; then echo "OK r_ctf"; P=$((P+1)); else echo "FAIL r_ctf ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/res_body_2.json "$H/api/res_trial/clinical_trial_closeout")
if [ "$C" = "200" ]; then echo "OK r_ctc"; P=$((P+1)); else echo "FAIL r_ctc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/res_body_3.json "$H/api/res_trial/adverse_event_reporting")
if [ "$C" = "200" ]; then echo "OK r_aer"; P=$((P+1)); else echo "FAIL r_aer ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/res_body_4.json "$H/api/res_trial/protocol_deviation")
if [ "$C" = "200" ]; then echo "OK r_pdv"; P=$((P+1)); else echo "FAIL r_pdv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/res_body_5.json "$H/api/res_pub/manuscript_submission")
if [ "$C" = "200" ]; then echo "OK r_msu"; P=$((P+1)); else echo "FAIL r_msu ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/res_body_6.json "$H/api/res_pub/peer_review_status")
if [ "$C" = "200" ]; then echo "OK r_prs"; P=$((P+1)); else echo "FAIL r_prs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/res_body_7.json "$H/api/res_pub/abstract_submission")
if [ "$C" = "200" ]; then echo "OK r_abs"; P=$((P+1)); else echo "FAIL r_abs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/res_body_8.json "$H/api/res_pub/poster_presentation")
if [ "$C" = "200" ]; then echo "OK r_pst"; P=$((P+1)); else echo "FAIL r_pst ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/res_body_9.json "$H/api/res_pub/author_contribution")
if [ "$C" = "200" ]; then echo "OK r_aco"; P=$((P+1)); else echo "FAIL r_aco ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/res_body_10.json "$H/api/res_grant/grant_submission")
if [ "$C" = "200" ]; then echo "OK r_gsu"; P=$((P+1)); else echo "FAIL r_gsu ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/res_body_11.json "$H/api/res_grant/grant_review_status")
if [ "$C" = "200" ]; then echo "OK r_grs"; P=$((P+1)); else echo "FAIL r_grs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/res_body_12.json "$H/api/res_grant/budget_justification")
if [ "$C" = "200" ]; then echo "OK r_bju"; P=$((P+1)); else echo "FAIL r_bju ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/res_body_13.json "$H/api/res_grant/progress_report_grant")
if [ "$C" = "200" ]; then echo "OK r_prg"; P=$((P+1)); else echo "FAIL r_prg ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/res_body_14.json "$H/api/res_grant/no_cost_extension")
if [ "$C" = "200" ]; then echo "OK r_nce"; P=$((P+1)); else echo "FAIL r_nce ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/res_body_15.json "$H/api/res_data/data_collection_form")
if [ "$C" = "200" ]; then echo "OK r_dcf"; P=$((P+1)); else echo "FAIL r_dcf ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/res_body_16.json "$H/api/res_data/data_quality_review")
if [ "$C" = "200" ]; then echo "OK r_dqr"; P=$((P+1)); else echo "FAIL r_dqr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/res_body_17.json "$H/api/res_data/interim_analysis")
if [ "$C" = "200" ]; then echo "OK r_ina"; P=$((P+1)); else echo "FAIL r_ina ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/res_body_18.json "$H/api/res_data/data_lock")
if [ "$C" = "200" ]; then echo "OK r_dlk"; P=$((P+1)); else echo "FAIL r_dlk ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/res_body_19.json "$H/api/res_data/database_lock")
if [ "$C" = "200" ]; then echo "OK r_dbl"; P=$((P+1)); else echo "FAIL r_dbl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/res_body_20.json "$H/api/res_ethics/irb_submission")
if [ "$C" = "200" ]; then echo "OK r_irb"; P=$((P+1)); else echo "FAIL r_irb ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/res_body_21.json "$H/api/res_ethics/irb_amendment")
if [ "$C" = "200" ]; then echo "OK r_ira"; P=$((P+1)); else echo "FAIL r_ira ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/res_body_22.json "$H/api/res_ethics/irb_continuing_review")
if [ "$C" = "200" ]; then echo "OK r_irc"; P=$((P+1)); else echo "FAIL r_irc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/res_body_23.json "$H/api/res_ethics/consent_form_revision")
if [ "$C" = "200" ]; then echo "OK r_cfr"; P=$((P+1)); else echo "FAIL r_cfr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/res_body_24.json "$H/api/res_ethics/subject_withdrawal")
if [ "$C" = "200" ]; then echo "OK r_swd"; P=$((P+1)); else echo "FAIL r_swd ($C)"; fi
echo PASS=$P FAIL=$F
