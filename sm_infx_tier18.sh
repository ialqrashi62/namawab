#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_0.json "$H/api/infx_outbreak/outbreak_detect")
if [ "$C" = "200" ]; then echo "OK o_det"; P=$((P+1)); else echo "FAIL o_det ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_1.json "$H/api/infx_outbreak/outbreak_organism")
if [ "$C" = "200" ]; then echo "OK o_org"; P=$((P+1)); else echo "FAIL o_org ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_2.json "$H/api/infx_outbreak/outbreak_exposure")
if [ "$C" = "200" ]; then echo "OK o_exp"; P=$((P+1)); else echo "FAIL o_exp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_3.json "$H/api/infx_outbreak/outbreak_response")
if [ "$C" = "200" ]; then echo "OK o_resp"; P=$((P+1)); else echo "FAIL o_resp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_4.json "$H/api/infx_outbreak/outbreak_close")
if [ "$C" = "200" ]; then echo "OK o_close"; P=$((P+1)); else echo "FAIL o_close ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_5.json "$H/api/infx_isolation/isolation_assess")
if [ "$C" = "200" ]; then echo "OK i_assess"; P=$((P+1)); else echo "FAIL i_assess ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_6.json "$H/api/infx_isolation/isolation_ppe")
if [ "$C" = "200" ]; then echo "OK i_ppe"; P=$((P+1)); else echo "FAIL i_ppe ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_7.json "$H/api/infx_isolation/isolation_room")
if [ "$C" = "200" ]; then echo "OK i_room"; P=$((P+1)); else echo "FAIL i_room ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_8.json "$H/api/infx_isolation/isolation_signage")
if [ "$C" = "200" ]; then echo "OK i_sign"; P=$((P+1)); else echo "FAIL i_sign ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_9.json "$H/api/infx_isolation/isolation_discontinue")
if [ "$C" = "200" ]; then echo "OK i_disc"; P=$((P+1)); else echo "FAIL i_disc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_10.json "$H/api/infx_mdro/mdro_screen")
if [ "$C" = "200" ]; then echo "OK m_scr"; P=$((P+1)); else echo "FAIL m_scr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_11.json "$H/api/infx_mdro/mdro_decolonize")
if [ "$C" = "200" ]; then echo "OK m_dec"; P=$((P+1)); else echo "FAIL m_dec ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_12.json "$H/api/infx_mdro/mdro_antibiotic_steward")
if [ "$C" = "200" ]; then echo "OK m_stw"; P=$((P+1)); else echo "FAIL m_stw ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_13.json "$H/api/infx_mdro/mdro_precautions")
if [ "$C" = "200" ]; then echo "OK m_prec"; P=$((P+1)); else echo "FAIL m_prec ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_14.json "$H/api/infx_mdro/mdro_culture_followup")
if [ "$C" = "200" ]; then echo "OK m_fu"; P=$((P+1)); else echo "FAIL m_fu ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_15.json "$H/api/infx_surveillance/infx_clabsi")
if [ "$C" = "200" ]; then echo "OK s_clabsi"; P=$((P+1)); else echo "FAIL s_clabsi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_16.json "$H/api/infx_surveillance/infx_cauti")
if [ "$C" = "200" ]; then echo "OK s_cauti"; P=$((P+1)); else echo "FAIL s_cauti ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_17.json "$H/api/infx_surveillance/infx_ssi")
if [ "$C" = "200" ]; then echo "OK s_ssi"; P=$((P+1)); else echo "FAIL s_ssi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_18.json "$H/api/infx_surveillance/infx_vap")
if [ "$C" = "200" ]; then echo "OK s_vap"; P=$((P+1)); else echo "FAIL s_vap ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_19.json "$H/api/infx_surveillance/infx_sir_calc")
if [ "$C" = "200" ]; then echo "OK s_sir"; P=$((P+1)); else echo "FAIL s_sir ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_20.json "$H/api/infx_employee/employee_vaccination")
if [ "$C" = "200" ]; then echo "OK e_vac"; P=$((P+1)); else echo "FAIL e_vac ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_21.json "$H/api/infx_employee/employee_exposure")
if [ "$C" = "200" ]; then echo "OK e_exp"; P=$((P+1)); else echo "FAIL e_exp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_22.json "$H/api/infx_employee/employee_fittest")
if [ "$C" = "200" ]; then echo "OK e_fit"; P=$((P+1)); else echo "FAIL e_fit ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_23.json "$H/api/infx_employee/employee_illness_exclusion")
if [ "$C" = "200" ]; then echo "OK e_excl"; P=$((P+1)); else echo "FAIL e_excl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/infx_body_24.json "$H/api/infx_employee/employee_tb_screen")
if [ "$C" = "200" ]; then echo "OK e_tb"; P=$((P+1)); else echo "FAIL e_tb ($C)"; fi
echo PASS=$P FAIL=$F
