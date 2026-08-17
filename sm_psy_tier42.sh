#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/psy_body_0.json "$H/api/psych_mood/depression_mdd")
if [ "$C" = "200" ]; then echo "OK p_mdd"; P=$((P+1)); else echo "FAIL p_mdd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/psy_body_1.json "$H/api/psych_mood/generalized_anxiety")
if [ "$C" = "200" ]; then echo "OK p_gad"; P=$((P+1)); else echo "FAIL p_gad ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/psy_body_2.json "$H/api/psych_mood/panic_disorder")
if [ "$C" = "200" ]; then echo "OK p_pan"; P=$((P+1)); else echo "FAIL p_pan ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/psy_body_3.json "$H/api/psych_mood/bipolar_disorder")
if [ "$C" = "200" ]; then echo "OK p_bp"; P=$((P+1)); else echo "FAIL p_bp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/psy_body_4.json "$H/api/psych_mood/social_anxiety")
if [ "$C" = "200" ]; then echo "OK p_sa"; P=$((P+1)); else echo "FAIL p_sa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/psy_body_5.json "$H/api/psych_psychotic/schizophrenia")
if [ "$C" = "200" ]; then echo "OK p_sz"; P=$((P+1)); else echo "FAIL p_sz ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/psy_body_6.json "$H/api/psych_psychotic/schizoaffective")
if [ "$C" = "200" ]; then echo "OK p_sa"; P=$((P+1)); else echo "FAIL p_sa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/psy_body_7.json "$H/api/psych_psychotic/delusional_disorder")
if [ "$C" = "200" ]; then echo "OK p_dd"; P=$((P+1)); else echo "FAIL p_dd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/psy_body_8.json "$H/api/psych_psychotic/brief_psychotic")
if [ "$C" = "200" ]; then echo "OK p_bp"; P=$((P+1)); else echo "FAIL p_bp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/psy_body_9.json "$H/api/psych_psychotic/substance_induced_psychosis")
if [ "$C" = "200" ]; then echo "OK p_sp"; P=$((P+1)); else echo "FAIL p_sp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/psy_body_10.json "$H/api/psych_trauma/ptsd")
if [ "$C" = "200" ]; then echo "OK p_ptsd"; P=$((P+1)); else echo "FAIL p_ptsd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/psy_body_11.json "$H/api/psych_trauma/acute_stress")
if [ "$C" = "200" ]; then echo "OK p_asa"; P=$((P+1)); else echo "FAIL p_asa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/psy_body_12.json "$H/api/psych_trauma/adjustment_disorder")
if [ "$C" = "200" ]; then echo "OK p_adj"; P=$((P+1)); else echo "FAIL p_adj ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/psy_body_13.json "$H/api/psych_trauma/complex_trauma")
if [ "$C" = "200" ]; then echo "OK p_ct"; P=$((P+1)); else echo "FAIL p_ct ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/psy_body_14.json "$H/api/psych_trauma/dissociative_disorder")
if [ "$C" = "200" ]; then echo "OK p_dd"; P=$((P+1)); else echo "FAIL p_dd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/psy_body_15.json "$H/api/psych_substance/alcohol_use")
if [ "$C" = "200" ]; then echo "OK p_alc"; P=$((P+1)); else echo "FAIL p_alc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/psy_body_16.json "$H/api/psych_substance/opioid_use")
if [ "$C" = "200" ]; then echo "OK p_opi"; P=$((P+1)); else echo "FAIL p_opi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/psy_body_17.json "$H/api/psych_substance/cannabis_use")
if [ "$C" = "200" ]; then echo "OK p_can"; P=$((P+1)); else echo "FAIL p_can ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/psy_body_18.json "$H/api/psych_substance/stimulant_use")
if [ "$C" = "200" ]; then echo "OK p_sti"; P=$((P+1)); else echo "FAIL p_sti ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/psy_body_19.json "$H/api/psych_substance/sedative_use")
if [ "$C" = "200" ]; then echo "OK p_sed"; P=$((P+1)); else echo "FAIL p_sed ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/psy_body_20.json "$H/api/psych_neurodev/adhd")
if [ "$C" = "200" ]; then echo "OK p_adhd"; P=$((P+1)); else echo "FAIL p_adhd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/psy_body_21.json "$H/api/psych_neurodev/autism_spectrum")
if [ "$C" = "200" ]; then echo "OK p_asd"; P=$((P+1)); else echo "FAIL p_asd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/psy_body_22.json "$H/api/psych_neurodev/tourette")
if [ "$C" = "200" ]; then echo "OK p_tou"; P=$((P+1)); else echo "FAIL p_tou ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/psy_body_23.json "$H/api/psych_neurodev/intellectual_disability")
if [ "$C" = "200" ]; then echo "OK p_id"; P=$((P+1)); else echo "FAIL p_id ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/psy_body_24.json "$H/api/psych_neurodev/learning_disorder")
if [ "$C" = "200" ]; then echo "OK p_ld"; P=$((P+1)); else echo "FAIL p_ld ($C)"; fi
echo PASS=$P FAIL=$F
