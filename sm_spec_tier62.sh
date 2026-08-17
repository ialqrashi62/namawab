#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/spec_body_0.json "$H/api/sp_geri/geriatric_assessment")
if [ "$C" = "200" ]; then echo "OK s_ga"; P=$((P+1)); else echo "FAIL s_ga ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/spec_body_1.json "$H/api/sp_geri/polypharmacy_review")
if [ "$C" = "200" ]; then echo "OK s_pr"; P=$((P+1)); else echo "FAIL s_pr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/spec_body_2.json "$H/api/sp_geri/falls_clinic")
if [ "$C" = "200" ]; then echo "OK s_fc"; P=$((P+1)); else echo "FAIL s_fc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/spec_body_3.json "$H/api/sp_geri/delirium_screen")
if [ "$C" = "200" ]; then echo "OK s_ds"; P=$((P+1)); else echo "FAIL s_ds ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/spec_body_4.json "$H/api/sp_geri/dementia_workup")
if [ "$C" = "200" ]; then echo "OK s_dw"; P=$((P+1)); else echo "FAIL s_dw ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/spec_body_5.json "$H/api/sp_pall/palliative_intake")
if [ "$C" = "200" ]; then echo "OK s_pi"; P=$((P+1)); else echo "FAIL s_pi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/spec_body_6.json "$H/api/sp_pall/advance_directive")
if [ "$C" = "200" ]; then echo "OK s_ad"; P=$((P+1)); else echo "FAIL s_ad ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/spec_body_7.json "$H/api/sp_pall/goals_of_care")
if [ "$C" = "200" ]; then echo "OK s_gc"; P=$((P+1)); else echo "FAIL s_gc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/spec_body_8.json "$H/api/sp_pall/comfort_care_order")
if [ "$C" = "200" ]; then echo "OK s_co"; P=$((P+1)); else echo "FAIL s_co ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/spec_body_9.json "$H/api/sp_pall/end_of_life")
if [ "$C" = "200" ]; then echo "OK s_eol"; P=$((P+1)); else echo "FAIL s_eol ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/spec_body_10.json "$H/api/sp_home/home_health_intake")
if [ "$C" = "200" ]; then echo "OK s_hhi"; P=$((P+1)); else echo "FAIL s_hhi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/spec_body_11.json "$H/api/sp_home/home_health_visit")
if [ "$C" = "200" ]; then echo "OK s_hhv"; P=$((P+1)); else echo "FAIL s_hhv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/spec_body_12.json "$H/api/sp_home/home_health_discharge")
if [ "$C" = "200" ]; then echo "OK s_hhd"; P=$((P+1)); else echo "FAIL s_hhd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/spec_body_13.json "$H/api/sp_home/wound_care_visit")
if [ "$C" = "200" ]; then echo "OK s_wcv"; P=$((P+1)); else echo "FAIL s_wcv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/spec_body_14.json "$H/api/sp_home/infusion_visit")
if [ "$C" = "200" ]; then echo "OK s_iv"; P=$((P+1)); else echo "FAIL s_iv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/spec_body_15.json "$H/api/sp_rehab/pt_evaluation")
if [ "$C" = "200" ]; then echo "OK s_pte"; P=$((P+1)); else echo "FAIL s_pte ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/spec_body_16.json "$H/api/sp_rehab/ot_evaluation")
if [ "$C" = "200" ]; then echo "OK s_ote"; P=$((P+1)); else echo "FAIL s_ote ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/spec_body_17.json "$H/api/sp_rehab/speech_eval")
if [ "$C" = "200" ]; then echo "OK s_ste"; P=$((P+1)); else echo "FAIL s_ste ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/spec_body_18.json "$H/api/sp_rehab/rehab_progress_note")
if [ "$C" = "200" ]; then echo "OK s_rpn"; P=$((P+1)); else echo "FAIL s_rpn ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/spec_body_19.json "$H/api/sp_rehab/rehab_discharge")
if [ "$C" = "200" ]; then echo "OK s_rdh"; P=$((P+1)); else echo "FAIL s_rdh ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/spec_body_20.json "$H/api/sp_mat/maternity_intake")
if [ "$C" = "200" ]; then echo "OK s_mi"; P=$((P+1)); else echo "FAIL s_mi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/spec_body_21.json "$H/api/sp_mat/prenatal_visit")
if [ "$C" = "200" ]; then echo "OK s_pv"; P=$((P+1)); else echo "FAIL s_pv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/spec_body_22.json "$H/api/sp_mat/postnatal_visit")
if [ "$C" = "200" ]; then echo "OK s_pnv"; P=$((P+1)); else echo "FAIL s_pnv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/spec_body_23.json "$H/api/sp_mat/lactation_consult")
if [ "$C" = "200" ]; then echo "OK s_lc"; P=$((P+1)); else echo "FAIL s_lc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/spec_body_24.json "$H/api/sp_mat/high_risk_pregnancy")
if [ "$C" = "200" ]; then echo "OK s_hrp"; P=$((P+1)); else echo "FAIL s_hrp ($C)"; fi
echo PASS=$P FAIL=$F
