#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ophth_body_0.json "$H/api/ophth_glaucoma/glaucoma_diagnosis")
if [ "$C" = "200" ]; then echo "OK o_gd"; P=$((P+1)); else echo "FAIL o_gd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ophth_body_1.json "$H/api/ophth_glaucoma/glaucoma_treatment")
if [ "$C" = "200" ]; then echo "OK o_gt"; P=$((P+1)); else echo "FAIL o_gt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ophth_body_2.json "$H/api/ophth_glaucoma/glaucoma_progression")
if [ "$C" = "200" ]; then echo "OK o_gp"; P=$((P+1)); else echo "FAIL o_gp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ophth_body_3.json "$H/api/ophth_glaucoma/glaucoma_surgery")
if [ "$C" = "200" ]; then echo "OK o_gs"; P=$((P+1)); else echo "FAIL o_gs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ophth_body_4.json "$H/api/ophth_glaucoma/iop_monitoring")
if [ "$C" = "200" ]; then echo "OK o_iop"; P=$((P+1)); else echo "FAIL o_iop ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ophth_body_5.json "$H/api/ophth_retina/amd")
if [ "$C" = "200" ]; then echo "OK o_amd"; P=$((P+1)); else echo "FAIL o_amd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ophth_body_6.json "$H/api/ophth_retina/diabetic_retinopathy")
if [ "$C" = "200" ]; then echo "OK o_dr"; P=$((P+1)); else echo "FAIL o_dr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ophth_body_7.json "$H/api/ophth_retina/retinal_detachment")
if [ "$C" = "200" ]; then echo "OK o_rd"; P=$((P+1)); else echo "FAIL o_rd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ophth_body_8.json "$H/api/ophth_retina/macular_edema")
if [ "$C" = "200" ]; then echo "OK o_me"; P=$((P+1)); else echo "FAIL o_me ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ophth_body_9.json "$H/api/ophth_retina/intravitreal_injection")
if [ "$C" = "200" ]; then echo "OK o_ivi"; P=$((P+1)); else echo "FAIL o_ivi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ophth_body_10.json "$H/api/ophth_cornea/keratitis")
if [ "$C" = "200" ]; then echo "OK o_ker"; P=$((P+1)); else echo "FAIL o_ker ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ophth_body_11.json "$H/api/ophth_cornea/corneal_ulcer")
if [ "$C" = "200" ]; then echo "OK o_cu"; P=$((P+1)); else echo "FAIL o_cu ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ophth_body_12.json "$H/api/ophth_cornea/dry_eye")
if [ "$C" = "200" ]; then echo "OK o_de"; P=$((P+1)); else echo "FAIL o_de ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ophth_body_13.json "$H/api/ophth_cornea/keratoconus")
if [ "$C" = "200" ]; then echo "OK o_kc"; P=$((P+1)); else echo "FAIL o_kc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ophth_body_14.json "$H/api/ophth_cornea/corneal_transplant")
if [ "$C" = "200" ]; then echo "OK o_ct"; P=$((P+1)); else echo "FAIL o_ct ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ophth_body_15.json "$H/api/ophth_plas/ptosis")
if [ "$C" = "200" ]; then echo "OK o_pto"; P=$((P+1)); else echo "FAIL o_pto ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ophth_body_16.json "$H/api/ophth_plas/blepharitis")
if [ "$C" = "200" ]; then echo "OK o_ble"; P=$((P+1)); else echo "FAIL o_ble ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ophth_body_17.json "$H/api/ophth_plas/orbital_tumor")
if [ "$C" = "200" ]; then echo "OK o_ot"; P=$((P+1)); else echo "FAIL o_ot ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ophth_body_18.json "$H/api/ophth_plas/thyroid_eye_disease")
if [ "$C" = "200" ]; then echo "OK o_ted"; P=$((P+1)); else echo "FAIL o_ted ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ophth_body_19.json "$H/api/ophth_plas/lacrimal_obstruction")
if [ "$C" = "200" ]; then echo "OK o_lo"; P=$((P+1)); else echo "FAIL o_lo ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ophth_body_20.json "$H/api/ophth_no/optic_neuritis")
if [ "$C" = "200" ]; then echo "OK o_on"; P=$((P+1)); else echo "FAIL o_on ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ophth_body_21.json "$H/api/ophth_no/papilledema")
if [ "$C" = "200" ]; then echo "OK o_pe"; P=$((P+1)); else echo "FAIL o_pe ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ophth_body_22.json "$H/api/ophth_no/visual_field_defect")
if [ "$C" = "200" ]; then echo "OK o_vfd"; P=$((P+1)); else echo "FAIL o_vfd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ophth_body_23.json "$H/api/ophth_no/double_vision")
if [ "$C" = "200" ]; then echo "OK o_dv"; P=$((P+1)); else echo "FAIL o_dv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ophth_body_24.json "$H/api/ophth_no/anterior_ischemic_optic_neuropathy")
if [ "$C" = "200" ]; then echo "OK o_aion"; P=$((P+1)); else echo "FAIL o_aion ($C)"; fi
echo PASS=$P FAIL=$F
