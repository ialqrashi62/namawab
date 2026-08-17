#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_0.json "$H/api/sched_provider/provider_availability")
if [ "$C" = "200" ]; then echo "OK p_avail"; P=$((P+1)); else echo "FAIL p_avail ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_1.json "$H/api/sched_provider/provider_preference")
if [ "$C" = "200" ]; then echo "OK p_pref"; P=$((P+1)); else echo "FAIL p_pref ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_2.json "$H/api/sched_provider/provider_timeoff")
if [ "$C" = "200" ]; then echo "OK p_to"; P=$((P+1)); else echo "FAIL p_to ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_3.json "$H/api/sched_provider/provider_panel")
if [ "$C" = "200" ]; then echo "OK p_panel"; P=$((P+1)); else echo "FAIL p_panel ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_4.json "$H/api/sched_provider/provider_credential")
if [ "$C" = "200" ]; then echo "OK p_cred"; P=$((P+1)); else echo "FAIL p_cred ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_5.json "$H/api/sched_call/call_assign")
if [ "$C" = "200" ]; then echo "OK c_asn"; P=$((P+1)); else echo "FAIL c_asn ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_6.json "$H/api/sched_call/call_coverage")
if [ "$C" = "200" ]; then echo "OK c_cov"; P=$((P+1)); else echo "FAIL c_cov ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_7.json "$H/api/sched_call/call_swap")
if [ "$C" = "200" ]; then echo "OK c_swap"; P=$((P+1)); else echo "FAIL c_swap ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_8.json "$H/api/sched_call/call_locums")
if [ "$C" = "200" ]; then echo "OK c_loc"; P=$((P+1)); else echo "FAIL c_loc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_9.json "$H/api/sched_call/call_pay")
if [ "$C" = "200" ]; then echo "OK c_pay"; P=$((P+1)); else echo "FAIL c_pay ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_10.json "$H/api/sched_template/template_create")
if [ "$C" = "200" ]; then echo "OK t_cre"; P=$((P+1)); else echo "FAIL t_cre ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_11.json "$H/api/sched_template/template_apply")
if [ "$C" = "200" ]; then echo "OK t_app"; P=$((P+1)); else echo "FAIL t_app ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_12.json "$H/api/sched_template/template_block")
if [ "$C" = "200" ]; then echo "OK t_blk"; P=$((P+1)); else echo "FAIL t_blk ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_13.json "$H/api/sched_template/template_override")
if [ "$C" = "200" ]; then echo "OK t_ovr"; P=$((P+1)); else echo "FAIL t_ovr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_14.json "$H/api/sched_template/template_metrics")
if [ "$C" = "200" ]; then echo "OK t_met"; P=$((P+1)); else echo "FAIL t_met ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_15.json "$H/api/sched_waitlist/waitlist_add")
if [ "$C" = "200" ]; then echo "OK w_add"; P=$((P+1)); else echo "FAIL w_add ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_16.json "$H/api/sched_waitlist/waitlist_match")
if [ "$C" = "200" ]; then echo "OK w_mat"; P=$((P+1)); else echo "FAIL w_mat ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_17.json "$H/api/sched_waitlist/waitlist_purge")
if [ "$C" = "200" ]; then echo "OK w_pur"; P=$((P+1)); else echo "FAIL w_pur ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_18.json "$H/api/sched_waitlist/noshow_track")
if [ "$C" = "200" ]; then echo "OK w_ns"; P=$((P+1)); else echo "FAIL w_ns ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_19.json "$H/api/sched_waitlist/patient_access")
if [ "$C" = "200" ]; then echo "OK w_acc"; P=$((P+1)); else echo "FAIL w_acc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_20.json "$H/api/sched_appointment/appt_book")
if [ "$C" = "200" ]; then echo "OK a_book"; P=$((P+1)); else echo "FAIL a_book ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_21.json "$H/api/sched_appointment/appt_conflict")
if [ "$C" = "200" ]; then echo "OK a_con"; P=$((P+1)); else echo "FAIL a_con ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_22.json "$H/api/sched_appointment/appt_reschedule")
if [ "$C" = "200" ]; then echo "OK a_re"; P=$((P+1)); else echo "FAIL a_re ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_23.json "$H/api/sched_appointment/appt_cancel")
if [ "$C" = "200" ]; then echo "OK a_can"; P=$((P+1)); else echo "FAIL a_can ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_24.json "$H/api/sched_appointment/appt_slot_optimize")
if [ "$C" = "200" ]; then echo "OK a_opt"; P=$((P+1)); else echo "FAIL a_opt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_25.json "$H/api/sched_staff/staff_assign_shift")
if [ "$C" = "200" ]; then echo "OK s_asn"; P=$((P+1)); else echo "FAIL s_asn ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_26.json "$H/api/sched_staff/staff_coverage")
if [ "$C" = "200" ]; then echo "OK s_cov"; P=$((P+1)); else echo "FAIL s_cov ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_27.json "$H/api/sched_staff/staff_request")
if [ "$C" = "200" ]; then echo "OK s_req"; P=$((P+1)); else echo "FAIL s_req ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_28.json "$H/api/sched_staff/staff_overtime")
if [ "$C" = "200" ]; then echo "OK s_ot"; P=$((P+1)); else echo "FAIL s_ot ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sched_body_29.json "$H/api/sched_staff/staff_competency")
if [ "$C" = "200" ]; then echo "OK s_comp"; P=$((P+1)); else echo "FAIL s_comp ($C)"; fi
echo PASS=$P FAIL=$F
