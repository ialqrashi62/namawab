# Brain: OBGYN (Obstetrics & Gynecology)
## Cognitive Core: Ultra-Specialized Clinical Precision (Wave 3)

### 1. Clinical Domain & Scope
- **Focus**: High-Risk Obstetrics, IVF/ICSI Lab, Maternal-Fetal Medicine (MFM), and Advanced Gynecology.
- **Key Workflows**:
    - **IVF/ICSI**: Oocyte retrieval, embryo grading (Gardner scale), transfer cycles, and cryopreservation.
    - **MFM**: Fetal growth velocity, Doppler studies (Umbilical artery), and high-risk pregnancy screening.
    - **Obstetrics**: Labor/Delivery tracking, APGAR scoring, and postpartum hemorrhage (PPH) protocols.
    - **Gynecology**: Endometriosis mapping, Hysterectomy registries, and Menopause management.

### 2. RAG Strategy & Global Guidelines
- **Primary Sources**:
    - ACOG (American College of Obstetricians and Gynecologists).
    - RCOG (Royal College of Obstetricians and Gynaecologists).
    - ISSRM (International Society for Research in Menstrual Disorders).
    - WHO Maternal and Newborn Health Guidelines.
- **VectorMine Indexing**:
    - `obgyn_ivf_protocols`: Mapping stimulation/trigger protocols to patient age/AMH.
    - `fetal_growth_curves`: Standardized growth percentiles (Intergrowth-21st).

### 3. Technical Implementation (Backend)
- **Database Tables**: `obgyn_ivf_lab_logs`, `maternal_fetal_metrics`, `obgyn_delivery_logs`, `gyn_oncology_registry`.
- **API Endpoints**:
    - `POST /api/obgyn/ivf/embryo-grade`: Log embryo quality and stage.
    - `POST /api/obgyn/mfm/growth-track`: Record fetal biometry and percentiles.
    - `POST /api/obgyn/delivery/apgar`: Log APGAR scores and delivery metrics.

### 4. UI/UX (Stitch Google Design System)
- **Visuals**: 4D Ultrasound Data Overlay, Fetal Growth Curve Chart, Ovulation Cycle Calendar.
- **Components**: `EmbryoGradePicker`, `FetalGrowthChart`, `DeliveryTimeline`.

### 5. Safety Rails & Compliance
- **Critical Alert**: Trigger "Maternal Emergency" if BP $> 160/110$ (Preeclampsia) or "Fetal Distress" if heart rate drops below 110 bpm.
- **Tenant Isolation**: `requireTenantScope` on all obgyn-logs.
- **Audit**: Hash-chained logs for all IVF embryo transfers.
