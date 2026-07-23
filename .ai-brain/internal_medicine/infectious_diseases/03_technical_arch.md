# 03_technical_arch.md - Infectious Diseases Technical Architecture
**Expert: Principal Software Architect**

## 1. Backend Logic
Extends `infectious_disease_engine.js`.

### A. API Specifications
- `POST /api/infectious/culture/log`: Records microbiology culture results.
- `POST /api/infectious/asp/review`: Logs antimicrobial stewardship review.
- `POST /api/infectious/ai/suggest-antibiotic`: Triggers AI antibiotic optimization.

## 2. Data Model
- `culture_results`: (id, patient_id, tenant_id, pathogen, sensitivity_profile, la_status).
- `asp_reviews`: (id, patient_id, tenant_id, original_drug, suggested_drug, justification).

## 3. Golden Access Rule
- `requireRole('infectious_disease_specialist')` enforced.
