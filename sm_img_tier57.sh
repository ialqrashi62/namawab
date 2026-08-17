#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_0.json "$H/api/img_advanced/pet_ct")
if [ "$C" = "200" ]; then echo "OK i_pct"; P=$((P+1)); else echo "FAIL i_pct ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_1.json "$H/api/img_advanced/pet_mri")
if [ "$C" = "200" ]; then echo "OK i_pmr"; P=$((P+1)); else echo "FAIL i_pmr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_2.json "$H/api/img_advanced/spect_ct")
if [ "$C" = "200" ]; then echo "OK i_spc"; P=$((P+1)); else echo "FAIL i_spc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_3.json "$H/api/img_advanced/mr_spectroscopy")
if [ "$C" = "200" ]; then echo "OK i_mrs"; P=$((P+1)); else echo "FAIL i_mrs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_4.json "$H/api/img_advanced/fusion_imaging")
if [ "$C" = "200" ]; then echo "OK i_fus"; P=$((P+1)); else echo "FAIL i_fus ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_5.json "$H/api/img_us_ext/us_musculoskeletal")
if [ "$C" = "200" ]; then echo "OK i_msk"; P=$((P+1)); else echo "FAIL i_msk ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_6.json "$H/api/img_us_ext/us_thyroid")
if [ "$C" = "200" ]; then echo "OK i_thy"; P=$((P+1)); else echo "FAIL i_thy ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_7.json "$H/api/img_us_ext/us_vascular_dvt")
if [ "$C" = "200" ]; then echo "OK i_dvt"; P=$((P+1)); else echo "FAIL i_dvt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_8.json "$H/api/img_us_ext/us_obstetric_advanced")
if [ "$C" = "200" ]; then echo "OK i_obs"; P=$((P+1)); else echo "FAIL i_obs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_9.json "$H/api/img_us_ext/us_contrast")
if [ "$C" = "200" ]; then echo "OK i_cus"; P=$((P+1)); else echo "FAIL i_cus ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_10.json "$H/api/img_breast/mammography_diagnostic")
if [ "$C" = "200" ]; then echo "OK i_mam"; P=$((P+1)); else echo "FAIL i_mam ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_11.json "$H/api/img_breast/breast_mri")
if [ "$C" = "200" ]; then echo "OK i_bmr"; P=$((P+1)); else echo "FAIL i_bmr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_12.json "$H/api/img_breast/breast_ultrasound")
if [ "$C" = "200" ]; then echo "OK i_bus"; P=$((P+1)); else echo "FAIL i_bus ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_13.json "$H/api/img_breast/breast_biopsy_stereo")
if [ "$C" = "200" ]; then echo "OK i_bbs"; P=$((P+1)); else echo "FAIL i_bbs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_14.json "$H/api/img_breast/breast_ductogram")
if [ "$C" = "200" ]; then echo "OK i_bdg"; P=$((P+1)); else echo "FAIL i_bdg ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_15.json "$H/api/img_msk/joint_mri")
if [ "$C" = "200" ]; then echo "OK i_jmr"; P=$((P+1)); else echo "FAIL i_jmr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_16.json "$H/api/img_msk/spine_imaging")
if [ "$C" = "200" ]; then echo "OK i_spi"; P=$((P+1)); else echo "FAIL i_spi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_17.json "$H/api/img_msk/bone_scan")
if [ "$C" = "200" ]; then echo "OK i_bsc"; P=$((P+1)); else echo "FAIL i_bsc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_18.json "$H/api/img_msk/three_tesla_mri")
if [ "$C" = "200" ]; then echo "OK i_3tm"; P=$((P+1)); else echo "FAIL i_3tm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_19.json "$H/api/img_msk/arthrogram_mri")
if [ "$C" = "200" ]; then echo "OK i_art"; P=$((P+1)); else echo "FAIL i_art ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_20.json "$H/api/img_emergent/ct_trauma_full")
if [ "$C" = "200" ]; then echo "OK i_ctt"; P=$((P+1)); else echo "FAIL i_ctt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_21.json "$H/api/img_emergent/ct_angio_emergent")
if [ "$C" = "200" ]; then echo "OK i_cte"; P=$((P+1)); else echo "FAIL i_cte ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_22.json "$H/api/img_emergent/ct_perfusion")
if [ "$C" = "200" ]; then echo "OK i_ctp"; P=$((P+1)); else echo "FAIL i_ctp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_23.json "$H/api/img_emergent/xr_portable_intraop")
if [ "$C" = "200" ]; then echo "OK i_xrp"; P=$((P+1)); else echo "FAIL i_xrp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_24.json "$H/api/img_emergent/mri_emergent")
if [ "$C" = "200" ]; then echo "OK i_mre"; P=$((P+1)); else echo "FAIL i_mre ($C)"; fi
echo PASS=$P FAIL=$F
