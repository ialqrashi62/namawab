#!/usr/bin/env bash
# filepath: sm_multi_tier165.sh
BASE="http://127.0.0.1:3000/api"
PASS=0; FAIL=0
chk(){
  local name="$1"; local route="$2"; local body="$3"
  local code
  code=$(curl -s -o /dev/null -w "%{http_code}" -H "Content-Type: application/json" -H "X-Tenant-Id: t1" -X POST "$BASE/$route" -d @"$body")
  if [ "$code" = "200" ]; then echo "OK $name ($code)"; PASS=$((PASS+1)); else echo "FAIL $name ($code)"; FAIL=$((FAIL+1)); fi
}
chk "gn-vip"     "eng/tier165-gen-771/variant_interpret"    /tmp/multi_body_0.json
chk "gn-pgx"     "eng/tier165-gen-771/pharmacogenomics"     /tmp/multi_body_1.json
chk "gn-rdd"     "eng/tier165-gen-771/rare_disease"         /tmp/multi_body_2.json
chk "gn-fcs"     "eng/tier165-gen-771/family_cascade"       /tmp/multi_body_3.json
chk "gn-grp"     "eng/tier165-gen-771/gen_result_report"    /tmp/multi_body_4.json
chk "ph-cpm"     "eng/tier165-phr-772/cyp_metabolizer"      /tmp/multi_body_5.json
chk "ph-drg"     "eng/tier165-phr-772/drug_response"        /tmp/multi_body_6.json
chk "ph-dsa"     "eng/tier165-phr-772/dose_adjust"          /tmp/multi_body_7.json
chk "ph-adr"     "eng/tier165-phr-772/adverse_risk"         /tmp/multi_body_8.json
chk "ph-rsl"     "eng/tier165-phr-772/regimen_select"       /tmp/multi_body_9.json
chk "bi-sqa"     "eng/tier165-bio-773/sequence_alignment"   /tmp/multi_body_10.json
chk "bi-vcl"     "eng/tier165-bio-773/variant_calling"      /tmp/multi_body_11.json
chk "bi-pca"     "eng/tier165-bio-773/pca_analysis"         /tmp/multi_body_12.json
chk "bi-gex"     "eng/tier165-bio-773/gene_expression"      /tmp/multi_body_13.json
chk "bi-pth"     "eng/tier165-bio-773/pathway_analysis"     /tmp/multi_body_14.json
chk "et-csc"     "eng/tier165-eth-774/consent_capacity"     /tmp/multi_body_15.json
chk "et-ele"     "eng/tier165-eth-774/end_of_life_ethics"   /tmp/multi_body_16.json
chk "et-rfc"     "eng/tier165-eth-774/refusal_care"         /tmp/multi_body_17.json
chk "et-rec"     "eng/tier165-eth-774/research_ethics"      /tmp/multi_body_18.json
chk "et-rsa"     "eng/tier165-eth-774/resource_allocation"  /tmp/multi_body_19.json
echo "SMOKE: PASS=$PASS FAIL=$FAIL"