#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nephro_body_0.json "$H/api/nephro_ckd/ckd_stage")
if [ "$C" = "200" ]; then echo "OK n_cs"; P=$((P+1)); else echo "FAIL n_cs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nephro_body_1.json "$H/api/nephro_ckd/proteinuria")
if [ "$C" = "200" ]; then echo "OK n_pro"; P=$((P+1)); else echo "FAIL n_pro ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nephro_body_2.json "$H/api/nephro_ckd/anemia_ckd")
if [ "$C" = "200" ]; then echo "OK n_an"; P=$((P+1)); else echo "FAIL n_an ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nephro_body_3.json "$H/api/nephro_ckd/mineral_bone")
if [ "$C" = "200" ]; then echo "OK n_mbd"; P=$((P+1)); else echo "FAIL n_mbd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nephro_body_4.json "$H/api/nephro_ckd/ckd_progression")
if [ "$C" = "200" ]; then echo "OK n_prog"; P=$((P+1)); else echo "FAIL n_prog ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nephro_body_5.json "$H/api/nephro_da/av_fistula")
if [ "$C" = "200" ]; then echo "OK n_af"; P=$((P+1)); else echo "FAIL n_af ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nephro_body_6.json "$H/api/nephro_da/av_graft")
if [ "$C" = "200" ]; then echo "OK n_graft"; P=$((P+1)); else echo "FAIL n_graft ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nephro_body_7.json "$H/api/nephro_da/tunneled_catheter")
if [ "$C" = "200" ]; then echo "OK n_tc"; P=$((P+1)); else echo "FAIL n_tc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nephro_body_8.json "$H/api/nephro_da/peritoneal_access")
if [ "$C" = "200" ]; then echo "OK n_pd"; P=$((P+1)); else echo "FAIL n_pd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nephro_body_9.json "$H/api/nephro_da/access_monitoring")
if [ "$C" = "200" ]; then echo "OK n_mon"; P=$((P+1)); else echo "FAIL n_mon ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nephro_body_10.json "$H/api/nephro_immuno/crossmatch_transplant")
if [ "$C" = "200" ]; then echo "OK n_xm"; P=$((P+1)); else echo "FAIL n_xm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nephro_body_11.json "$H/api/nephro_immuno/donor_specific_ab")
if [ "$C" = "200" ]; then echo "OK n_dsa"; P=$((P+1)); else echo "FAIL n_dsa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nephro_body_12.json "$H/api/nephro_immuno/immunosuppression")
if [ "$C" = "200" ]; then echo "OK n_imm"; P=$((P+1)); else echo "FAIL n_imm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nephro_body_13.json "$H/api/nephro_immuno/rejection_surveillance")
if [ "$C" = "200" ]; then echo "OK n_rej"; P=$((P+1)); else echo "FAIL n_rej ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nephro_body_14.json "$H/api/nephro_immuno/graft_loss")
if [ "$C" = "200" ]; then echo "OK n_gl"; P=$((P+1)); else echo "FAIL n_gl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nephro_body_15.json "$H/api/nephro_ext/glomerulonephritis")
if [ "$C" = "200" ]; then echo "OK n_gn"; P=$((P+1)); else echo "FAIL n_gn ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nephro_body_16.json "$H/api/nephro_ext/polycystic_kidney")
if [ "$C" = "200" ]; then echo "OK n_pk"; P=$((P+1)); else echo "FAIL n_pk ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nephro_body_17.json "$H/api/nephro_ext/electrolyte_acid_base")
if [ "$C" = "200" ]; then echo "OK n_eab"; P=$((P+1)); else echo "FAIL n_eab ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nephro_body_18.json "$H/api/nephro_ext/stone_clinic")
if [ "$C" = "200" ]; then echo "OK n_st"; P=$((P+1)); else echo "FAIL n_st ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nephro_body_19.json "$H/api/nephro_ext/hypertensive_renal")
if [ "$C" = "200" ]; then echo "OK n_ht"; P=$((P+1)); else echo "FAIL n_ht ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nephro_body_20.json "$H/api/nephro_nutrition/renal_dietitian")
if [ "$C" = "200" ]; then echo "OK n_rd"; P=$((P+1)); else echo "FAIL n_rd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nephro_body_21.json "$H/api/nephro_nutrition/potassium_management")
if [ "$C" = "200" ]; then echo "OK n_k"; P=$((P+1)); else echo "FAIL n_k ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nephro_body_22.json "$H/api/nephro_nutrition/phosphorus_binding")
if [ "$C" = "200" ]; then echo "OK n_p"; P=$((P+1)); else echo "FAIL n_p ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nephro_body_23.json "$H/api/nephro_nutrition/dialysis_diet_adequacy")
if [ "$C" = "200" ]; then echo "OK n_adeq"; P=$((P+1)); else echo "FAIL n_adeq ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/nephro_body_24.json "$H/api/nephro_nutrition/fluid_management")
if [ "$C" = "200" ]; then echo "OK n_fm"; P=$((P+1)); else echo "FAIL n_fm ($C)"; fi
echo PASS=$P FAIL=$F
