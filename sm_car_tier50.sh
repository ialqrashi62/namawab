#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/car_body_0.json "$H/api/card_failure/heart_failure_hfpef")
if [ "$C" = "200" ]; then echo "OK c_hfp"; P=$((P+1)); else echo "FAIL c_hfp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/car_body_1.json "$H/api/card_failure/heart_failure_hfref")
if [ "$C" = "200" ]; then echo "OK c_hfr"; P=$((P+1)); else echo "FAIL c_hfr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/car_body_2.json "$H/api/card_failure/cardiomyopathy")
if [ "$C" = "200" ]; then echo "OK c_cmp"; P=$((P+1)); else echo "FAIL c_cmp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/car_body_3.json "$H/api/card_failure/acute_decompensated_hf")
if [ "$C" = "200" ]; then echo "OK c_adh"; P=$((P+1)); else echo "FAIL c_adh ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/car_body_4.json "$H/api/card_failure/advanced_heart_failure")
if [ "$C" = "200" ]; then echo "OK c_adv"; P=$((P+1)); else echo "FAIL c_adv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/car_body_5.json "$H/api/card_arr/atrial_fibrillation")
if [ "$C" = "200" ]; then echo "OK c_afb"; P=$((P+1)); else echo "FAIL c_afb ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/car_body_6.json "$H/api/card_arr/supraventricular_tachy")
if [ "$C" = "200" ]; then echo "OK c_svt"; P=$((P+1)); else echo "FAIL c_svt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/car_body_7.json "$H/api/card_arr/ventricular_tachycardia")
if [ "$C" = "200" ]; then echo "OK c_vt"; P=$((P+1)); else echo "FAIL c_vt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/car_body_8.json "$H/api/card_arr/bradycardia")
if [ "$C" = "200" ]; then echo "OK c_brd"; P=$((P+1)); else echo "FAIL c_brd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/car_body_9.json "$H/api/card_arr/channelopathies")
if [ "$C" = "200" ]; then echo "OK c_chl"; P=$((P+1)); else echo "FAIL c_chl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/car_body_10.json "$H/api/card_valve/aortic_stenosis")
if [ "$C" = "200" ]; then echo "OK c_as"; P=$((P+1)); else echo "FAIL c_as ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/car_body_11.json "$H/api/card_valve/mitral_regurg")
if [ "$C" = "200" ]; then echo "OK c_mr"; P=$((P+1)); else echo "FAIL c_mr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/car_body_12.json "$H/api/card_valve/tricuspid_regurg")
if [ "$C" = "200" ]; then echo "OK c_tr"; P=$((P+1)); else echo "FAIL c_tr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/car_body_13.json "$H/api/card_valve/pulmonary_stenosis")
if [ "$C" = "200" ]; then echo "OK c_ps"; P=$((P+1)); else echo "FAIL c_ps ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/car_body_14.json "$H/api/card_valve/prosthetic_valve")
if [ "$C" = "200" ]; then echo "OK c_pv"; P=$((P+1)); else echo "FAIL c_pv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/car_body_15.json "$H/api/card_ischemic/stemi")
if [ "$C" = "200" ]; then echo "OK c_ste"; P=$((P+1)); else echo "FAIL c_ste ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/car_body_16.json "$H/api/card_ischemic/nstemi_acs")
if [ "$C" = "200" ]; then echo "OK c_nst"; P=$((P+1)); else echo "FAIL c_nst ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/car_body_17.json "$H/api/card_ischemic/unstable_angina")
if [ "$C" = "200" ]; then echo "OK c_una"; P=$((P+1)); else echo "FAIL c_una ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/car_body_18.json "$H/api/card_ischemic/stable_angina")
if [ "$C" = "200" ]; then echo "OK c_sta"; P=$((P+1)); else echo "FAIL c_sta ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/car_body_19.json "$H/api/card_ischemic/prinzmetal_angina")
if [ "$C" = "200" ]; then echo "OK c_pri"; P=$((P+1)); else echo "FAIL c_pri ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/car_body_20.json "$H/api/card_cong/atrial_septal_defect")
if [ "$C" = "200" ]; then echo "OK c_asd"; P=$((P+1)); else echo "FAIL c_asd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/car_body_21.json "$H/api/card_cong/ventricular_septal_defect")
if [ "$C" = "200" ]; then echo "OK c_vsd"; P=$((P+1)); else echo "FAIL c_vsd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/car_body_22.json "$H/api/card_cong/patent_ductus")
if [ "$C" = "200" ]; then echo "OK c_pda"; P=$((P+1)); else echo "FAIL c_pda ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/car_body_23.json "$H/api/card_cong/coarctation_aorta")
if [ "$C" = "200" ]; then echo "OK c_coa"; P=$((P+1)); else echo "FAIL c_coa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/car_body_24.json "$H/api/card_cong/tetralogy")
if [ "$C" = "200" ]; then echo "OK c_tof"; P=$((P+1)); else echo "FAIL c_tof ($C)"; fi
echo PASS=$P FAIL=$F
