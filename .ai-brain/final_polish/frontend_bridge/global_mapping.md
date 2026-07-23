# Frontend-to-Backend Bridge: Global Mapping
## Stitch Google UI $\rightarrow$ API Integration Matrix

### 1. Design Philosophy
- **UI Framework**: Stitch Google (Futuristic, High-Contrast, Data-Dense).
- **Interaction Model**: Single Page Application (SPA) with dynamic component injection.
- **Data Flow**: Frontend Component $\rightarrow$ `app.js` (Request Handler) $\rightarrow$ `server.js` (API Route) $\rightarrow$ PostgreSQL (RLS Protected).

### 2. Component-to-API Mapping Table

| Department | UI Component | Input Field / Action | API Route | Method | Expected Payload/Response |
|---|---|---|---|---|---|
| **Cardiology** | `EchoParamsForm` | `ef_percent`, `lv_dimension` | `/api/cardiology/echo-params` | POST | `{ef_percent: float, ...}` $\rightarrow$ `{success: true, id: uuid}` |
| **Cardiology** | `CathLabPanel` | `access_site`, `fluoroscopy_time` | `/api/cardiology/cath-lab/procedure` | POST | `{access_site: string, ...}` $\rightarrow$ `{success: true}` |
| **Respiratory** | `PFTChart` | `fev1_actual`, `fvc_actual` | `/api/respiratory/pft` | POST | `{fev1_actual: float, ...}` $\rightarrow$ `{gold_stage: int, ratio: float}` |
| **Surgery (Gen)** | `SurgicalChecklist` | `phase`, `checklist_completed` | `/api/surgery/safety-checklist` | POST | `{phase: string, ...}` $\rightarrow$ `{success: true}` |
| **Neurosurgery** | `ICPMonitor` | `icp_value`, `map_value` | `/api/neurosurgery/icp-log` | POST | `{icp_value: float, ...}` $\rightarrow$ `{cpp_value: float, alert: string\|null}` |
| **Orthopedics** | `JointAlignmentTool` | `alignment_angle` | `/api/orthopedics/joint-replacement` | POST | `{alignment_angle: float, ...}` $\rightarrow$ `{alert: string\|null}` |
| **Ophthalmology** | `IOLCalculator` | `calculated_power`, `actual_power` | `/api/ophthalmology/iol-calc` | POST | `{calculated_power: float, ...}` $\rightarrow$ `{alert: string\|null}` |
| **ENT** | `AudiogramPlotter` | `frequency_hz`, `threshold_db` | `/api/ent/audiogram` | POST | `{frequency_hz: int[], ...}` $\rightarrow$ `{alert: string\|null}` |
| **Urology** | `StoneMapper` | `stone_location`, `stone_size_mm` | `/api/urology/stone-log` | POST | `{stone_location: string, ...}` $\rightarrow$ `{success: true}` |
| **Plastic/Burns** | `TBSA_Calculator` | `tbsa_percent`, `fluid_volume_ml` | `/api/plastic-burns/burn-resuscitation` | POST | `{tbsa_percent: float, ...}` $\rightarrow$ `{alert: string\|null}` |
| **OBGYN** | `EmbryoGrader` | `embryo_grade`, `embryo_stage` | `/api/obgyn/ivf/embryo-grade` | POST | `{embryo_grade: string, ...}` $\rightarrow$ `{success: true}` |
| **OBGYN** | `FetalGrowthChart` | `bpd_mm`, `hc_mm`, `ac_mm` | `/api/obgyn/mfm/growth-track` | POST | `{bpd_mm: float, ...}` $\rightarrow$ `{growth_percentile: float, alert: string\|null}` |
| **Pediatrics** | `NICUVentPanel` | `fio2_percent`, `peep_cmh2o` | `/api/nicu/vent-settings` | POST | `{fio2_percent: float, ...}` $\rightarrow$ `{alert: string\|null}` |
| **Peds Subspec** | `PedsCardioEcho` | `aortic_zscore`, `pulmonary_zscore` | `/api/peds-sub/cardio` | POST | `{aortic_zscore: float, ...}` $\rightarrow$ `{alert: string\|null}` |
| **Diagnostics** | `MolecularSeqViewer` | `gene_mutation`, `vaf` | `/api/diagnostics/molecular` | POST | `{gene_mutation: string, ...}` $\rightarrow$ `{alert: string\|null}` |
| **Critical Care** | `SepsisBundleCheck` | `lactate_initial`, `antibiotics_administered` | `/api/critical-care/sepsis-bundle` | POST | `{lactate_initial: float, ...}` $\rightarrow$ `{alert: string\|null}` |
| **Rehab** | `ROM_AnglePicker` | `joint_name`, `rom_degrees` | `/api/rehab/physical` | POST | `{rom_degrees: float, ...}` $\rightarrow$ `{success: true}` |
| **Admin/Ops** | `ResourceDashboard` | `bed_occupancy_percent` | `/api/admin/resource-opt` | POST | `{bed_occupancy_percent: float, ...}` $\rightarrow$ `{alert: string\|null}` |
| **Rare Spec** | `NanoDeliveryLog` | `nanoparticle_type`, `toxicity_score` | `/api/nano/delivery-log` | POST | `{toxicity_score: float, ...}` $\rightarrow$ `{alert: string\|null}` |

### 3. Implementation Blueprint for `app.js`
To bridge these, the frontend must implement a generic `apiRequest` wrapper:
```javascript
async function apiRequest(endpoint, payload, role = 'doctor') {
    const response = await fetch(`/api${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });
    return await response.json();
}
```
Each Stitch Google component will call this wrapper, passing the specific endpoint and payload defined in the matrix above.
