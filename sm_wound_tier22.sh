#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/wound_body_0.json "$H/api/wound_assessment/wound_assess_type")
if [ "$C" = "200" ]; then echo "OK w_at"; P=$((P+1)); else echo "FAIL w_at ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/wound_body_1.json "$H/api/wound_assessment/wound_pain")
if [ "$C" = "200" ]; then echo "OK w_pain"; P=$((P+1)); else echo "FAIL w_pain ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/wound_body_2.json "$H/api/wound_assessment/wound_vascular")
if [ "$C" = "200" ]; then echo "OK w_vasc"; P=$((P+1)); else echo "FAIL w_vasc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/wound_body_3.json "$H/api/wound_assessment/wound_infection")
if [ "$C" = "200" ]; then echo "OK w_inf"; P=$((P+1)); else echo "FAIL w_inf ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/wound_body_4.json "$H/api/wound_assessment/wound_nutritional")
if [ "$C" = "200" ]; then echo "OK w_nutr"; P=$((P+1)); else echo "FAIL w_nutr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/wound_body_5.json "$H/api/wound_dressing/dressing_select")
if [ "$C" = "200" ]; then echo "OK d_sel"; P=$((P+1)); else echo "FAIL d_sel ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/wound_body_6.json "$H/api/wound_dressing/dressing_change")
if [ "$C" = "200" ]; then echo "OK d_chg"; P=$((P+1)); else echo "FAIL d_chg ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/wound_body_7.json "$H/api/wound_dressing/dressing_npwt")
if [ "$C" = "200" ]; then echo "OK d_npwt"; P=$((P+1)); else echo "FAIL d_npwt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/wound_body_8.json "$H/api/wound_dressing/dressing_compression")
if [ "$C" = "200" ]; then echo "OK d_comp"; P=$((P+1)); else echo "FAIL d_comp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/wound_body_9.json "$H/api/wound_dressing/dressing_assess")
if [ "$C" = "200" ]; then echo "OK d_ass"; P=$((P+1)); else echo "FAIL d_ass ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/wound_body_10.json "$H/api/wound_healing/wound_healing_trajectory")
if [ "$C" = "200" ]; then echo "OK h_trj"; P=$((P+1)); else echo "FAIL h_trj ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/wound_body_11.json "$H/api/wound_healing/wound_healing_target")
if [ "$C" = "200" ]; then echo "OK h_tgt"; P=$((P+1)); else echo "FAIL h_tgt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/wound_body_12.json "$H/api/wound_healing/wound_healing_failure")
if [ "$C" = "200" ]; then echo "OK h_fail"; P=$((P+1)); else echo "FAIL h_fail ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/wound_body_13.json "$H/api/wound_healing/wound_recurrence")
if [ "$C" = "200" ]; then echo "OK h_rec"; P=$((P+1)); else echo "FAIL h_rec ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/wound_body_14.json "$H/api/wound_healing/wound_lifestyle")
if [ "$C" = "200" ]; then echo "OK h_life"; P=$((P+1)); else echo "FAIL h_life ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/wound_body_15.json "$H/api/wound_measurement/wound_measure")
if [ "$C" = "200" ]; then echo "OK m_mea"; P=$((P+1)); else echo "FAIL m_mea ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/wound_body_16.json "$H/api/wound_measurement/wound_area_change")
if [ "$C" = "200" ]; then echo "OK m_chg"; P=$((P+1)); else echo "FAIL m_chg ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/wound_body_17.json "$H/api/wound_measurement/wound_tunnel")
if [ "$C" = "200" ]; then echo "OK m_tun"; P=$((P+1)); else echo "FAIL m_tun ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/wound_body_18.json "$H/api/wound_measurement/wound_granulation")
if [ "$C" = "200" ]; then echo "OK m_gran"; P=$((P+1)); else echo "FAIL m_gran ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/wound_body_19.json "$H/api/wound_measurement/wound_exudate")
if [ "$C" = "200" ]; then echo "OK m_exu"; P=$((P+1)); else echo "FAIL m_exu ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/wound_body_20.json "$H/api/wound_staging/wound_pressure_stage")
if [ "$C" = "200" ]; then echo "OK s_pst"; P=$((P+1)); else echo "FAIL s_pst ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/wound_body_21.json "$H/api/wound_staging/wound_wagner")
if [ "$C" = "200" ]; then echo "OK s_wag"; P=$((P+1)); else echo "FAIL s_wag ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/wound_body_22.json "$H/api/wound_staging/wound_texas")
if [ "$C" = "200" ]; then echo "OK s_tex"; P=$((P+1)); else echo "FAIL s_tex ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/wound_body_23.json "$H/api/wound_staging/wound_burn")
if [ "$C" = "200" ]; then echo "OK s_bur"; P=$((P+1)); else echo "FAIL s_bur ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/wound_body_24.json "$H/api/wound_staging/wound_surgical")
if [ "$C" = "200" ]; then echo "OK s_sur"; P=$((P+1)); else echo "FAIL s_sur ($C)"; fi
echo PASS=$P FAIL=$F
