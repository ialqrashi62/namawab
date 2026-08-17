#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_0.json "$H/api/er_trauma/polytrauma")
if [ "$C" = "200" ]; then echo "OK e_pol"; P=$((P+1)); else echo "FAIL e_pol ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_1.json "$H/api/er_trauma/burn_thermal")
if [ "$C" = "200" ]; then echo "OK e_brn"; P=$((P+1)); else echo "FAIL e_brn ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_2.json "$H/api/er_trauma/trauma_amputation")
if [ "$C" = "200" ]; then echo "OK e_amp"; P=$((P+1)); else echo "FAIL e_amp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_3.json "$H/api/er_trauma/blast_injury")
if [ "$C" = "200" ]; then echo "OK e_bla"; P=$((P+1)); else echo "FAIL e_bla ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_4.json "$H/api/er_trauma/penetrating_trauma")
if [ "$C" = "200" ]; then echo "OK e_pen"; P=$((P+1)); else echo "FAIL e_pen ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_5.json "$H/api/er_cardio/acs_emergent")
if [ "$C" = "200" ]; then echo "OK e_acs"; P=$((P+1)); else echo "FAIL e_acs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_6.json "$H/api/er_cardio/arrhythmia_emergent")
if [ "$C" = "200" ]; then echo "OK e_arr"; P=$((P+1)); else echo "FAIL e_arr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_7.json "$H/api/er_cardio/aortic_dissection")
if [ "$C" = "200" ]; then echo "OK e_aoa"; P=$((P+1)); else echo "FAIL e_aoa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_8.json "$H/api/er_cardio/pericarditis_tamponade")
if [ "$C" = "200" ]; then echo "OK e_per"; P=$((P+1)); else echo "FAIL e_per ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_9.json "$H/api/er_cardio/pe_massive")
if [ "$C" = "200" ]; then echo "OK e_pe"; P=$((P+1)); else echo "FAIL e_pe ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_10.json "$H/api/er_neuro/stroke_alert")
if [ "$C" = "200" ]; then echo "OK e_str"; P=$((P+1)); else echo "FAIL e_str ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_11.json "$H/api/er_neuro/status_epilepticus_emergent")
if [ "$C" = "200" ]; then echo "OK e_se"; P=$((P+1)); else echo "FAIL e_se ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_12.json "$H/api/er_neuro/tbi_emergent")
if [ "$C" = "200" ]; then echo "OK e_tbi"; P=$((P+1)); else echo "FAIL e_tbi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_13.json "$H/api/er_neuro/anion_gap_acidosis")
if [ "$C" = "200" ]; then echo "OK e_aga"; P=$((P+1)); else echo "FAIL e_aga ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_14.json "$H/api/er_neuro/meningitis_emergent")
if [ "$C" = "200" ]; then echo "OK e_men"; P=$((P+1)); else echo "FAIL e_men ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_15.json "$H/api/er_resp/respiratory_failure_emergent")
if [ "$C" = "200" ]; then echo "OK e_arf"; P=$((P+1)); else echo "FAIL e_arf ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_16.json "$H/api/er_resp/asthma_exacerbation_severe")
if [ "$C" = "200" ]; then echo "OK e_asx"; P=$((P+1)); else echo "FAIL e_asx ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_17.json "$H/api/er_resp/pneumothorax_tension")
if [ "$C" = "200" ]; then echo "OK e_ten"; P=$((P+1)); else echo "FAIL e_ten ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_18.json "$H/api/er_resp/pulmonary_embola_massive")
if [ "$C" = "200" ]; then echo "OK e_pem"; P=$((P+1)); else echo "FAIL e_pem ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_19.json "$H/api/er_resp/hemoptysis_massive")
if [ "$C" = "200" ]; then echo "OK e_hem"; P=$((P+1)); else echo "FAIL e_hem ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_20.json "$H/api/er_gi_gi/gi_bleed_upper")
if [ "$C" = "200" ]; then echo "OK e_ubt"; P=$((P+1)); else echo "FAIL e_ubt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_21.json "$H/api/er_gi_gi/gi_bleed_lower")
if [ "$C" = "200" ]; then echo "OK e_lbt"; P=$((P+1)); else echo "FAIL e_lbt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_22.json "$H/api/er_gi_gi/bowel_obstruction")
if [ "$C" = "200" ]; then echo "OK e_bow"; P=$((P+1)); else echo "FAIL e_bow ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_23.json "$H/api/er_gi_gi/perforation_gi")
if [ "$C" = "200" ]; then echo "OK e_prf"; P=$((P+1)); else echo "FAIL e_prf ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/er_body_24.json "$H/api/er_gi_gi/acute_pancreatitis_severe")
if [ "$C" = "200" ]; then echo "OK e_pan"; P=$((P+1)); else echo "FAIL e_pan ($C)"; fi
echo PASS=$P FAIL=$F
