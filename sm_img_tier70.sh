#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_0.json "$H/api/img_proc/ct_scan")
if [ "$C" = "200" ]; then echo "OK i_ct"; P=$((P+1)); else echo "FAIL i_ct ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_1.json "$H/api/img_proc/mri_scan")
if [ "$C" = "200" ]; then echo "OK i_mri"; P=$((P+1)); else echo "FAIL i_mri ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_2.json "$H/api/img_proc/xray")
if [ "$C" = "200" ]; then echo "OK i_xr"; P=$((P+1)); else echo "FAIL i_xr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_3.json "$H/api/img_proc/ultrasound_extended")
if [ "$C" = "200" ]; then echo "OK i_us"; P=$((P+1)); else echo "FAIL i_us ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_4.json "$H/api/img_proc/nuclear_med")
if [ "$C" = "200" ]; then echo "OK i_nm"; P=$((P+1)); else echo "FAIL i_nm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_5.json "$H/api/img_interp/radiologist_report")
if [ "$C" = "200" ]; then echo "OK i_rr"; P=$((P+1)); else echo "FAIL i_rr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_6.json "$H/api/img_interp/coding_radiology")
if [ "$C" = "200" ]; then echo "OK i_cr"; P=$((P+1)); else echo "FAIL i_cr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_7.json "$H/api/img_interp/critical_finding_followup")
if [ "$C" = "200" ]; then echo "OK i_cff"; P=$((P+1)); else echo "FAIL i_cff ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_8.json "$H/api/img_interp/second_opinion")
if [ "$C" = "200" ]; then echo "OK i_so"; P=$((P+1)); else echo "FAIL i_so ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_9.json "$H/api/img_interp/ai_imaging_review")
if [ "$C" = "200" ]; then echo "OK i_ai"; P=$((P+1)); else echo "FAIL i_ai ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_10.json "$H/api/img_admin/image_ordering")
if [ "$C" = "200" ]; then echo "OK i_io"; P=$((P+1)); else echo "FAIL i_io ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_11.json "$H/api/img_admin/scheduling_imaging")
if [ "$C" = "200" ]; then echo "OK i_si"; P=$((P+1)); else echo "FAIL i_si ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_12.json "$H/api/img_admin/image_archive")
if [ "$C" = "200" ]; then echo "OK i_ia"; P=$((P+1)); else echo "FAIL i_ia ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_13.json "$H/api/img_admin/image_share")
if [ "$C" = "200" ]; then echo "OK i_ish"; P=$((P+1)); else echo "FAIL i_ish ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_14.json "$H/api/img_admin/image_quality_check")
if [ "$C" = "200" ]; then echo "OK i_iq"; P=$((P+1)); else echo "FAIL i_iq ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_15.json "$H/api/img_specialty/cardiac_imaging")
if [ "$C" = "200" ]; then echo "OK i_cim"; P=$((P+1)); else echo "FAIL i_cim ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_16.json "$H/api/img_specialty/neuro_imaging")
if [ "$C" = "200" ]; then echo "OK i_ni"; P=$((P+1)); else echo "FAIL i_ni ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_17.json "$H/api/img_specialty/musculoskeletal_imaging")
if [ "$C" = "200" ]; then echo "OK i_mski"; P=$((P+1)); else echo "FAIL i_mski ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_18.json "$H/api/img_specialty/interventional_radiology")
if [ "$C" = "200" ]; then echo "OK i_irr"; P=$((P+1)); else echo "FAIL i_irr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_19.json "$H/api/img_specialty/breast_imaging")
if [ "$C" = "200" ]; then echo "OK i_bi"; P=$((P+1)); else echo "FAIL i_bi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_20.json "$H/api/img_safety/contrast_adverse_event")
if [ "$C" = "200" ]; then echo "OK i_cae"; P=$((P+1)); else echo "FAIL i_cae ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_21.json "$H/api/img_safety/imaging_dose")
if [ "$C" = "200" ]; then echo "OK i_id"; P=$((P+1)); else echo "FAIL i_id ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_22.json "$H/api/img_safety/radiology_safety_check")
if [ "$C" = "200" ]; then echo "OK i_rsc"; P=$((P+1)); else echo "FAIL i_rsc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_23.json "$H/api/img_safety/pregnancy_check")
if [ "$C" = "200" ]; then echo "OK i_pch"; P=$((P+1)); else echo "FAIL i_pch ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/img_body_24.json "$H/api/img_safety/contrast_screening")
if [ "$C" = "200" ]; then echo "OK i_cs"; P=$((P+1)); else echo "FAIL i_cs ($C)"; fi
echo PASS=$P FAIL=$F
