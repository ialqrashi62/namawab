#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tel_body_0.json "$H/api/tele_visit/tele_consult_initial")
if [ "$C" = "200" ]; then echo "OK t_tci"; P=$((P+1)); else echo "FAIL t_tci ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tel_body_1.json "$H/api/tele_visit/tele_consult_followup")
if [ "$C" = "200" ]; then echo "OK t_tcf"; P=$((P+1)); else echo "FAIL t_tcf ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tel_body_2.json "$H/api/tele_visit/tele_urgent_consult")
if [ "$C" = "200" ]; then echo "OK t_tcu"; P=$((P+1)); else echo "FAIL t_tcu ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tel_body_3.json "$H/api/tele_visit/tele_specialist_referral")
if [ "$C" = "200" ]; then echo "OK t_tsr"; P=$((P+1)); else echo "FAIL t_tsr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tel_body_4.json "$H/api/tele_visit/tele_multidisciplinary")
if [ "$C" = "200" ]; then echo "OK t_tmd"; P=$((P+1)); else echo "FAIL t_tmd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tel_body_5.json "$H/api/tele_monitor/remote_patient_monitoring")
if [ "$C" = "200" ]; then echo "OK t_rpm"; P=$((P+1)); else echo "FAIL t_rpm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tel_body_6.json "$H/api/tele_monitor/tele_vitals_tracking")
if [ "$C" = "200" ]; then echo "OK t_tvt"; P=$((P+1)); else echo "FAIL t_tvt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tel_body_7.json "$H/api/tele_monitor/wearable_data_review")
if [ "$C" = "200" ]; then echo "OK t_wdr"; P=$((P+1)); else echo "FAIL t_wdr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tel_body_8.json "$H/api/tele_monitor/chronic_disease_tele")
if [ "$C" = "200" ]; then echo "OK t_cdt"; P=$((P+1)); else echo "FAIL t_cdt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tel_body_9.json "$H/api/tele_monitor/tele_alert_response")
if [ "$C" = "200" ]; then echo "OK t_tar"; P=$((P+1)); else echo "FAIL t_tar ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tel_body_10.json "$H/api/tele_surg/tele_surgical_consult")
if [ "$C" = "200" ]; then echo "OK t_tsc"; P=$((P+1)); else echo "FAIL t_tsc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tel_body_11.json "$H/api/tele_surg/remote_surgical_mentoring")
if [ "$C" = "200" ]; then echo "OK t_rsm"; P=$((P+1)); else echo "FAIL t_rsm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tel_body_12.json "$H/api/tele_surg/tele_pre_op_assessment")
if [ "$C" = "200" ]; then echo "OK t_tpo"; P=$((P+1)); else echo "FAIL t_tpo ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tel_body_13.json "$H/api/tele_surg/tele_post_op_followup")
if [ "$C" = "200" ]; then echo "OK t_tfol"; P=$((P+1)); else echo "FAIL t_tfol ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tel_body_14.json "$H/api/tele_surg/tele_pathology_review")
if [ "$C" = "200" ]; then echo "OK t_tpr"; P=$((P+1)); else echo "FAIL t_tpr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tel_body_15.json "$H/api/tele_psy/tele_psychiatry_visit")
if [ "$C" = "200" ]; then echo "OK t_tpv"; P=$((P+1)); else echo "FAIL t_tpv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tel_body_16.json "$H/api/tele_psy/tele_psychotherapy")
if [ "$C" = "200" ]; then echo "OK t_tpt"; P=$((P+1)); else echo "FAIL t_tpt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tel_body_17.json "$H/api/tele_psy/tele_group_therapy")
if [ "$C" = "200" ]; then echo "OK t_tgt"; P=$((P+1)); else echo "FAIL t_tgt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tel_body_18.json "$H/api/tele_psy/tele_crisis_intervention")
if [ "$C" = "200" ]; then echo "OK t_tci"; P=$((P+1)); else echo "FAIL t_tci ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tel_body_19.json "$H/api/tele_psy/tele_substance_counseling")
if [ "$C" = "200" ]; then echo "OK t_tsc"; P=$((P+1)); else echo "FAIL t_tsc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tel_body_20.json "$H/api/tele_admin/tele_consent_obtained")
if [ "$C" = "200" ]; then echo "OK t_tco"; P=$((P+1)); else echo "FAIL t_tco ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tel_body_21.json "$H/api/tele_admin/platform_audit_log")
if [ "$C" = "200" ]; then echo "OK t_pal"; P=$((P+1)); else echo "FAIL t_pal ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tel_body_22.json "$H/api/tele_admin/encounter_documentation_tele")
if [ "$C" = "200" ]; then echo "OK t_edt"; P=$((P+1)); else echo "FAIL t_edt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tel_body_23.json "$H/api/tele_admin/billing_tele_visit")
if [ "$C" = "200" ]; then echo "OK t_btv"; P=$((P+1)); else echo "FAIL t_btv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tel_body_24.json "$H/api/tele_admin/patient_satisfaction_tele")
if [ "$C" = "200" ]; then echo "OK t_pst"; P=$((P+1)); else echo "FAIL t_pst ($C)"; fi
echo PASS=$P FAIL=$F
