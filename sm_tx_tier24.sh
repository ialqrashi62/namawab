#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tx_body_0.json "$H/api/tx_candidate/candidate_eligibility")
if [ "$C" = "200" ]; then echo "OK c_elg"; P=$((P+1)); else echo "FAIL c_elg ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tx_body_1.json "$H/api/tx_candidate/candidate_workup")
if [ "$C" = "200" ]; then echo "OK c_wu"; P=$((P+1)); else echo "FAIL c_wu ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tx_body_2.json "$H/api/tx_candidate/crossmatch")
if [ "$C" = "200" ]; then echo "OK c_cm"; P=$((P+1)); else echo "FAIL c_cm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tx_body_3.json "$H/api/tx_candidate/pra")
if [ "$C" = "200" ]; then echo "OK c_pra"; P=$((P+1)); else echo "FAIL c_pra ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tx_body_4.json "$H/api/tx_candidate/waiting_list")
if [ "$C" = "200" ]; then echo "OK c_wl"; P=$((P+1)); else echo "FAIL c_wl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tx_body_5.json "$H/api/tx_donor/donor_type")
if [ "$C" = "200" ]; then echo "OK d_typ"; P=$((P+1)); else echo "FAIL d_typ ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tx_body_6.json "$H/api/tx_donor/donor_screening")
if [ "$C" = "200" ]; then echo "OK d_scr"; P=$((P+1)); else echo "FAIL d_scr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tx_body_7.json "$H/api/tx_donor/allocation")
if [ "$C" = "200" ]; then echo "OK d_alc"; P=$((P+1)); else echo "FAIL d_alc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tx_body_8.json "$H/api/tx_donor/preservation")
if [ "$C" = "200" ]; then echo "OK d_pre"; P=$((P+1)); else echo "FAIL d_pre ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tx_body_9.json "$H/api/tx_donor/procurement")
if [ "$C" = "200" ]; then echo "OK d_pro"; P=$((P+1)); else echo "FAIL d_pro ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tx_body_10.json "$H/api/tx_immuno/induction")
if [ "$C" = "200" ]; then echo "OK i_ind"; P=$((P+1)); else echo "FAIL i_ind ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tx_body_11.json "$H/api/tx_immuno/maintenance")
if [ "$C" = "200" ]; then echo "OK i_mnt"; P=$((P+1)); else echo "FAIL i_mnt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tx_body_12.json "$H/api/tx_immuno/rejection")
if [ "$C" = "200" ]; then echo "OK i_rej"; P=$((P+1)); else echo "FAIL i_rej ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tx_body_13.json "$H/api/tx_immuno/drug_level")
if [ "$C" = "200" ]; then echo "OK i_drg"; P=$((P+1)); else echo "FAIL i_drg ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tx_body_14.json "$H/api/tx_immuno/prophylaxis")
if [ "$C" = "200" ]; then echo "OK i_pro"; P=$((P+1)); else echo "FAIL i_pro ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tx_body_15.json "$H/api/tx_outcome/graft_function")
if [ "$C" = "200" ]; then echo "OK o_gft"; P=$((P+1)); else echo "FAIL o_gft ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tx_body_16.json "$H/api/tx_outcome/infection_post")
if [ "$C" = "200" ]; then echo "OK o_inf"; P=$((P+1)); else echo "FAIL o_inf ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tx_body_17.json "$H/api/tx_outcome/malignancy_post")
if [ "$C" = "200" ]; then echo "OK o_mal"; P=$((P+1)); else echo "FAIL o_mal ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tx_body_18.json "$H/api/tx_outcome/cv_complication")
if [ "$C" = "200" ]; then echo "OK o_cv"; P=$((P+1)); else echo "FAIL o_cv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tx_body_19.json "$H/api/tx_outcome/renal_function")
if [ "$C" = "200" ]; then echo "OK o_ren"; P=$((P+1)); else echo "FAIL o_ren ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tx_body_20.json "$H/api/tx_followup/surveillance")
if [ "$C" = "200" ]; then echo "OK f_sur"; P=$((P+1)); else echo "FAIL f_sur ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tx_body_21.json "$H/api/tx_followup/return_to_or")
if [ "$C" = "200" ]; then echo "OK f_rto"; P=$((P+1)); else echo "FAIL f_rto ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tx_body_22.json "$H/api/tx_followup/retransplant")
if [ "$C" = "200" ]; then echo "OK f_ret"; P=$((P+1)); else echo "FAIL f_ret ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tx_body_23.json "$H/api/tx_followup/life_quality")
if [ "$C" = "200" ]; then echo "OK f_lq"; P=$((P+1)); else echo "FAIL f_lq ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/tx_body_24.json "$H/api/tx_followup/transition_care")
if [ "$C" = "200" ]; then echo "OK f_tc"; P=$((P+1)); else echo "FAIL f_tc ($C)"; fi
echo PASS=$P FAIL=$F
