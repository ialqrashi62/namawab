# PULM-001 — RAG Chains

## Chain 1: PE Triage
- Wells score + D-dimer
- CTPA if positive
- Anticoagulation
- Thrombolysis if massive

## Chain 2: COPD Exacerbation
- Severity (GOLD)
- Bronchodilator
- Steroid
- Antibiotic (if infection)
- NIV (BiPAP) if respiratory failure
- Intubation if needed

## Chain 3: Asthma Exacerbation
- Severity assessment
- SABA + ipratropium
- Steroid (systemic)
- Magnesium (severe)
- NIV
- Intubation (if needed)

## Chain 4: Pleural Effusion Workup
- Diagnostic thoracentesis
- Light criteria (exudate vs transudate)
- Cell count, culture, cytology
- Chest tube (if complicated)

## Vector Indexes
- copd_protocols_idx
- asthma_protocols_idx
- pe_protocols_idx
- pneumonia_idx
- lung_cancer_idx
- ild_idx
