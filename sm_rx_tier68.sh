#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rx_body_0.json "$H/api/rx_clinical/medication_reconciliation_prior_to_admission")
if [ "$C" = "200" ]; then echo "OK r_mra"; P=$((P+1)); else echo "FAIL r_mra ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rx_body_1.json "$H/api/rx_clinical/medication_reconciliation_discharge")
if [ "$C" = "200" ]; then echo "OK r_mrd"; P=$((P+1)); else echo "FAIL r_mrd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rx_body_2.json "$H/api/rx_clinical/medication_review_high_risk")
if [ "$C" = "200" ]; then echo "OK r_mhr"; P=$((P+1)); else echo "FAIL r_mhr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rx_body_3.json "$H/api/rx_clinical/antimicrobial_stewardship")
if [ "$C" = "200" ]; then echo "OK r_ams"; P=$((P+1)); else echo "FAIL r_ams ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rx_body_4.json "$H/api/rx_clinical/opioid_stewardship")
if [ "$C" = "200" ]; then echo "OK r_ops"; P=$((P+1)); else echo "FAIL r_ops ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rx_body_5.json "$H/api/rx_oncology/chemo_order")
if [ "$C" = "200" ]; then echo "OK r_co"; P=$((P+1)); else echo "FAIL r_co ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rx_body_6.json "$H/api/rx_oncology/chemo_pre_administration")
if [ "$C" = "200" ]; then echo "OK r_cpa"; P=$((P+1)); else echo "FAIL r_cpa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rx_body_7.json "$H/api/rx_oncology/chemo_administration")
if [ "$C" = "200" ]; then echo "OK r_ca"; P=$((P+1)); else echo "FAIL r_ca ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rx_body_8.json "$H/api/rx_oncology/chemo_toxicity")
if [ "$C" = "200" ]; then echo "OK r_ct"; P=$((P+1)); else echo "FAIL r_ct ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rx_body_9.json "$H/api/rx_oncology/chemo_followup")
if [ "$C" = "200" ]; then echo "OK r_cf"; P=$((P+1)); else echo "FAIL r_cf ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rx_body_10.json "$H/api/rx_specialty/biologic_order")
if [ "$C" = "200" ]; then echo "OK r_bo"; P=$((P+1)); else echo "FAIL r_bo ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rx_body_11.json "$H/api/rx_specialty/biologic_infusion")
if [ "$C" = "200" ]; then echo "OK r_bi"; P=$((P+1)); else echo "FAIL r_bi ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rx_body_12.json "$H/api/rx_specialty/biologic_monitoring")
if [ "$C" = "200" ]; then echo "OK r_bm"; P=$((P+1)); else echo "FAIL r_bm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rx_body_13.json "$H/api/rx_specialty/biologic_immunogenicity")
if [ "$C" = "200" ]; then echo "OK r_bim"; P=$((P+1)); else echo "FAIL r_bim ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rx_body_14.json "$H/api/rx_specialty/specialty_appeals")
if [ "$C" = "200" ]; then echo "OK r_sa"; P=$((P+1)); else echo "FAIL r_sa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rx_body_15.json "$H/api/rx_clinical_pharm/pharmacokinetics_dosing")
if [ "$C" = "200" ]; then echo "OK r_pkd"; P=$((P+1)); else echo "FAIL r_pkd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rx_body_16.json "$H/api/rx_clinical_pharm/renal_dosing")
if [ "$C" = "200" ]; then echo "OK r_rd"; P=$((P+1)); else echo "FAIL r_rd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rx_body_17.json "$H/api/rx_clinical_pharm/hepatic_dosing")
if [ "$C" = "200" ]; then echo "OK r_hd"; P=$((P+1)); else echo "FAIL r_hd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rx_body_18.json "$H/api/rx_clinical_pharm/warfarin_dosing")
if [ "$C" = "200" ]; then echo "OK r_wd"; P=$((P+1)); else echo "FAIL r_wd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rx_body_19.json "$H/api/rx_clinical_pharm/vancomycin_dosing")
if [ "$C" = "200" ]; then echo "OK r_vd"; P=$((P+1)); else echo "FAIL r_vd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rx_body_20.json "$H/api/rx_informatics/smart_pump_library")
if [ "$C" = "200" ]; then echo "OK r_spl"; P=$((P+1)); else echo "FAIL r_spl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rx_body_21.json "$H/api/rx_informatics/drug_shortage")
if [ "$C" = "200" ]; then echo "OK r_ds"; P=$((P+1)); else echo "FAIL r_ds ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rx_body_22.json "$H/api/rx_informatics/recalls")
if [ "$C" = "200" ]; then echo "OK r_rec"; P=$((P+1)); else echo "FAIL r_rec ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rx_body_23.json "$H/api/rx_informatics/clinical_decision_alerts")
if [ "$C" = "200" ]; then echo "OK r_cda"; P=$((P+1)); else echo "FAIL r_cda ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/rx_body_24.json "$H/api/rx_informatics/drug_information_query")
if [ "$C" = "200" ]; then echo "OK r_diq"; P=$((P+1)); else echo "FAIL r_diq ($C)"; fi
echo PASS=$P FAIL=$F
