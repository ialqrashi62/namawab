#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_0.json "$H/api/ob_prenatal/prenatal_visit")
if [ "$C" = "200" ]; then echo "OK o_pv"; P=$((P+1)); else echo "FAIL o_pv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_1.json "$H/api/ob_prenatal/prenatal_screening")
if [ "$C" = "200" ]; then echo "OK o_ps"; P=$((P+1)); else echo "FAIL o_ps ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_2.json "$H/api/ob_prenatal/ultrasound")
if [ "$C" = "200" ]; then echo "OK o_us"; P=$((P+1)); else echo "FAIL o_us ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_3.json "$H/api/ob_prenatal/high_risk_pregnancy")
if [ "$C" = "200" ]; then echo "OK o_hr"; P=$((P+1)); else echo "FAIL o_hr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_4.json "$H/api/ob_prenatal/vaccination")
if [ "$C" = "200" ]; then echo "OK o_vac"; P=$((P+1)); else echo "FAIL o_vac ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_5.json "$H/api/ob_labor/partogram")
if [ "$C" = "200" ]; then echo "OK o_par"; P=$((P+1)); else echo "FAIL o_par ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_6.json "$H/api/ob_labor/induction")
if [ "$C" = "200" ]; then echo "OK o_ind"; P=$((P+1)); else echo "FAIL o_ind ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_7.json "$H/api/ob_labor/fetal_monitoring")
if [ "$C" = "200" ]; then echo "OK o_fm"; P=$((P+1)); else echo "FAIL o_fm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_8.json "$H/api/ob_labor/delivery")
if [ "$C" = "200" ]; then echo "OK o_del"; P=$((P+1)); else echo "FAIL o_del ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_9.json "$H/api/ob_labor/postpartum")
if [ "$C" = "200" ]; then echo "OK o_pp"; P=$((P+1)); else echo "FAIL o_pp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_10.json "$H/api/ob_gynecology/contraception")
if [ "$C" = "200" ]; then echo "OK o_con"; P=$((P+1)); else echo "FAIL o_con ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_11.json "$H/api/ob_gynecology/cervical_screening")
if [ "$C" = "200" ]; then echo "OK o_cs"; P=$((P+1)); else echo "FAIL o_cs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_12.json "$H/api/ob_gynecology/menopause")
if [ "$C" = "200" ]; then echo "OK o_men"; P=$((P+1)); else echo "FAIL o_men ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_13.json "$H/api/ob_gynecology/abnormal_bleeding")
if [ "$C" = "200" ]; then echo "OK o_ab"; P=$((P+1)); else echo "FAIL o_ab ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_14.json "$H/api/ob_gynecology/pcos")
if [ "$C" = "200" ]; then echo "OK o_pcos"; P=$((P+1)); else echo "FAIL o_pcos ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_15.json "$H/api/ob_neonatal/apgar")
if [ "$C" = "200" ]; then echo "OK o_apg"; P=$((P+1)); else echo "FAIL o_apg ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_16.json "$H/api/ob_neonatal/nrp")
if [ "$C" = "200" ]; then echo "OK o_nrp"; P=$((P+1)); else echo "FAIL o_nrp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_17.json "$H/api/ob_neonatal/newborn_screen")
if [ "$C" = "200" ]; then echo "OK o_nbs"; P=$((P+1)); else echo "FAIL o_nbs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_18.json "$H/api/ob_neonatal/thermoregulation")
if [ "$C" = "200" ]; then echo "OK o_th"; P=$((P+1)); else echo "FAIL o_th ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_19.json "$H/api/ob_neonatal/feeding_newborn")
if [ "$C" = "200" ]; then echo "OK o_feed"; P=$((P+1)); else echo "FAIL o_feed ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_20.json "$H/api/ob_reproduction/infertility")
if [ "$C" = "200" ]; then echo "OK o_inf"; P=$((P+1)); else echo "FAIL o_inf ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_21.json "$H/api/ob_reproduction/ivf_cycle")
if [ "$C" = "200" ]; then echo "OK o_ivf"; P=$((P+1)); else echo "FAIL o_ivf ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_22.json "$H/api/ob_reproduction/transfer")
if [ "$C" = "200" ]; then echo "OK o_et"; P=$((P+1)); else echo "FAIL o_et ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_23.json "$H/api/ob_reproduction/ovulation")
if [ "$C" = "200" ]; then echo "OK o_ov"; P=$((P+1)); else echo "FAIL o_ov ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ob_body_24.json "$H/api/ob_reproduction/miscarriage")
if [ "$C" = "200" ]; then echo "OK o_mis"; P=$((P+1)); else echo "FAIL o_mis ($C)"; fi
echo PASS=$P FAIL=$F
