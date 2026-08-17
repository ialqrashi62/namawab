#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/portal_body_0.json "$H/api/portal_auth/portal_register")
if [ "$C" = "200" ]; then echo "OK a_reg"; P=$((P+1)); else echo "FAIL a_reg ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/portal_body_1.json "$H/api/portal_auth/portal_login")
if [ "$C" = "200" ]; then echo "OK a_login"; P=$((P+1)); else echo "FAIL a_login ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/portal_body_2.json "$H/api/portal_auth/portal_session")
if [ "$C" = "200" ]; then echo "OK a_sess"; P=$((P+1)); else echo "FAIL a_sess ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/portal_body_3.json "$H/api/portal_auth/portal_password_reset")
if [ "$C" = "200" ]; then echo "OK a_reset"; P=$((P+1)); else echo "FAIL a_reset ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/portal_body_4.json "$H/api/portal_auth/portal_audit")
if [ "$C" = "200" ]; then echo "OK a_audit"; P=$((P+1)); else echo "FAIL a_audit ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/portal_body_5.json "$H/api/portal_records/portal_lab_results")
if [ "$C" = "200" ]; then echo "OK r_lab"; P=$((P+1)); else echo "FAIL r_lab ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/portal_body_6.json "$H/api/portal_records/portal_radiology")
if [ "$C" = "200" ]; then echo "OK r_rad"; P=$((P+1)); else echo "FAIL r_rad ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/portal_body_7.json "$H/api/portal_records/portal_visit_summary")
if [ "$C" = "200" ]; then echo "OK r_visit"; P=$((P+1)); else echo "FAIL r_visit ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/portal_body_8.json "$H/api/portal_records/portal_medications")
if [ "$C" = "200" ]; then echo "OK r_med"; P=$((P+1)); else echo "FAIL r_med ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/portal_body_9.json "$H/api/portal_records/portal_immunization")
if [ "$C" = "200" ]; then echo "OK r_imz"; P=$((P+1)); else echo "FAIL r_imz ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/portal_body_10.json "$H/api/portal_appointments/portal_book_appt")
if [ "$C" = "200" ]; then echo "OK ap_book"; P=$((P+1)); else echo "FAIL ap_book ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/portal_body_11.json "$H/api/portal_appointments/portal_reschedule")
if [ "$C" = "200" ]; then echo "OK ap_re"; P=$((P+1)); else echo "FAIL ap_re ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/portal_body_12.json "$H/api/portal_appointments/portal_cancel")
if [ "$C" = "200" ]; then echo "OK ap_cxl"; P=$((P+1)); else echo "FAIL ap_cxl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/portal_body_13.json "$H/api/portal_appointments/portal_checkin")
if [ "$C" = "200" ]; then echo "OK ap_chk"; P=$((P+1)); else echo "FAIL ap_chk ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/portal_body_14.json "$H/api/portal_appointments/portal_telehealth")
if [ "$C" = "200" ]; then echo "OK ap_tele"; P=$((P+1)); else echo "FAIL ap_tele ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/portal_body_15.json "$H/api/portal_billing/portal_view_balance")
if [ "$C" = "200" ]; then echo "OK b_bal"; P=$((P+1)); else echo "FAIL b_bal ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/portal_body_16.json "$H/api/portal_billing/portal_payment")
if [ "$C" = "200" ]; then echo "OK b_pay"; P=$((P+1)); else echo "FAIL b_pay ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/portal_body_17.json "$H/api/portal_billing/portal_payment_plan")
if [ "$C" = "200" ]; then echo "OK b_plan"; P=$((P+1)); else echo "FAIL b_plan ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/portal_body_18.json "$H/api/portal_billing/portal_statement")
if [ "$C" = "200" ]; then echo "OK b_stmt"; P=$((P+1)); else echo "FAIL b_stmt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/portal_body_19.json "$H/api/portal_billing/portal_dispute")
if [ "$C" = "200" ]; then echo "OK b_disp"; P=$((P+1)); else echo "FAIL b_disp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/portal_body_20.json "$H/api/portal_messaging/portal_message")
if [ "$C" = "200" ]; then echo "OK m_msg"; P=$((P+1)); else echo "FAIL m_msg ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/portal_body_21.json "$H/api/portal_messaging/portal_refill_request")
if [ "$C" = "200" ]; then echo "OK m_rx"; P=$((P+1)); else echo "FAIL m_rx ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/portal_body_22.json "$H/api/portal_messaging/portal_referral_request")
if [ "$C" = "200" ]; then echo "OK m_ref"; P=$((P+1)); else echo "FAIL m_ref ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/portal_body_23.json "$H/api/portal_messaging/portal_proxy_access")
if [ "$C" = "200" ]; then echo "OK m_prx"; P=$((P+1)); else echo "FAIL m_prx ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/portal_body_24.json "$H/api/portal_messaging/portal_consent")
if [ "$C" = "200" ]; then echo "OK m_cons"; P=$((P+1)); else echo "FAIL m_cons ($C)"; fi
echo PASS=$P FAIL=$F
