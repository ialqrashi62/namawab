# Brain: OB/GYN & Pediatrics Suite
## Cognitive Core: Maternal, Neonatal, and Child Health

### 1. Prompt Engineering (The Cognitive Layer)
- **System Prompt**: "You are an obstetrician/gynecologist and pediatrician assistant. Manage antenatal care, labor and delivery, postpartum, gynecology, newborn care, pediatric growth, immunization, and pediatric subspecialty referrals. Follow ACOG, RCOG, AAP, WHO, and Saudi MOH guidelines."
- **Context Window Management**: Current pregnancy/child + maternal history + prior pregnancies + delivery record + neonatal data + growth charts.
- **Workflow Orchestration**: Antenatal → Intrapartum (Partogram) → Delivery → Postpartum → Newborn/NICU → Pediatric follow-up → Immunization.
- **VectorMine Strategy**: Index ACOG/RCOG obstetric guidelines, AAP/WHO neonatal and pediatric guidelines, Saudi MOH immunization schedule, and institutional obstetric outcomes.

### 2. Backend & Logic (The Engine)
- **API Specifications**:
  - `POST /api/obgyn/antenatal-visit`
  - `POST /api/obgyn/partogram`
  - `POST /api/obgyn/delivery`
  - `POST /api/pediatrics/growth`
  - `POST /api/pediatrics/immunization`
- **Data Model**: `obgyn_antenatal_visits`, `obgyn_partograms`, `obgyn_deliveries`, `pediatric_growth_logs`, `immunization_records`.
- **Business Logic**: APGAR auto-calculation; growth percentile against WHO charts; immunization due alerts; high-risk pregnancy flags.

### 3. Frontend / UI-UX (The Interface)
- **Stitch Tokens**: `PartogramChart`, `APGARPanel`, `GrowthChart`, `ImmunizationTimeline`, `MotherBabyLink`.
- **User Stories**: "As an obstetrician, I want a Partogram with alerts for prolonged labor and fetal distress."
- **Wireframe Logic**: OB/GYN-Peds hub: left = maternal/child list, center = pregnancy/pediatric tabs, right = alerts and immunization schedule.

### 4. Infrastructure & Quality (The Guardrails)
- **Testing**: Unit tests for APGAR, growth percentiles, immunization scheduling; integration tests with NICU and pediatric subspecialties.
- **Security**: `requireRole('obstetrician')` / `requireRole('pediatrician')` / `requireRole('midwife')`, `requireTenantScope`, PHI vault for fetal imaging.
- **Compliance**: JCI newborn identification, Saudi PDPL, CBAHI maternal/neonatal safety.

### 5. Operational Assets
- **Sample Data**: Seed antenatal visits, Partograms, deliveries, growth logs, immunization records.
- **User Manual**: OB/GYN and pediatric staff guide.
- **Migration Script**: `eXX_obgyn_peds_hub_up.sql` / `_down.sql`.
