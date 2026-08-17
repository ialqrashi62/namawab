#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/hematology_body_0.json "$H/api/hem_transfusion/blood_type_screen")
if [ "$C" = "200" ]; then echo "OK h_bts"; P=$((P+1)); else echo "FAIL h_bts ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/hematology_body_1.json "$H/api/hem_transfusion/crossmatch")
if [ "$C" = "200" ]; then echo "OK h_cm"; P=$((P+1)); else echo "FAIL h_cm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/hematology_body_2.json "$H/api/hem_transfusion/prbc_transfusion")
if [ "$C" = "200" ]; then echo "OK h_prbc"; P=$((P+1)); else echo "FAIL h_prbc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/hematology_body_3.json "$H/api/hem_transfusion/platelet_transfusion")
if [ "$C" = "200" ]; then echo "OK h_plt"; P=$((P+1)); else echo "FAIL h_plt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/hematology_body_4.json "$H/api/hem_transfusion/plasma_transfusion")
if [ "$C" = "200" ]; then echo "OK h_pls"; P=$((P+1)); else echo "FAIL h_pls ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/hematology_body_5.json "$H/api/hem_apheresis/plasmapheresis")
if [ "$C" = "200" ]; then echo "OK h_plm"; P=$((P+1)); else echo "FAIL h_plm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/hematology_body_6.json "$H/api/hem_apheresis/plateletpheresis")
if [ "$C" = "200" ]; then echo "OK h_ptp"; P=$((P+1)); else echo "FAIL h_ptp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/hematology_body_7.json "$H/api/hem_apheresis/rbc_exchange")
if [ "$C" = "200" ]; then echo "OK h_rbcx"; P=$((P+1)); else echo "FAIL h_rbcx ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/hematology_body_8.json "$H/api/hem_apheresis/leukapheresis")
if [ "$C" = "200" ]; then echo "OK h_lkp"; P=$((P+1)); else echo "FAIL h_lkp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/hematology_body_9.json "$H/api/hem_apheresis/lipid_apheresis")
if [ "$C" = "200" ]; then echo "OK h_lip"; P=$((P+1)); else echo "FAIL h_lip ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/hematology_body_10.json "$H/api/hem_stem_cell/mobilization")
if [ "$C" = "200" ]; then echo "OK h_mob"; P=$((P+1)); else echo "FAIL h_mob ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/hematology_body_11.json "$H/api/hem_stem_cell/collection")
if [ "$C" = "200" ]; then echo "OK h_col"; P=$((P+1)); else echo "FAIL h_col ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/hematology_body_12.json "$H/api/hem_stem_cell/processing")
if [ "$C" = "200" ]; then echo "OK h_prc"; P=$((P+1)); else echo "FAIL h_prc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/hematology_body_13.json "$H/api/hem_stem_cell/cryopreservation")
if [ "$C" = "200" ]; then echo "OK h_cry"; P=$((P+1)); else echo "FAIL h_cry ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/hematology_body_14.json "$H/api/hem_stem_cell/engraftment")
if [ "$C" = "200" ]; then echo "OK h_eng"; P=$((P+1)); else echo "FAIL h_eng ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/hematology_body_15.json "$H/api/hem_cell_therapy/car_t_recovery")
if [ "$C" = "200" ]; then echo "OK h_car"; P=$((P+1)); else echo "FAIL h_car ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/hematology_body_16.json "$H/api/hem_cell_therapy/til_therapy")
if [ "$C" = "200" ]; then echo "OK h_til"; P=$((P+1)); else echo "FAIL h_til ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/hematology_body_17.json "$H/api/hem_cell_therapy/nk_cell")
if [ "$C" = "200" ]; then echo "OK h_nk"; P=$((P+1)); else echo "FAIL h_nk ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/hematology_body_18.json "$H/api/hem_cell_therapy/regenerative_injection")
if [ "$C" = "200" ]; then echo "OK h_reg"; P=$((P+1)); else echo "FAIL h_reg ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/hematology_body_19.json "$H/api/hem_cell_therapy/autologous_therapy")
if [ "$C" = "200" ]; then echo "OK h_aut"; P=$((P+1)); else echo "FAIL h_aut ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/hematology_body_20.json "$H/api/hem_coag_ext/factor_replacement")
if [ "$C" = "200" ]; then echo "OK h_fac"; P=$((P+1)); else echo "FAIL h_fac ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/hematology_body_21.json "$H/api/hem_coag_ext/inh_concentrate")
if [ "$C" = "200" ]; then echo "OK h_inh"; P=$((P+1)); else echo "FAIL h_inh ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/hematology_body_22.json "$H/api/hem_coag_ext/antithrombin")
if [ "$C" = "200" ]; then echo "OK h_at"; P=$((P+1)); else echo "FAIL h_at ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/hematology_body_23.json "$H/api/hem_coag_ext/protein_c_pathway")
if [ "$C" = "200" ]; then echo "OK h_pc"; P=$((P+1)); else echo "FAIL h_pc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/hematology_body_24.json "$H/api/hem_coag_ext/dic_management")
if [ "$C" = "200" ]; then echo "OK h_dic"; P=$((P+1)); else echo "FAIL h_dic ($C)"; fi
echo PASS=$P FAIL=$F
