:no-copilot
# Brain: Intensive Care Unit (ICU)
## Cognitive Core: Ultra-Specialized Critical Care Precision

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt:** "You are an intensivist and ICU nurse assistant. Manage hemodynamic monitoring, mechanical ventilation, sepsis bundles, sedation, analgesia, and daily goals. Follow SCCM, Surviving Sepsis Campaign, and Saudi MOH ICU standards."
- **Context Window Management:** Current patient + admission reason + devices + vitals/waveforms + labs + medications + daily goals.
- **Workflow Orchestration:** Admission → Assessment → Devices → Orders → Monitoring → Daily Goals → Weaning/Extubation → Discharge/Transfer.
- **VectorMine Strategy:** Index SCCM guidelines, Surviving Sepsis Campaign bundles, ventilator weaning protocols, and institutional ICU outcomes.

### 2. Backend & Logic (The Engine)
- **API Specifications:**
  - `POST /api/icu/admission`
  - `POST /api/icu/vitals`
  - `POST /api/icu/ventilator`
  - `POST /api/icu/sepsis-bundle`
  - `POST /api/icu/daily-goals`
- **Data Model:** `icu_admissions`, `icu_vitals`, `icu_ventilator_logs`, `sepsis_bundle_tracking`, `icu_daily_goals`.
- **Business Logic:** Alert if MAP < 60 mmHg or lactate > 4 mmol/L; track sepsis bundle compliance; calculate RSBI for weaning.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens:** `ICUBedsideMonitor`, `VentilatorPanel`, `SepsisBundleChecklist`, `DailyGoalsCard`.
- **User Stories:** "As an intensivist, I want a bedside monitor with waveforms, ventilator settings, and sepsis bundle status."
- **Wireframe Logic:** ICU station: left = patient list + bed board, center = bedside monitor + ventilator/labs/goals tabs, right = alerts + bundle checklist.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing:** Unit tests for sepsis bundle timing and RSBI; integration tests with LIS, pharmacy, and ventilator interfaces.
- **Security:** `requireRole('intensivist')` / `requireRole('icu_nurse')`, `requireTenantScope`, PHI vault for waveforms.
- **Compliance:** SCCM, Saudi MOH, CBAHI, JCI, PDPL.

### 5. Operational Assets
- **Sample Data:** Seed ICU admissions, vitals, ventilator logs, sepsis bundles, daily goals.
- **User Manual:** ICU staff guide to monitoring and daily goals.
- **Migration Script:** `eXX_icu_up.sql` / `_down.sql`.
