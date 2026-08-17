#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rha_body_0.json "$H/api/rehab_pt/stroke_rehab")
if [ "$C" = "200" ]; then echo "OK r_str"; P=$((P+1)); else echo "FAIL r_str ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rha_body_1.json "$H/api/rehab_pt/spinal_cord_injury_rehab")
if [ "$C" = "200" ]; then echo "OK r_sci"; P=$((P+1)); else echo "FAIL r_sci ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rha_body_2.json "$H/api/rehab_pt/amputee_rehab")
if [ "$C" = "200" ]; then echo "OK r_amp"; P=$((P+1)); else echo "FAIL r_amp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rha_body_3.json "$H/api/rehab_pt/balance_vestibular")
if [ "$C" = "200" ]; then echo "OK r_bal"; P=$((P+1)); else echo "FAIL r_bal ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rha_body_4.json "$H/api/rehab_pt/gait_training")
if [ "$C" = "200" ]; then echo "OK r_gai"; P=$((P+1)); else echo "FAIL r_gai ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rha_body_5.json "$H/api/rehab_ot/adl_training")
if [ "$C" = "200" ]; then echo "OK r_adl"; P=$((P+1)); else echo "FAIL r_adl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rha_body_6.json "$H/api/rehab_ot/hand_therapy_upper_limb")
if [ "$C" = "200" ]; then echo "OK r_hnd"; P=$((P+1)); else echo "FAIL r_hnd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rha_body_7.json "$H/api/rehab_ot/cognitive_rehab")
if [ "$C" = "200" ]; then echo "OK r_cog"; P=$((P+1)); else echo "FAIL r_cog ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rha_body_8.json "$H/api/rehab_ot/splinting")
if [ "$C" = "200" ]; then echo "OK r_spl"; P=$((P+1)); else echo "FAIL r_spl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rha_body_9.json "$H/api/rehab_ot/work_hardening")
if [ "$C" = "200" ]; then echo "OK r_wrk"; P=$((P+1)); else echo "FAIL r_wrk ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rha_body_10.json "$H/api/rehab_slp/dysphagia_swallow")
if [ "$C" = "200" ]; then echo "OK r_dys"; P=$((P+1)); else echo "FAIL r_dys ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rha_body_11.json "$H/api/rehab_slp/aphasia")
if [ "$C" = "200" ]; then echo "OK r_aph"; P=$((P+1)); else echo "FAIL r_aph ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rha_body_12.json "$H/api/rehab_slp/apraxia_of_speech")
if [ "$C" = "200" ]; then echo "OK r_apx"; P=$((P+1)); else echo "FAIL r_apx ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rha_body_13.json "$H/api/rehab_slp/voice_therapy")
if [ "$C" = "200" ]; then echo "OK r_vce"; P=$((P+1)); else echo "FAIL r_vce ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rha_body_14.json "$H/api/rehab_slp/trach_speaking_valve")
if [ "$C" = "200" ]; then echo "OK r_tsv"; P=$((P+1)); else echo "FAIL r_tsv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rha_body_15.json "$H/api/rehab_prosth/upper_limb_prosthetic")
if [ "$C" = "200" ]; then echo "OK r_ulp"; P=$((P+1)); else echo "FAIL r_ulp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rha_body_16.json "$H/api/rehab_prosth/lower_limb_prosthetic")
if [ "$C" = "200" ]; then echo "OK r_llp"; P=$((P+1)); else echo "FAIL r_llp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rha_body_17.json "$H/api/rehab_prosth/orthotic_bracing")
if [ "$C" = "200" ]; then echo "OK r_ort"; P=$((P+1)); else echo "FAIL r_ort ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rha_body_18.json "$H/api/rehab_prosth/spinal_orthosis")
if [ "$C" = "200" ]; then echo "OK r_spo"; P=$((P+1)); else echo "FAIL r_spo ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rha_body_19.json "$H/api/rehab_prosth/wheelchair_seating")
if [ "$C" = "200" ]; then echo "OK r_whl"; P=$((P+1)); else echo "FAIL r_whl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rha_body_20.json "$H/api/rehab_pain/chronic_pain_program")
if [ "$C" = "200" ]; then echo "OK r_cpp"; P=$((P+1)); else echo "FAIL r_cpp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rha_body_21.json "$H/api/rehab_pain/low_back_pain")
if [ "$C" = "200" ]; then echo "OK r_lbp"; P=$((P+1)); else echo "FAIL r_lbp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rha_body_22.json "$H/api/rehab_pain/fibromyalgia_program")
if [ "$C" = "200" ]; then echo "OK r_fib"; P=$((P+1)); else echo "FAIL r_fib ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rha_body_23.json "$H/api/rehab_pain/lymphedema")
if [ "$C" = "200" ]; then echo "OK r_lym"; P=$((P+1)); else echo "FAIL r_lym ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rha_body_24.json "$H/api/rehab_pain/headache_migraine")
if [ "$C" = "200" ]; then echo "OK r_hd"; P=$((P+1)); else echo "FAIL r_hd ($C)"; fi
echo PASS=$P FAIL=$F
