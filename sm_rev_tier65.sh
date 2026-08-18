#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rev_body_0.json "$H/api/rev_charge/charge_capture")
if [ "$C" = "200" ]; then echo "OK r_cc"; P=$((P+1)); else echo "FAIL r_cc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rev_body_1.json "$H/api/rev_charge/charge_audit")
if [ "$C" = "200" ]; then echo "OK r_ca"; P=$((P+1)); else echo "FAIL r_ca ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rev_body_2.json "$H/api/rev_charge/charge_dashboard")
if [ "$C" = "200" ]; then echo "OK r_cd"; P=$((P+1)); else echo "FAIL r_cd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rev_body_3.json "$H/api/rev_charge/charge_appeal")
if [ "$C" = "200" ]; then echo "OK r_cap"; P=$((P+1)); else echo "FAIL r_cap ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rev_body_4.json "$H/api/rev_charge/charge_reconciliation")
if [ "$C" = "200" ]; then echo "OK r_cr"; P=$((P+1)); else echo "FAIL r_cr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rev_body_5.json "$H/api/rev_claim/claim_creation")
if [ "$C" = "200" ]; then echo "OK r_crt"; P=$((P+1)); else echo "FAIL r_crt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rev_body_6.json "$H/api/rev_claim/claim_scrubbing")
if [ "$C" = "200" ]; then echo "OK r_cs"; P=$((P+1)); else echo "FAIL r_cs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rev_body_7.json "$H/api/rev_claim/claim_submission")
if [ "$C" = "200" ]; then echo "OK r_csu"; P=$((P+1)); else echo "FAIL r_csu ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rev_body_8.json "$H/api/rev_claim/claim_status")
if [ "$C" = "200" ]; then echo "OK r_cst"; P=$((P+1)); else echo "FAIL r_cst ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rev_body_9.json "$H/api/rev_claim/claim_resubmission")
if [ "$C" = "200" ]; then echo "OK r_crs"; P=$((P+1)); else echo "FAIL r_crs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rev_body_10.json "$H/api/rev_payment/payment_posting")
if [ "$C" = "200" ]; then echo "OK r_pp"; P=$((P+1)); else echo "FAIL r_pp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rev_body_11.json "$H/api/rev_payment/denial_mgmt")
if [ "$C" = "200" ]; then echo "OK r_dm"; P=$((P+1)); else echo "FAIL r_dm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rev_body_12.json "$H/api/rev_payment/patient_pay")
if [ "$C" = "200" ]; then echo "OK r_ppy"; P=$((P+1)); else echo "FAIL r_ppy ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rev_body_13.json "$H/api/rev_payment/refund_processing")
if [ "$C" = "200" ]; then echo "OK r_rp"; P=$((P+1)); else echo "FAIL r_rp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rev_body_14.json "$H/api/rev_payment/underpayment_recovery")
if [ "$C" = "200" ]; then echo "OK r_ur"; P=$((P+1)); else echo "FAIL r_ur ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rev_body_15.json "$H/api/rev_audit/coding_audit")
if [ "$C" = "200" ]; then echo "OK r_coa"; P=$((P+1)); else echo "FAIL r_coa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rev_body_16.json "$H/api/rev_audit/clinical_audit")
if [ "$C" = "200" ]; then echo "OK r_cla"; P=$((P+1)); else echo "FAIL r_cla ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rev_body_17.json "$H/api/rev_audit/compliance_audit")
if [ "$C" = "200" ]; then echo "OK r_cma"; P=$((P+1)); else echo "FAIL r_cma ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rev_body_18.json "$H/api/rev_audit/pre_bill_audit")
if [ "$C" = "200" ]; then echo "OK r_pba"; P=$((P+1)); else echo "FAIL r_pba ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rev_body_19.json "$H/api/rev_audit/post_bill_audit")
if [ "$C" = "200" ]; then echo "OK r_poa"; P=$((P+1)); else echo "FAIL r_poa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rev_body_20.json "$H/api/rev_contract/payer_contract_load")
if [ "$C" = "200" ]; then echo "OK r_pcl"; P=$((P+1)); else echo "FAIL r_pcl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rev_body_21.json "$H/api/rev_contract/contract_model")
if [ "$C" = "200" ]; then echo "OK r_cm"; P=$((P+1)); else echo "FAIL r_cm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rev_body_22.json "$H/api/rev_contract/contract_variance")
if [ "$C" = "200" ]; then echo "OK r_cv"; P=$((P+1)); else echo "FAIL r_cv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rev_body_23.json "$H/api/rev_contract/fee_schedule")
if [ "$C" = "200" ]; then echo "OK r_fs"; P=$((P+1)); else echo "FAIL r_fs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rev_body_24.json "$H/api/rev_contract/allowed_amount")
if [ "$C" = "200" ]; then echo "OK r_aa"; P=$((P+1)); else echo "FAIL r_aa ($C)"; fi
echo PASS=$P FAIL=$F
