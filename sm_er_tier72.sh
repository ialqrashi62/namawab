#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_0.json "$H/api/er_triage/rapid_medical_assessment")
if [ "$C" = "200" ]; then echo "OK e_rma"; P=$((P+1)); else echo "FAIL e_rma ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_1.json "$H/api/er_triage/esi_triage")
if [ "$C" = "200" ]; then echo "OK e_esi"; P=$((P+1)); else echo "FAIL e_esi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_2.json "$H/api/er_triage/pediatric_triage")
if [ "$C" = "200" ]; then echo "OK e_pt"; P=$((P+1)); else echo "FAIL e_pt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_3.json "$H/api/er_triage/psychiatric_triage")
if [ "$C" = "200" ]; then echo "OK e_psych"; P=$((P+1)); else echo "FAIL e_psych ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_4.json "$H/api/er_triage/obstetric_triage")
if [ "$C" = "200" ]; then echo "OK e_ob"; P=$((P+1)); else echo "FAIL e_ob ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_5.json "$H/api/er_resus/code_blue_activation")
if [ "$C" = "200" ]; then echo "OK e_cba"; P=$((P+1)); else echo "FAIL e_cba ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_6.json "$H/api/er_resus/code_stemi_activation")
if [ "$C" = "200" ]; then echo "OK e_csa"; P=$((P+1)); else echo "FAIL e_csa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_7.json "$H/api/er_resus/code_stroke_activation")
if [ "$C" = "200" ]; then echo "OK e_css"; P=$((P+1)); else echo "FAIL e_css ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_8.json "$H/api/er_resus/trauma_team_activation")
if [ "$C" = "200" ]; then echo "OK e_tta"; P=$((P+1)); else echo "FAIL e_tta ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_9.json "$H/api/er_resus/mass_casualty_activation")
if [ "$C" = "200" ]; then echo "OK e_mca"; P=$((P+1)); else echo "FAIL e_mca ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_10.json "$H/api/er_medic/acute_mi_protocol")
if [ "$C" = "200" ]; then echo "OK e_amp"; P=$((P+1)); else echo "FAIL e_amp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_11.json "$H/api/er_medic/stroke_protocol")
if [ "$C" = "200" ]; then echo "OK e_sp"; P=$((P+1)); else echo "FAIL e_sp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_12.json "$H/api/er_medic/sepsis_protocol")
if [ "$C" = "200" ]; then echo "OK e_sep"; P=$((P+1)); else echo "FAIL e_sep ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_13.json "$H/api/er_medic/anaphylaxis_protocol")
if [ "$C" = "200" ]; then echo "OK e_anp"; P=$((P+1)); else echo "FAIL e_anp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_14.json "$H/api/er_medic/toxidrome_assessment")
if [ "$C" = "200" ]; then echo "OK e_txa"; P=$((P+1)); else echo "FAIL e_txa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_15.json "$H/api/er_trauma/primary_survey")
if [ "$C" = "200" ]; then echo "OK e_psr"; P=$((P+1)); else echo "FAIL e_psr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_16.json "$H/api/er_trauma/secondary_survey")
if [ "$C" = "200" ]; then echo "OK e_ssr"; P=$((P+1)); else echo "FAIL e_ssr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_17.json "$H/api/er_trauma/fracture_reduction")
if [ "$C" = "200" ]; then echo "OK e_fcr"; P=$((P+1)); else echo "FAIL e_fcr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_18.json "$H/api/er_trauma/wound_exploration")
if [ "$C" = "200" ]; then echo "OK e_we"; P=$((P+1)); else echo "FAIL e_we ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_19.json "$H/api/er_trauma/trauma_sedation")
if [ "$C" = "200" ]; then echo "OK e_tsd"; P=$((P+1)); else echo "FAIL e_tsd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_20.json "$H/api/er_dispos/ed_discharge")
if [ "$C" = "200" ]; then echo "OK e_disch"; P=$((P+1)); else echo "FAIL e_disch ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_21.json "$H/api/er_dispos/ed_admission")
if [ "$C" = "200" ]; then echo "OK e_adm"; P=$((P+1)); else echo "FAIL e_adm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_22.json "$H/api/er_dispos/ed_transfer")
if [ "$C" = "200" ]; then echo "OK e_tra"; P=$((P+1)); else echo "FAIL e_tra ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_23.json "$H/api/er_dispos/ed_observation")
if [ "$C" = "200" ]; then echo "OK e_obs"; P=$((P+1)); else echo "FAIL e_obs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_24.json "$H/api/er_dispos/ed_left_ama")
if [ "$C" = "200" ]; then echo "OK e_lama"; P=$((P+1)); else echo "FAIL e_lama ($C)"; fi
echo PASS=$P FAIL=$F
