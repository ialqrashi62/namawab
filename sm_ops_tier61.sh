#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ops_body_0.json "$H/api/ops_facility/facility_maintenance")
if [ "$C" = "200" ]; then echo "OK o_facm"; P=$((P+1)); else echo "FAIL o_facm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ops_body_1.json "$H/api/ops_facility/housekeeping")
if [ "$C" = "200" ]; then echo "OK o_hsek"; P=$((P+1)); else echo "FAIL o_hsek ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ops_body_2.json "$H/api/ops_facility/security_log")
if [ "$C" = "200" ]; then echo "OK o_secl"; P=$((P+1)); else echo "FAIL o_secl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ops_body_3.json "$H/api/ops_facility/utility_mgmt")
if [ "$C" = "200" ]; then echo "OK o_utm"; P=$((P+1)); else echo "FAIL o_utm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ops_body_4.json "$H/api/ops_facility/parking_access")
if [ "$C" = "200" ]; then echo "OK o_pka"; P=$((P+1)); else echo "FAIL o_pka ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ops_body_5.json "$H/api/ops_assets/asset_inventory")
if [ "$C" = "200" ]; then echo "OK o_ainv"; P=$((P+1)); else echo "FAIL o_ainv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ops_body_6.json "$H/api/ops_assets/asset_depreciation")
if [ "$C" = "200" ]; then echo "OK o_adep"; P=$((P+1)); else echo "FAIL o_adep ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ops_body_7.json "$H/api/ops_assets/asset_disposal")
if [ "$C" = "200" ]; then echo "OK o_adis"; P=$((P+1)); else echo "FAIL o_adis ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ops_body_8.json "$H/api/ops_assets/asset_audit")
if [ "$C" = "200" ]; then echo "OK o_aaud"; P=$((P+1)); else echo "FAIL o_aaud ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ops_body_9.json "$H/api/ops_assets/asset_maintenance")
if [ "$C" = "200" ]; then echo "OK o_amnt"; P=$((P+1)); else echo "FAIL o_amnt ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ops_body_10.json "$H/api/ops_vendor/vendor_master")
if [ "$C" = "200" ]; then echo "OK o_vmas"; P=$((P+1)); else echo "FAIL o_vmas ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ops_body_11.json "$H/api/ops_vendor/vendor_po")
if [ "$C" = "200" ]; then echo "OK o_vpo"; P=$((P+1)); else echo "FAIL o_vpo ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ops_body_12.json "$H/api/ops_vendor/vendor_invoice")
if [ "$C" = "200" ]; then echo "OK o_vinv"; P=$((P+1)); else echo "FAIL o_vinv ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ops_body_13.json "$H/api/ops_vendor/vendor_scorecard")
if [ "$C" = "200" ]; then echo "OK o_vsc"; P=$((P+1)); else echo "FAIL o_vsc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ops_body_14.json "$H/api/ops_vendor/vendor_compliance")
if [ "$C" = "200" ]; then echo "OK o_vcom"; P=$((P+1)); else echo "FAIL o_vcom ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ops_body_15.json "$H/api/ops_legal/contract_management")
if [ "$C" = "200" ]; then echo "OK o_cmgr"; P=$((P+1)); else echo "FAIL o_cmgr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ops_body_16.json "$H/api/ops_legal/legal_hold")
if [ "$C" = "200" ]; then echo "OK o_lhld"; P=$((P+1)); else echo "FAIL o_lhld ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ops_body_17.json "$H/api/ops_legal/gdpr_request")
if [ "$C" = "200" ]; then echo "OK o_gdpr"; P=$((P+1)); else echo "FAIL o_gdpr ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ops_body_18.json "$H/api/ops_legal/incident_report")
if [ "$C" = "200" ]; then echo "OK o_irep"; P=$((P+1)); else echo "FAIL o_irep ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ops_body_19.json "$H/api/ops_legal/insurance_claim")
if [ "$C" = "200" ]; then echo "OK o_iclm"; P=$((P+1)); else echo "FAIL o_iclm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ops_body_20.json "$H/api/ops_quality/quality_metrics")
if [ "$C" = "200" ]; then echo "OK o_qmet"; P=$((P+1)); else echo "FAIL o_qmet ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ops_body_21.json "$H/api/ops_quality/quality_audit")
if [ "$C" = "200" ]; then echo "OK o_qaud"; P=$((P+1)); else echo "FAIL o_qaud ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ops_body_22.json "$H/api/ops_quality/quality_complaint")
if [ "$C" = "200" ]; then echo "OK o_qcmp"; P=$((P+1)); else echo "FAIL o_qcmp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ops_body_23.json "$H/api/ops_quality/quality_improvement")
if [ "$C" = "200" ]; then echo "OK o_qimp"; P=$((P+1)); else echo "FAIL o_qimp ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ops_body_24.json "$H/api/ops_quality/quality_benchmark")
if [ "$C" = "200" ]; then echo "OK o_qben"; P=$((P+1)); else echo "FAIL o_qben ($C)"; fi
echo PASS=$P FAIL=$F
