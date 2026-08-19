#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
declare -a TESTS=(
  "0|/api/derm_general_v2/skin_exam|dg_e"
  "1|/api/derm_general_v2/rash_eval|dg_r"
  "2|/api/derm_general_v2/skin_biopsy|dg_b"
  "3|/api/derm_general_v2/derm_visit|dg_v"
  "4|/api/derm_general_v2/topical_prescription|dg_t"
  "5|/api/derm_onc_v2/melanoma_eval|do_m"
  "6|/api/derm_onc_v2/bcc_scc|do_b"
  "7|/api/derm_onc_v2/lymphoma|do_l"
  "8|/api/derm_onc_v2/keratinocyte|do_k"
  "9|/api/derm_onc_v2/derm_chemo|do_c"
  "10|/api/derm_immuno_v2/psoriasis|di_p"
  "11|/api/derm_immuno_v2/eczema|di_e"
  "12|/api/derm_immuno_v2/dermatitis|di_d"
  "13|/api/derm_immuno_v2/acne|di_a"
  "14|/api/derm_immuno_v2/biologics|di_b"
  "15|/api/derm_cosmetic_v2/botox|dc_b"
  "16|/api/derm_cosmetic_v2/chemical_peel|dc_c"
  "17|/api/derm_cosmetic_v2/laser|dc_l"
  "18|/api/derm_cosmetic_v2/fillers|dc_f"
  "19|/api/derm_cosmetic_v2/micro_needling|dc_m"
  "20|/api/derm_peds_v2/pediatric_eczema|dp_pe"
  "21|/api/derm_peds_v2/congenital_nevi|dp_cn"
  "22|/api/derm_peds_v2/birthmarks|dp_bm"
  "23|/api/derm_peds_v2/atopic|dp_at"
  "24|/api/derm_peds_v2/papular|dp_pa"
)
for T in "${TESTS[@]}"; do
  IDX=$(echo "$T" | cut -d'|' -f1); URL=$(echo "$T" | cut -d'|' -f2); TAG=$(echo "$T" | cut -d'|' -f3)
  C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/derm_body_${IDX}.json "$H${URL}")
  if [ "$C" = "200" ]; then echo "OK ${TAG}"; P=$((P+1)); else echo "FAIL ${TAG} ($C)"; F=$((F+1)); fi
done
echo "PASS=${P} FAIL=${F}"
