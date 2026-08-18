#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_0.json "$H/api/lab_specimen/specimen_collection")
if [ "$C" = "200" ]; then echo "OK l_sc"; P=$((P+1)); else echo "FAIL l_sc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_1.json "$H/api/lab_specimen/specimen_tracking")
if [ "$C" = "200" ]; then echo "OK l_st"; P=$((P+1)); else echo "FAIL l_st ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_2.json "$H/api/lab_specimen/chain_of_custody")
if [ "$C" = "200" ]; then echo "OK l_co"; P=$((P+1)); else echo "FAIL l_co ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_3.json "$H/api/lab_specimen/specimen_storage")
if [ "$C" = "200" ]; then echo "OK l_ss"; P=$((P+1)); else echo "FAIL l_ss ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_4.json "$H/api/lab_specimen/specimen_disposal")
if [ "$C" = "200" ]; then echo "OK l_sd"; P=$((P+1)); else echo "FAIL l_sd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_5.json "$H/api/lab_result/result_entry")
if [ "$C" = "200" ]; then echo "OK l_re"; P=$((P+1)); else echo "FAIL l_re ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_6.json "$H/api/lab_result/critical_result")
if [ "$C" = "200" ]; then echo "OK l_cr"; P=$((P+1)); else echo "FAIL l_cr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_7.json "$H/api/lab_result/result_review")
if [ "$C" = "200" ]; then echo "OK l_rr"; P=$((P+1)); else echo "FAIL l_rr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_8.json "$H/api/lab_result/result_correction")
if [ "$C" = "200" ]; then echo "OK l_rco"; P=$((P+1)); else echo "FAIL l_rco ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_9.json "$H/api/lab_result/result_release")
if [ "$C" = "200" ]; then echo "OK l_rre"; P=$((P+1)); else echo "FAIL l_rre ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_10.json "$H/api/lab_micro/culture_setup")
if [ "$C" = "200" ]; then echo "OK l_cs"; P=$((P+1)); else echo "FAIL l_cs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_11.json "$H/api/lab_micro/gram_stain")
if [ "$C" = "200" ]; then echo "OK l_gs"; P=$((P+1)); else echo "FAIL l_gs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_12.json "$H/api/lab_micro/susceptibility")
if [ "$C" = "200" ]; then echo "OK l_su"; P=$((P+1)); else echo "FAIL l_su ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_13.json "$H/api/lab_micro/organism_id")
if [ "$C" = "200" ]; then echo "OK l_oid"; P=$((P+1)); else echo "FAIL l_oid ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_14.json "$H/api/lab_micro/interpretation")
if [ "$C" = "200" ]; then echo "OK l_itp"; P=$((P+1)); else echo "FAIL l_itp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_15.json "$H/api/lab_path/biopsy_specimen")
if [ "$C" = "200" ]; then echo "OK l_bs"; P=$((P+1)); else echo "FAIL l_bs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_16.json "$H/api/lab_path/cytology")
if [ "$C" = "200" ]; then echo "OK l_cy"; P=$((P+1)); else echo "FAIL l_cy ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_17.json "$H/api/lab_path/histology")
if [ "$C" = "200" ]; then echo "OK l_hi"; P=$((P+1)); else echo "FAIL l_hi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_18.json "$H/api/lab_path/immunostain")
if [ "$C" = "200" ]; then echo "OK l_is"; P=$((P+1)); else echo "FAIL l_is ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_19.json "$H/api/lab_path/molecular_path")
if [ "$C" = "200" ]; then echo "OK l_mp"; P=$((P+1)); else echo "FAIL l_mp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_20.json "$H/api/lab_qc/calibration_verification")
if [ "$C" = "200" ]; then echo "OK l_cv"; P=$((P+1)); else echo "FAIL l_cv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_21.json "$H/api/lab_qc/quality_control")
if [ "$C" = "200" ]; then echo "OK l_qc"; P=$((P+1)); else echo "FAIL l_qc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_22.json "$H/api/lab_qc/proficiency_testing")
if [ "$C" = "200" ]; then echo "OK l_pt"; P=$((P+1)); else echo "FAIL l_pt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_23.json "$H/api/lab_qc/equipment_maintenance")
if [ "$C" = "200" ]; then echo "OK l_em"; P=$((P+1)); else echo "FAIL l_em ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/lab_body_24.json "$H/api/lab_qc/method_validation")
if [ "$C" = "200" ]; then echo "OK l_mv"; P=$((P+1)); else echo "FAIL l_mv ($C)"; fi
echo PASS=$P FAIL=$F
