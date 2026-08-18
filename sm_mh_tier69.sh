#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/mh_body_0.json "$H/api/mh_assess/mh_initial_intake")
if [ "$C" = "200" ]; then echo "OK m_mii"; P=$((P+1)); else echo "FAIL m_mii ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/mh_body_1.json "$H/api/mh_assess/mh_diagnostic_interview")
if [ "$C" = "200" ]; then echo "OK m_mdi"; P=$((P+1)); else echo "FAIL m_mdi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/mh_body_2.json "$H/api/mh_assess/mh_risk_screen")
if [ "$C" = "200" ]; then echo "OK m_mrs"; P=$((P+1)); else echo "FAIL m_mrs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/mh_body_3.json "$H/api/mh_assess/mh_safety_plan")
if [ "$C" = "200" ]; then echo "OK m_msp"; P=$((P+1)); else echo "FAIL m_msp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/mh_body_4.json "$H/api/mh_assess/mh_functional_assessment")
if [ "$C" = "200" ]; then echo "OK m_mfa"; P=$((P+1)); else echo "FAIL m_mfa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/mh_body_5.json "$H/api/mh_therapy/individual_therapy_progress")
if [ "$C" = "200" ]; then echo "OK m_itp"; P=$((P+1)); else echo "FAIL m_itp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/mh_body_6.json "$H/api/mh_therapy/group_therapy_session")
if [ "$C" = "200" ]; then echo "OK m_gts"; P=$((P+1)); else echo "FAIL m_gts ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/mh_body_7.json "$H/api/mh_therapy/family_therapy")
if [ "$C" = "200" ]; then echo "OK m_ft"; P=$((P+1)); else echo "FAIL m_ft ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/mh_body_8.json "$H/api/mh_therapy/floor_therapy")
if [ "$C" = "200" ]; then echo "OK m_fl"; P=$((P+1)); else echo "FAIL m_fl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/mh_body_9.json "$H/api/mh_therapy/tele_psych_followup")
if [ "$C" = "200" ]; then echo "OK m_tpf"; P=$((P+1)); else echo "FAIL m_tpf ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/mh_body_10.json "$H/api/mh_psychopharm/psychopharm_initial")
if [ "$C" = "200" ]; then echo "OK m_pi"; P=$((P+1)); else echo "FAIL m_pi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/mh_body_11.json "$H/api/mh_psychopharm/psychopharm_followup")
if [ "$C" = "200" ]; then echo "OK m_pf"; P=$((P+1)); else echo "FAIL m_pf ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/mh_body_12.json "$H/api/mh_psychopharm/side_effect_monitor")
if [ "$C" = "200" ]; then echo "OK m_sem"; P=$((P+1)); else echo "FAIL m_sem ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/mh_body_13.json "$H/api/mh_psychopharm/med_adherence_counsel")
if [ "$C" = "200" ]; then echo "OK m_mac"; P=$((P+1)); else echo "FAIL m_mac ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/mh_body_14.json "$H/api/mh_psychopharm/clozapine_clozaril")
if [ "$C" = "200" ]; then echo "OK m_clz"; P=$((P+1)); else echo "FAIL m_clz ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/mh_body_15.json "$H/api/mh_addiction/subuse_intake")
if [ "$C" = "200" ]; then echo "OK m_sui"; P=$((P+1)); else echo "FAIL m_sui ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/mh_body_16.json "$H/api/mh_addiction/relapse_prevention")
if [ "$C" = "200" ]; then echo "OK m_rp"; P=$((P+1)); else echo "FAIL m_rp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/mh_body_17.json "$H/api/mh_addiction/methadone_clinic")
if [ "$C" = "200" ]; then echo "OK m_mc"; P=$((P+1)); else echo "FAIL m_mc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/mh_body_18.json "$H/api/mh_addiction/naloxone_kits")
if [ "$C" = "200" ]; then echo "OK m_nk"; P=$((P+1)); else echo "FAIL m_nk ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/mh_body_19.json "$H/api/mh_addiction/sbar_counseling")
if [ "$C" = "200" ]; then echo "OK m_sbc"; P=$((P+1)); else echo "FAIL m_sbc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/mh_body_20.json "$H/api/mh_community/case_management")
if [ "$C" = "200" ]; then echo "OK m_cm"; P=$((P+1)); else echo "FAIL m_cm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/mh_body_21.json "$H/api/mh_community/peer_support")
if [ "$C" = "200" ]; then echo "OK m_ps"; P=$((P+1)); else echo "FAIL m_ps ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/mh_body_22.json "$H/api/mh_community/community_resources_wraparound")
if [ "$C" = "200" ]; then echo "OK m_crw"; P=$((P+1)); else echo "FAIL m_crw ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/mh_body_23.json "$H/api/mh_community/supported_employment")
if [ "$C" = "200" ]; then echo "OK m_se"; P=$((P+1)); else echo "FAIL m_se ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/mh_body_24.json "$H/api/mh_community/school_link")
if [ "$C" = "200" ]; then echo "OK m_sl"; P=$((P+1)); else echo "FAIL m_sl ($C)"; fi
echo PASS=$P FAIL=$F
