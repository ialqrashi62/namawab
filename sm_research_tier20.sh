#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/research_body_0.json "$H/api/research_trial/trial_enrollment")
if [ "$C" = "200" ]; then echo "OK t_enroll"; P=$((P+1)); else echo "FAIL t_enroll ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/research_body_1.json "$H/api/research_trial/trial_eligibility")
if [ "$C" = "200" ]; then echo "OK t_elig"; P=$((P+1)); else echo "FAIL t_elig ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/research_body_2.json "$H/api/research_trial/trial_adverse")
if [ "$C" = "200" ]; then echo "OK t_ae"; P=$((P+1)); else echo "FAIL t_ae ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/research_body_3.json "$H/api/research_trial/trial_protocol_deviation")
if [ "$C" = "200" ]; then echo "OK t_dev"; P=$((P+1)); else echo "FAIL t_dev ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/research_body_4.json "$H/api/research_trial/trial_closeout")
if [ "$C" = "200" ]; then echo "OK t_close"; P=$((P+1)); else echo "FAIL t_close ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/research_body_5.json "$H/api/research_consent/consent_obtain")
if [ "$C" = "200" ]; then echo "OK c_obt"; P=$((P+1)); else echo "FAIL c_obt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/research_body_6.json "$H/api/research_consent/consent_amend")
if [ "$C" = "200" ]; then echo "OK c_amd"; P=$((P+1)); else echo "FAIL c_amd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/research_body_7.json "$H/api/research_consent/consent_withdrawal")
if [ "$C" = "200" ]; then echo "OK c_wd"; P=$((P+1)); else echo "FAIL c_wd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/research_body_8.json "$H/api/research_consent/consent_minor")
if [ "$C" = "200" ]; then echo "OK c_minor"; P=$((P+1)); else echo "FAIL c_minor ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/research_body_9.json "$H/api/research_consent/consent_capacity")
if [ "$C" = "200" ]; then echo "OK c_cap"; P=$((P+1)); else echo "FAIL c_cap ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/research_body_10.json "$H/api/research_irb/irb_submission")
if [ "$C" = "200" ]; then echo "OK i_sub"; P=$((P+1)); else echo "FAIL i_sub ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/research_body_11.json "$H/api/research_irb/irb_continuing_review")
if [ "$C" = "200" ]; then echo "OK i_cr"; P=$((P+1)); else echo "FAIL i_cr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/research_body_12.json "$H/api/research_irb/irb_adverse_report")
if [ "$C" = "200" ]; then echo "OK i_ar"; P=$((P+1)); else echo "FAIL i_ar ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/research_body_13.json "$H/api/research_irb/irb_review_quorum")
if [ "$C" = "200" ]; then echo "OK i_quo"; P=$((P+1)); else echo "FAIL i_quo ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/research_body_14.json "$H/api/research_irb/irb_decision")
if [ "$C" = "200" ]; then echo "OK i_dec"; P=$((P+1)); else echo "FAIL i_dec ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/research_body_15.json "$H/api/research_recruitment/recruit_screening")
if [ "$C" = "200" ]; then echo "OK r_scr"; P=$((P+1)); else echo "FAIL r_scr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/research_body_16.json "$H/api/research_recruitment/recruit_eligibility_check")
if [ "$C" = "200" ]; then echo "OK r_ec"; P=$((P+1)); else echo "FAIL r_ec ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/research_body_17.json "$H/api/research_recruitment/recruit_consent_screen")
if [ "$C" = "200" ]; then echo "OK r_cs"; P=$((P+1)); else echo "FAIL r_cs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/research_body_18.json "$H/api/research_recruitment/recruit_database_match")
if [ "$C" = "200" ]; then echo "OK r_db"; P=$((P+1)); else echo "FAIL r_db ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/research_body_19.json "$H/api/research_recruitment/recruit_metrics")
if [ "$C" = "200" ]; then echo "OK r_met"; P=$((P+1)); else echo "FAIL r_met ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/research_body_20.json "$H/api/research_biobank/sample_collection")
if [ "$C" = "200" ]; then echo "OK s_coll"; P=$((P+1)); else echo "FAIL s_coll ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/research_body_21.json "$H/api/research_biobank/sample_storage")
if [ "$C" = "200" ]; then echo "OK s_store"; P=$((P+1)); else echo "FAIL s_store ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/research_body_22.json "$H/api/research_biobank/sample_quality")
if [ "$C" = "200" ]; then echo "OK s_qual"; P=$((P+1)); else echo "FAIL s_qual ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/research_body_23.json "$H/api/research_biobank/sample_chain_of_custody")
if [ "$C" = "200" ]; then echo "OK s_coc"; P=$((P+1)); else echo "FAIL s_coc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/research_body_24.json "$H/api/research_biobank/sample_disposal")
if [ "$C" = "200" ]; then echo "OK s_disp"; P=$((P+1)); else echo "FAIL s_disp ($C)"; fi
echo PASS=$P FAIL=$F
