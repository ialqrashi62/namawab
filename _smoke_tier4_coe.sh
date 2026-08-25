#!/bin/bash
echo "--- coestroke /hyperacute ---"
curl -s -m 5 -X POST -H "Content-Type: application/json" -d '{"patient_id":"p1","last_known_well_min":120,"nihss_total":12,"ct_angiography_lvo":true}' http://127.0.0.1:3000/api/coestroke/hyperacute | head -c 250
echo
echo "--- coecard /stemi ---"
curl -s -m 5 -X POST -H "Content-Type: application/json" -d '{"patient_id":"p1","age":65,"ef":28,"sts":4.2}' http://127.0.0.1:3000/api/coecard/stemi | head -c 250
echo
echo "--- coeonc (auth check) ---"
curl -s -m 5 -X POST -H "Content-Type: application/json" -d '{"patient_id":"p1","site":"lung","stage":3,"molecular":["EGFR"]}' http://127.0.0.1:3000/api/coeonc/tumor-board
echo
echo "--- coetx /evaluate ---"
curl -s -m 5 -X POST -H "Content-Type: application/json" -d '{"patient_id":"p1","organ":"kidney","meld":22,"cci":4}' http://127.0.0.1:3000/api/coetx/evaluate | head -c 250
echo
echo "--- coetrauma /triage ---"
curl -s -m 5 -X POST -H "Content-Type: application/json" -d '{"patient_id":"p1","mechanism":"mvc","sbp":85,"gcs":9}' http://127.0.0.1:3000/api/coetrauma/triage | head -c 250
echo
echo "--- coebariatric /eligibility ---"
curl -s -m 5 -X POST -H "Content-Type: application/json" -d '{"patient_id":"p1","bmi":42,"comorbidities":2}' http://127.0.0.1:3000/api/coebariatric/eligibility | head -c 250
echo
echo "--- coegeria (auth check) ---"
curl -s -m 5 -X POST -H "Content-Type: application/json" -d '{"patient_id":"p1","age":82,"polypharmacy":9,"adl":3}' http://127.0.0.1:3000/api/coegeria/cga
echo
echo "--- coepeds (auth check) ---"
curl -s -m 5 -X POST -H "Content-Type: application/json" -d '{"patient_id":"p1","age":6,"family_present":true}' http://127.0.0.1:3000/api/coepeds/family-rounds
echo
