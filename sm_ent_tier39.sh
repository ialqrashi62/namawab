#!/bin/bash
H=http://127.0.0.1:3000
P=0;F=0
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ent_body_0.json "$H/api/ent_oto/hearing_loss")
if [ "$C" = "200" ]; then echo "OK e_hl"; P=$((P+1)); else echo "FAIL e_hl ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ent_body_1.json "$H/api/ent_oto/otitis_media")
if [ "$C" = "200" ]; then echo "OK e_om"; P=$((P+1)); else echo "FAIL e_om ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ent_body_2.json "$H/api/ent_oto/vertigo")
if [ "$C" = "200" ]; then echo "OK e_vert"; P=$((P+1)); else echo "FAIL e_vert ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ent_body_3.json "$H/api/ent_oto/tinnitus")
if [ "$C" = "200" ]; then echo "OK e_tin"; P=$((P+1)); else echo "FAIL e_tin ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ent_body_4.json "$H/api/ent_oto/cholesteatoma")
if [ "$C" = "200" ]; then echo "OK e_cho"; P=$((P+1)); else echo "FAIL e_cho ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ent_body_5.json "$H/api/ent_rhino/sinusitis")
if [ "$C" = "200" ]; then echo "OK e_sin"; P=$((P+1)); else echo "FAIL e_sin ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ent_body_6.json "$H/api/ent_rhino/nasal_polyps")
if [ "$C" = "200" ]; then echo "OK e_np"; P=$((P+1)); else echo "FAIL e_np ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ent_body_7.json "$H/api/ent_rhino/epistaxis")
if [ "$C" = "200" ]; then echo "OK e_ep"; P=$((P+1)); else echo "FAIL e_ep ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ent_body_8.json "$H/api/ent_rhino/septal_deviation")
if [ "$C" = "200" ]; then echo "OK e_sd"; P=$((P+1)); else echo "FAIL e_sd ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ent_body_9.json "$H/api/ent_rhino/allergic_rhinitis")
if [ "$C" = "200" ]; then echo "OK e_ar"; P=$((P+1)); else echo "FAIL e_ar ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ent_body_10.json "$H/api/ent_laryn/hoarseness")
if [ "$C" = "200" ]; then echo "OK e_hoar"; P=$((P+1)); else echo "FAIL e_hoar ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ent_body_11.json "$H/api/ent_laryn/vocal_cord_nodules")
if [ "$C" = "200" ]; then echo "OK e_vcn"; P=$((P+1)); else echo "FAIL e_vcn ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ent_body_12.json "$H/api/ent_laryn/subglottic_stenosis")
if [ "$C" = "200" ]; then echo "OK e_sgs"; P=$((P+1)); else echo "FAIL e_sgs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ent_body_13.json "$H/api/ent_laryn/laryngeal_cancer")
if [ "$C" = "200" ]; then echo "OK e_lc"; P=$((P+1)); else echo "FAIL e_lc ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ent_body_14.json "$H/api/ent_laryn/tracheostomy_care")
if [ "$C" = "200" ]; then echo "OK e_trach"; P=$((P+1)); else echo "FAIL e_trach ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ent_body_15.json "$H/api/ent_hn/thyroid_nodule_ent")
if [ "$C" = "200" ]; then echo "OK e_tne"; P=$((P+1)); else echo "FAIL e_tne ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ent_body_16.json "$H/api/ent_hn/salivary_gland_tumor")
if [ "$C" = "200" ]; then echo "OK e_sg"; P=$((P+1)); else echo "FAIL e_sg ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ent_body_17.json "$H/api/ent_hn/neck_mass")
if [ "$C" = "200" ]; then echo "OK e_nm"; P=$((P+1)); else echo "FAIL e_nm ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ent_body_18.json "$H/api/ent_hn/parotid_tumor")
if [ "$C" = "200" ]; then echo "OK e_par"; P=$((P+1)); else echo "FAIL e_par ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ent_body_19.json "$H/api/ent_hn/lymphadenopathy")
if [ "$C" = "200" ]; then echo "OK e_ln"; P=$((P+1)); else echo "FAIL e_ln ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ent_body_20.json "$H/api/ent_ped/adeno_tonsillectomy")
if [ "$C" = "200" ]; then echo "OK e_at"; P=$((P+1)); else echo "FAIL e_at ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ent_body_21.json "$H/api/ent_ped/recurrent_ear_infection")
if [ "$C" = "200" ]; then echo "OK e_rei"; P=$((P+1)); else echo "FAIL e_rei ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ent_body_22.json "$H/api/ent_ped/pediatric_airway")
if [ "$C" = "200" ]; then echo "OK e_pa"; P=$((P+1)); else echo "FAIL e_pa ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ent_body_23.json "$H/api/ent_ped/hearing_screen")
if [ "$C" = "200" ]; then echo "OK e_hs"; P=$((P+1)); else echo "FAIL e_hs ($C)"; fi
C=$(curl -s -o /tmp/last.json -w "%{http_code}" -X POST -H "Content-Type: application/json" -d @/tmp/ent_body_24.json "$H/api/ent_ped/pediatric_sinus")
if [ "$C" = "200" ]; then echo "OK e_ps"; P=$((P+1)); else echo "FAIL e_ps ($C)"; fi
echo PASS=$P FAIL=$F
