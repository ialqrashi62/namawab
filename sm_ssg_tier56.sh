#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ssg_body_0.json "$H/api/surg_neuro/craniotomy")
if [ "$C" = "200" ]; then echo "OK s_cra"; P=$((P+1)); else echo "FAIL s_cra ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ssg_body_1.json "$H/api/surg_neuro/spinal_fusion_neuro")
if [ "$C" = "200" ]; then echo "OK s_sfn"; P=$((P+1)); else echo "FAIL s_sfn ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ssg_body_2.json "$H/api/surg_neuro/tumor_resection_brain")
if [ "$C" = "200" ]; then echo "OK s_tum"; P=$((P+1)); else echo "FAIL s_tum ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ssg_body_3.json "$H/api/surg_neuro/vascular_neuro")
if [ "$C" = "200" ]; then echo "OK s_vas"; P=$((P+1)); else echo "FAIL s_vas ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ssg_body_4.json "$H/api/surg_neuro/functional_neurosurg")
if [ "$C" = "200" ]; then echo "OK s_fun"; P=$((P+1)); else echo "FAIL s_fun ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ssg_body_5.json "$H/api/surg_plastic/reconstruction_free_flap")
if [ "$C" = "200" ]; then echo "OK s_re"; P=$((P+1)); else echo "FAIL s_re ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ssg_body_6.json "$H/api/surg_plastic/cosmetic_rhinoplasty")
if [ "$C" = "200" ]; then echo "OK s_rhi"; P=$((P+1)); else echo "FAIL s_rhi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ssg_body_7.json "$H/api/surg_plastic/breast_reconstruction")
if [ "$C" = "200" ]; then echo "OK s_br"; P=$((P+1)); else echo "FAIL s_br ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ssg_body_8.json "$H/api/surg_plastic/hand_surgery")
if [ "$C" = "200" ]; then echo "OK s_hn"; P=$((P+1)); else echo "FAIL s_hn ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ssg_body_9.json "$H/api/surg_plastic/burn_reconstruction")
if [ "$C" = "200" ]; then echo "OK s_bur"; P=$((P+1)); else echo "FAIL s_bur ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ssg_body_10.json "$H/api/surg_urology/prostatectomy")
if [ "$C" = "200" ]; then echo "OK s_pro"; P=$((P+1)); else echo "FAIL s_pro ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ssg_body_11.json "$H/api/surg_urology/nephrectomy")
if [ "$C" = "200" ]; then echo "OK s_nep"; P=$((P+1)); else echo "FAIL s_nep ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ssg_body_12.json "$H/api/surg_urology/cystectomy")
if [ "$C" = "200" ]; then echo "OK s_cys"; P=$((P+1)); else echo "FAIL s_cys ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ssg_body_13.json "$H/api/surg_urology/ureteroscopy")
if [ "$C" = "200" ]; then echo "OK s_ure"; P=$((P+1)); else echo "FAIL s_ure ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ssg_body_14.json "$H/api/surg_urology/laser_prostate")
if [ "$C" = "200" ]; then echo "OK s_las"; P=$((P+1)); else echo "FAIL s_las ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ssg_body_15.json "$H/api/surg_ent_surg/thyroidectomy")
if [ "$C" = "200" ]; then echo "OK s_thy"; P=$((P+1)); else echo "FAIL s_thy ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ssg_body_16.json "$H/api/surg_ent_surg/parathyroidectomy")
if [ "$C" = "200" ]; then echo "OK s_par"; P=$((P+1)); else echo "FAIL s_par ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ssg_body_17.json "$H/api/surg_ent_surg/neck_dissection")
if [ "$C" = "200" ]; then echo "OK s_nec"; P=$((P+1)); else echo "FAIL s_nec ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ssg_body_18.json "$H/api/surg_ent_surg/tonsillectomy_bleeding")
if [ "$C" = "200" ]; then echo "OK s_tnb"; P=$((P+1)); else echo "FAIL s_tnb ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ssg_body_19.json "$H/api/surg_ent_surg/sinus_surgery")
if [ "$C" = "200" ]; then echo "OK s_sin"; P=$((P+1)); else echo "FAIL s_sin ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ssg_body_20.json "$H/api/surg_thoracic/lobectomy_lung")
if [ "$C" = "200" ]; then echo "OK s_lob"; P=$((P+1)); else echo "FAIL s_lob ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ssg_body_21.json "$H/api/surg_thoracic/pneumonectomy")
if [ "$C" = "200" ]; then echo "OK s_pne"; P=$((P+1)); else echo "FAIL s_pne ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ssg_body_22.json "$H/api/surg_thoracic/wedge_resection")
if [ "$C" = "200" ]; then echo "OK s_wed"; P=$((P+1)); else echo "FAIL s_wed ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ssg_body_23.json "$H/api/surg_thoracic/mediastinoscopy")
if [ "$C" = "200" ]; then echo "OK s_med"; P=$((P+1)); else echo "FAIL s_med ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ssg_body_24.json "$H/api/surg_thoracic/esophagectomy")
if [ "$C" = "200" ]; then echo "OK s_eso"; P=$((P+1)); else echo "FAIL s_eso ($C)"; fi
echo PASS=$P FAIL=$F
