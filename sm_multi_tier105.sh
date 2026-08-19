#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/scheduling_v2/appointment_booking|sch_0"
  "1|/api/scheduling_v2/resource_allocation|sch_1"
  "2|/api/scheduling_v2/waitlist|sch_2"
  "3|/api/scheduling_v2/reminder|sch_3"
  "4|/api/scheduling_v2/no_show|sch_4"
  "5|/api/billing_ext_v2/charge_capture|bi_5"
  "6|/api/billing_ext_v2/claim_submission|bi_6"
  "7|/api/billing_ext_v2/denial_management|bi_7"
  "8|/api/billing_ext_v2/payment_posting|bi_8"
  "9|/api/billing_ext_v2/patient_statement|bi_9"
  "10|/api/insurance_v2/eligibility_check|in_10"
  "11|/api/insurance_v2/authorization|in_11"
  "12|/api/insurance_v2/benefit_verification|in_12"
  "13|/api/insurance_v2/referral|in_13"
  "14|/api/insurance_v2/pre_certification|in_14"
  "15|/api/administrative_v2/document_management|ad_15"
  "16|/api/administrative_v2/correspondence|ad_16"
  "17|/api/administrative_v2/task_management|ad_17"
  "18|/api/administrative_v2/inbox_message|ad_18"
  "19|/api/administrative_v2/notification|ad_19"
  "20|/api/communication_v2/secure_messaging|co_20"
  "21|/api/communication_v2/telehealth_video|co_21"
  "22|/api/communication_v2/patient_portal|co_22"
  "23|/api/communication_v2/care_team|co_23"
  "24|/api/communication_v2/patient_engagement|co_24"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/multi_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"