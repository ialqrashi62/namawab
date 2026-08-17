#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/him_body_0.json "$H/api/him_coding/code_icd10cm")
if [ "$C" = "200" ]; then echo "OK c_icd"; P=$((P+1)); else echo "FAIL c_icd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/him_body_1.json "$H/api/him_coding/code_cpt")
if [ "$C" = "200" ]; then echo "OK c_cpt"; P=$((P+1)); else echo "FAIL c_cpt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/him_body_2.json "$H/api/him_coding/code_drg")
if [ "$C" = "200" ]; then echo "OK c_drg"; P=$((P+1)); else echo "FAIL c_drg ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/him_body_3.json "$H/api/him_coding/code_hcc")
if [ "$C" = "200" ]; then echo "OK c_hcc"; P=$((P+1)); else echo "FAIL c_hcc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/him_body_4.json "$H/api/him_coding/code_query")
if [ "$C" = "200" ]; then echo "OK c_query"; P=$((P+1)); else echo "FAIL c_query ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/him_body_5.json "$H/api/him_roi/roi_authorization")
if [ "$C" = "200" ]; then echo "OK r_auth"; P=$((P+1)); else echo "FAIL r_auth ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/him_body_6.json "$H/api/him_roi/roi_verify_identity")
if [ "$C" = "200" ]; then echo "OK r_id"; P=$((P+1)); else echo "FAIL r_id ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/him_body_7.json "$H/api/him_roi/roi_request_log")
if [ "$C" = "200" ]; then echo "OK r_log"; P=$((P+1)); else echo "FAIL r_log ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/him_body_8.json "$H/api/him_roi/roi_third_party")
if [ "$C" = "200" ]; then echo "OK r_3p"; P=$((P+1)); else echo "FAIL r_3p ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/him_body_9.json "$H/api/him_roi/roi_audit")
if [ "$C" = "200" ]; then echo "OK r_aud"; P=$((P+1)); else echo "FAIL r_aud ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/him_body_10.json "$H/api/him_deficiency/deficiency_list")
if [ "$C" = "200" ]; then echo "OK d_list"; P=$((P+1)); else echo "FAIL d_list ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/him_body_11.json "$H/api/him_deficiency/deficiency_type")
if [ "$C" = "200" ]; then echo "OK d_type"; P=$((P+1)); else echo "FAIL d_type ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/him_body_12.json "$H/api/him_deficiency/deficiency_assignment")
if [ "$C" = "200" ]; then echo "OK d_asn"; P=$((P+1)); else echo "FAIL d_asn ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/him_body_13.json "$H/api/him_deficiency/deficiency_complete")
if [ "$C" = "200" ]; then echo "OK d_done"; P=$((P+1)); else echo "FAIL d_done ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/him_body_14.json "$H/api/him_deficiency/deficiency_metrics")
if [ "$C" = "200" ]; then echo "OK d_metric"; P=$((P+1)); else echo "FAIL d_metric ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/him_body_15.json "$H/api/him_audit/audit_concurrent")
if [ "$C" = "200" ]; then echo "OK a_conc"; P=$((P+1)); else echo "FAIL a_conc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/him_body_16.json "$H/api/him_audit/audit_scoring")
if [ "$C" = "200" ]; then echo "OK a_score"; P=$((P+1)); else echo "FAIL a_score ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/him_body_17.json "$H/api/him_audit/audit_focused")
if [ "$C" = "200" ]; then echo "OK a_foc"; P=$((P+1)); else echo "FAIL a_foc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/him_body_18.json "$H/api/him_audit/audit_trend")
if [ "$C" = "200" ]; then echo "OK a_trend"; P=$((P+1)); else echo "FAIL a_trend ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/him_body_19.json "$H/api/him_audit/audit_correction")
if [ "$C" = "200" ]; then echo "OK a_corr"; P=$((P+1)); else echo "FAIL a_corr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/him_body_20.json "$H/api/him_release/doc_release")
if [ "$C" = "200" ]; then echo "OK dr_rel"; P=$((P+1)); else echo "FAIL dr_rel ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/him_body_21.json "$H/api/him_release/doc_completeness")
if [ "$C" = "200" ]; then echo "OK dr_comp"; P=$((P+1)); else echo "FAIL dr_comp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/him_body_22.json "$H/api/him_release/doc_amendment")
if [ "$C" = "200" ]; then echo "OK dr_amend"; P=$((P+1)); else echo "FAIL dr_amend ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/him_body_23.json "$H/api/him_release/doc_cosign")
if [ "$C" = "200" ]; then echo "OK dr_cosign"; P=$((P+1)); else echo "FAIL dr_cosign ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/him_body_24.json "$H/api/him_release/doc_audit")
if [ "$C" = "200" ]; then echo "OK dr_aud"; P=$((P+1)); else echo "FAIL dr_aud ($C)"; fi
echo PASS=$P FAIL=$F
