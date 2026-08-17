#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sg_body_0.json "$H/api/surg_gi/cholecystectomy")
if [ "$C" = "200" ]; then echo "OK s_chol"; P=$((P+1)); else echo "FAIL s_chol ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sg_body_1.json "$H/api/surg_gi/appendectomy")
if [ "$C" = "200" ]; then echo "OK s_app"; P=$((P+1)); else echo "FAIL s_app ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sg_body_2.json "$H/api/surg_gi/hernia_repair")
if [ "$C" = "200" ]; then echo "OK s_her"; P=$((P+1)); else echo "FAIL s_her ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sg_body_3.json "$H/api/surg_gi/colectomy")
if [ "$C" = "200" ]; then echo "OK s_col"; P=$((P+1)); else echo "FAIL s_col ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sg_body_4.json "$H/api/surg_gi/gastric_bypass")
if [ "$C" = "200" ]; then echo "OK s_gas"; P=$((P+1)); else echo "FAIL s_gas ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sg_body_5.json "$H/api/surg_ortho/arthroplasty")
if [ "$C" = "200" ]; then echo "OK s_art"; P=$((P+1)); else echo "FAIL s_art ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sg_body_6.json "$H/api/surg_ortho/fracture_fixation")
if [ "$C" = "200" ]; then echo "OK s_frx"; P=$((P+1)); else echo "FAIL s_frx ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sg_body_7.json "$H/api/surg_ortho/spinal_fusion")
if [ "$C" = "200" ]; then echo "OK s_spn"; P=$((P+1)); else echo "FAIL s_spn ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sg_body_8.json "$H/api/surg_ortho/arthroscopy")
if [ "$C" = "200" ]; then echo "OK s_art"; P=$((P+1)); else echo "FAIL s_art ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sg_body_9.json "$H/api/surg_ortho/amputation")
if [ "$C" = "200" ]; then echo "OK s_amp"; P=$((P+1)); else echo "FAIL s_amp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sg_body_10.json "$H/api/surg_vasc/aaa_repair")
if [ "$C" = "200" ]; then echo "OK s_aaa"; P=$((P+1)); else echo "FAIL s_aaa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sg_body_11.json "$H/api/surg_vasc/carotid_endarterectomy")
if [ "$C" = "200" ]; then echo "OK s_car"; P=$((P+1)); else echo "FAIL s_car ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sg_body_12.json "$H/api/surg_vasc/bypass_graft")
if [ "$C" = "200" ]; then echo "OK s_byp"; P=$((P+1)); else echo "FAIL s_byp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sg_body_13.json "$H/api/surg_vasc/varicose_vein")
if [ "$C" = "200" ]; then echo "OK s_var"; P=$((P+1)); else echo "FAIL s_var ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sg_body_14.json "$H/api/surg_vasc/emoblization")
if [ "$C" = "200" ]; then echo "OK s_emb"; P=$((P+1)); else echo "FAIL s_emb ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sg_body_15.json "$H/api/surg_trauma/damage_control_lap")
if [ "$C" = "200" ]; then echo "OK s_dcl"; P=$((P+1)); else echo "FAIL s_dcl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sg_body_16.json "$H/api/surg_trauma/fasciotomy")
if [ "$C" = "200" ]; then echo "OK s_fas"; P=$((P+1)); else echo "FAIL s_fas ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sg_body_17.json "$H/api/surg_trauma/thoracotomy")
if [ "$C" = "200" ]; then echo "OK s_tho"; P=$((P+1)); else echo "FAIL s_tho ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sg_body_18.json "$H/api/surg_trauma/neck_exploration")
if [ "$C" = "200" ]; then echo "OK s_nec"; P=$((P+1)); else echo "FAIL s_nec ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sg_body_19.json "$H/api/surg_trauma/pelvic_packing")
if [ "$C" = "200" ]; then echo "OK s_pel"; P=$((P+1)); else echo "FAIL s_pel ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sg_body_20.json "$H/api/surg_transplant/renal_transplant")
if [ "$C" = "200" ]; then echo "OK s_ren"; P=$((P+1)); else echo "FAIL s_ren ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sg_body_21.json "$H/api/surg_transplant/liver_transplant")
if [ "$C" = "200" ]; then echo "OK s_lvr"; P=$((P+1)); else echo "FAIL s_lvr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sg_body_22.json "$H/api/surg_transplant/heart_transplant")
if [ "$C" = "200" ]; then echo "OK s_hrt"; P=$((P+1)); else echo "FAIL s_hrt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sg_body_23.json "$H/api/surg_transplant/lung_transplant")
if [ "$C" = "200" ]; then echo "OK s_lng"; P=$((P+1)); else echo "FAIL s_lng ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/sg_body_24.json "$H/api/surg_transplant/pancreas_transplant")
if [ "$C" = "200" ]; then echo "OK s_pan"; P=$((P+1)); else echo "FAIL s_pan ($C)"; fi
echo PASS=$P FAIL=$F
