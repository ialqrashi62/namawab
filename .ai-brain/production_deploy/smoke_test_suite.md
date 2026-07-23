# Final Quality Assurance (Smoke Test Suite)
## 🧪 Post-Deployment Validation Checklist

This suite must be executed immediately after the `deploy_system.sh` script completes.

### 1. Security & Isolation (The Red-Line Test)
- [ ] **Tenant Leak Test**: Log in as `Tenant_A` $\rightarrow$ Attempt to access a patient record from `Tenant_B` via direct URL.
    - **Expected**: `403 Forbidden` or `404 Not Found`.
- [ ] **RLS Verification**: Run `SELECT count(*) FROM patients;` as the `nama_medical_app` role without a session context.
    - **Expected**: `0` rows returned (RLS must block all access without `tenant_id`).
- [ ] **JWT Expiry**: Verify that the session expires after the configured TTL and requires a refresh token.

### 2. API Functional Integrity (The 10-Wave Sweep)
Verify that the following "Golden Path" endpoints return `200 OK`:
- [ ] **Wave 1 (ER)**: `GET /api/er/triage`
- [ ] la-Surgical logic for Cardiology: `GET /api/cardio/ecg-analysis`
- [ ] **Wave 5 (ICU)**: `POST /api/critical-care/hemodynamics`
- [ ] **Wave 7 (Admin)**: `GET /api/admin/resources`
- [ ] **Wave 10 (Rare)**: `POST /api/rare-specialties/registry`

### 3. UI/UX Performance (Stitch Google Audit)
- [ ] **LCP (Largest Contentful Paint)**: Ensure the main dashboard loads in $< 2.5$ seconds.
- [ ] **RTL/LTR Toggle**: Verify that the Arabic interface renders correctly without layout shifts.
- [ ] **Responsiveness**: Test the `SurgicalChecklist` on a tablet device (iPad Pro size).

### 4. RAG Intelligence Validation
- [ ] **Citation Accuracy**: Trigger a "Sepsis Alert" $\rightarrow$ Verify the citation points to the correct page of the SSC 2021 PDF.
- [ ] **Latency**: Ensure the RAG response is generated in $< 3$ seconds.
