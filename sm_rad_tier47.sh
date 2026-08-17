#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rad_body_0.json "$H/api/rad_body/ct_chest")
if [ "$C" = "200" ]; then echo "OK r_chs"; P=$((P+1)); else echo "FAIL r_chs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rad_body_1.json "$H/api/rad_body/mri_abdomen")
if [ "$C" = "200" ]; then echo "OK r_abd"; P=$((P+1)); else echo "FAIL r_abd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rad_body_2.json "$H/api/rad_body/ct_abdomen")
if [ "$C" = "200" ]; then echo "OK r_cta"; P=$((P+1)); else echo "FAIL r_cta ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rad_body_3.json "$H/api/rad_body/us_abdomen")
if [ "$C" = "200" ]; then echo "OK r_us"; P=$((P+1)); else echo "FAIL r_us ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rad_body_4.json "$H/api/rad_body/us_pelvis")
if [ "$C" = "200" ]; then echo "OK r_pel"; P=$((P+1)); else echo "FAIL r_pel ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rad_body_5.json "$H/api/rad_neuro/ct_head")
if [ "$C" = "200" ]; then echo "OK r_hea"; P=$((P+1)); else echo "FAIL r_hea ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rad_body_6.json "$H/api/rad_neuro/mri_brain")
if [ "$C" = "200" ]; then echo "OK r_mbr"; P=$((P+1)); else echo "FAIL r_mbr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rad_body_7.json "$H/api/rad_neuro/mri_spine")
if [ "$C" = "200" ]; then echo "OK r_msp"; P=$((P+1)); else echo "FAIL r_msp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rad_body_8.json "$H/api/rad_neuro/ct_angiography")
if [ "$C" = "200" ]; then echo "OK r_cta"; P=$((P+1)); else echo "FAIL r_cta ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rad_body_9.json "$H/api/rad_neuro/mra_head")
if [ "$C" = "200" ]; then echo "OK r_mra"; P=$((P+1)); else echo "FAIL r_mra ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rad_body_10.json "$H/api/rad_cardio/ct_angio_coronary")
if [ "$C" = "200" ]; then echo "OK r_ctc"; P=$((P+1)); else echo "FAIL r_ctc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rad_body_11.json "$H/api/rad_cardio/cardiac_mri")
if [ "$C" = "200" ]; then echo "OK r_cmr"; P=$((P+1)); else echo "FAIL r_cmr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rad_body_12.json "$H/api/rad_cardio/echo_stress")
if [ "$C" = "200" ]; then echo "OK r_str"; P=$((P+1)); else echo "FAIL r_str ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rad_body_13.json "$H/api/rad_cardio/mri_perfusion")
if [ "$C" = "200" ]; then echo "OK r_per"; P=$((P+1)); else echo "FAIL r_per ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rad_body_14.json "$H/api/rad_cardio/nuclear_cardiology")
if [ "$C" = "200" ]; then echo "OK r_nuc"; P=$((P+1)); else echo "FAIL r_nuc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rad_body_15.json "$H/api/rad_gu_gi/ct_urogram")
if [ "$C" = "200" ]; then echo "OK r_uro"; P=$((P+1)); else echo "FAIL r_uro ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rad_body_16.json "$H/api/rad_gu_gi/mri_prostate")
if [ "$C" = "200" ]; then echo "OK r_prs"; P=$((P+1)); else echo "FAIL r_prs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rad_body_17.json "$H/api/rad_gu_gi/mri_rectum")
if [ "$C" = "200" ]; then echo "OK r_rec"; P=$((P+1)); else echo "FAIL r_rec ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rad_body_18.json "$H/api/rad_gu_gi/defecography")
if [ "$C" = "200" ]; then echo "OK r_def"; P=$((P+1)); else echo "FAIL r_def ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rad_body_19.json "$H/api/rad_gu_gi/urodynamics_imaging")
if [ "$C" = "200" ]; then echo "OK r_udn"; P=$((P+1)); else echo "FAIL r_udn ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rad_body_20.json "$H/api/rad_interv/biopsy_ct_guided")
if [ "$C" = "200" ]; then echo "OK r_bio"; P=$((P+1)); else echo "FAIL r_bio ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rad_body_21.json "$H/api/rad_interv/drainage_catheter")
if [ "$C" = "200" ]; then echo "OK r_drn"; P=$((P+1)); else echo "FAIL r_drn ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rad_body_22.json "$H/api/rad_interv/embolization_therapy")
if [ "$C" = "200" ]; then echo "OK r_emb"; P=$((P+1)); else echo "FAIL r_emb ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rad_body_23.json "$H/api/rad_interv/tumor_ablation")
if [ "$C" = "200" ]; then echo "OK r_abl"; P=$((P+1)); else echo "FAIL r_abl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rad_body_24.json "$H/api/rad_interv/vertebroplasty")
if [ "$C" = "200" ]; then echo "OK r_vrt"; P=$((P+1)); else echo "FAIL r_vrt ($C)"; fi
echo PASS=$P FAIL=$F
