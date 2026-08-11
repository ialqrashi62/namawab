#!/bin/bash
# Test all 53 dept health endpoints
for d in allergy anesthesia audiology burn_unit cardiac_rehab ccu chaplaincy cicu ctu dermatology dialysis epilepsy fetal_medicine genetics headache hematology icu immunology infection_control infectious_disease ivf maternal_fetal memory_clinic movement movement_disorders multiple_sclerosis neonatology neuro_oncology neurosurgery nicu nuclear_medicine nutrition occupational_therapy pain_management palliative_care pathology physiotherapy picu plastic_surgery psychiatry pulmonary_rehab radiology rehabilitation sleep_medicine social_work speech_therapy stroke_unit thoracic_surgery transplant trauma_surgery urology vascular_surgery wound_care; do
    code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3000/api/$d/health")
    echo "$code $d"
done
