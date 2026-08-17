#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/icu_body_0.json "$H/api/icu_vent/ards")
if [ "$C" = "200" ]; then echo "OK i_ards"; P=$((P+1)); else echo "FAIL i_ards ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/icu_body_1.json "$H/api/icu_vent/weaning_protocol")
if [ "$C" = "200" ]; then echo "OK i_wean"; P=$((P+1)); else echo "FAIL i_wean ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/icu_body_2.json "$H/api/icu_vent/prone_ventilation")
if [ "$C" = "200" ]; then echo "OK i_pron"; P=$((P+1)); else echo "FAIL i_pron ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/icu_body_3.json "$H/api/icu_vent/ecmo_evaluation")
if [ "$C" = "200" ]; then echo "OK i_ecmo"; P=$((P+1)); else echo "FAIL i_ecmo ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/icu_body_4.json "$H/api/icu_vent/ventilator_associated_pneumonia")
if [ "$C" = "200" ]; then echo "OK i_vap"; P=$((P+1)); else echo "FAIL i_vap ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/icu_body_5.json "$H/api/icu_sepsis/septic_shock")
if [ "$C" = "200" ]; then echo "OK i_ssh"; P=$((P+1)); else echo "FAIL i_ssh ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/icu_body_6.json "$H/api/icu_sepsis/severe_sepsis")
if [ "$C" = "200" ]; then echo "OK i_ssv"; P=$((P+1)); else echo "FAIL i_ssv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/icu_body_7.json "$H/api/icu_sepsis/multidrug_resistant")
if [ "$C" = "200" ]; then echo "OK i_mdr"; P=$((P+1)); else echo "FAIL i_mdr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/icu_body_8.json "$H/api/icu_sepsis/fungal_sepsis_icu")
if [ "$C" = "200" ]; then echo "OK i_fng"; P=$((P+1)); else echo "FAIL i_fng ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/icu_body_9.json "$H/api/icu_sepsis/catheter_sepsis")
if [ "$C" = "200" ]; then echo "OK i_cath"; P=$((P+1)); else echo "FAIL i_cath ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/icu_body_10.json "$H/api/icu_hemodyn/shock_cardiogenic")
if [ "$C" = "200" ]; then echo "OK i_sck"; P=$((P+1)); else echo "FAIL i_sck ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/icu_body_11.json "$H/api/icu_hemodyn/shock_distributive")
if [ "$C" = "200" ]; then echo "OK i_dst"; P=$((P+1)); else echo "FAIL i_dst ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/icu_body_12.json "$H/api/icu_hemodyn/shock_obstructive")
if [ "$C" = "200" ]; then echo "OK i_obs"; P=$((P+1)); else echo "FAIL i_obs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/icu_body_13.json "$H/api/icu_hemodyn/vasopressor_management")
if [ "$C" = "200" ]; then echo "OK i_vas"; P=$((P+1)); else echo "FAIL i_vas ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/icu_body_14.json "$H/api/icu_hemodyn/inotrope_management")
if [ "$C" = "200" ]; then echo "OK i_ino"; P=$((P+1)); else echo "FAIL i_ino ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/icu_body_15.json "$H/api/icu_neuro/tbi_icu")
if [ "$C" = "200" ]; then echo "OK i_tbi"; P=$((P+1)); else echo "FAIL i_tbi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/icu_body_16.json "$H/api/icu_neuro/status_epilepticus")
if [ "$C" = "200" ]; then echo "OK i_se"; P=$((P+1)); else echo "FAIL i_se ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/icu_body_17.json "$H/api/icu_neuro/icp_management")
if [ "$C" = "200" ]; then echo "OK i_icp"; P=$((P+1)); else echo "FAIL i_icp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/icu_body_18.json "$H/api/icu_neuro/subarachnoid_icu")
if [ "$C" = "200" ]; then echo "OK i_sah"; P=$((P+1)); else echo "FAIL i_sah ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/icu_body_19.json "$H/api/icu_neuro/stroke_icu")
if [ "$C" = "200" ]; then echo "OK i_str"; P=$((P+1)); else echo "FAIL i_str ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/icu_body_20.json "$H/api/icu_renal/aki_icu")
if [ "$C" = "200" ]; then echo "OK i_aki"; P=$((P+1)); else echo "FAIL i_aki ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/icu_body_21.json "$H/api/icu_renal/crrt")
if [ "$C" = "200" ]; then echo "OK i_crrt"; P=$((P+1)); else echo "FAIL i_crrt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/icu_body_22.json "$H/api/icu_renal/fluid_resuscitation")
if [ "$C" = "200" ]; then echo "OK i_flu"; P=$((P+1)); else echo "FAIL i_flu ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/icu_body_23.json "$H/api/icu_renal/electrolyte_emergency")
if [ "$C" = "200" ]; then echo "OK i_ely"; P=$((P+1)); else echo "FAIL i_ely ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/icu_body_24.json "$H/api/icu_renal/acid_base")
if [ "$C" = "200" ]; then echo "OK i_aba"; P=$((P+1)); else echo "FAIL i_aba ($C)"; fi
echo PASS=$P FAIL=$F
