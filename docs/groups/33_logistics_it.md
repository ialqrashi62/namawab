# G33 — اللوجستية والفنية (Biomed Engineering, HIT, Translation, Stats, Comms/Telemedicine)

## 0) Meta
```yaml
dept_key: "logistics_it"
group_id: "G33"
sub_units: [biomedical_engineering, calibration, prosthetics_devices,
            health_it_emr, health_it_his, pacs_archiving, cyber_security,
            medical_translation, interpretation_foreign_pts,
            health_statistics, big_data_analytics, epidemic_forecasting,
            telemedicine_consults, teleradiology]
```

## 1) System Prompt
```text
You are NamaMedical-IT/Biomed Assistant.
GUARDRAILS: HL7 v2/FHIR R5, DICOM, IHE profiles, NIST CSF, KSA NCA ECC controls, MoH eHealth.
- All device data interfaces use HL7 ORU/ADT or FHIR Observation.
- PACS uses DICOM TLS; storage encryption mandatory.
- Telemedicine: identity verification + consent + recording policy.
TOOLS: device_inventory_lookup, calibration_due, hl7_message_validate,
       fhir_resource_validate, pacs_health_check, escalate.
```

## 2) Workflow
LangGraph: classify → load(context) → rag(standards) → tools → critique.

## 3) API
| /api/v1/biomed/devices | GET,POST | inventory |
| /api/v1/biomed/calibration | POST | calibration log |
| /api/v1/biomed/maintenance | POST | PM/CM tickets |
| /api/v1/it/integration_settings | GET,POST | (extends existing) |
| /api/v1/it/audit_logs | GET | tamper-evident |
| /api/v1/translation/jobs | GET,POST | translation queue |
| /api/v1/stats/dashboards | GET | analytics views |
| /api/v1/telemed/consults | GET,POST | live + async |
| /api/v1/teleradiology/jobs | GET,POST | external read queue |

Events: `biomed.device.calibration.due`, `it.security.alert`, `telemed.consult.completed`.

## 4) Data
```sql
CREATE TABLE biomed_devices (id UUID PRIMARY KEY, asset_tag VARCHAR(40),
  type VARCHAR(40), manufacturer VARCHAR(80), model VARCHAR(80),
  serial VARCHAR(80), location VARCHAR(60),
  last_pm DATE, next_pm DATE, status VARCHAR(20));
CREATE TABLE biomed_calibrations (id UUID PRIMARY KEY, device_id UUID,
  performed_at DATETIMEOFFSET, by_user INT, result VARCHAR(20),
  cert_blob_url VARCHAR(500));
CREATE TABLE biomed_maintenance (id UUID PRIMARY KEY, device_id UUID,
  ticket_no VARCHAR(20), opened_at DATETIMEOFFSET, kind VARCHAR(20),
  description NVARCHAR(MAX), closed_at DATETIMEOFFSET);
CREATE TABLE it_audit_logs (id UUID PRIMARY KEY, actor INT,
  action VARCHAR(40), entity VARCHAR(60), entity_id VARCHAR(80),
  ts DATETIMEOFFSET, before_state NVARCHAR(MAX), after_state NVARCHAR(MAX),
  prev_hash VARCHAR(128), this_hash VARCHAR(128));
CREATE TABLE translation_jobs (id UUID PRIMARY KEY, requested_by INT,
  source_lang VARCHAR(10), target_lang VARCHAR(10), text NVARCHAR(MAX),
  translated NVARCHAR(MAX), method VARCHAR(20), confidence DECIMAL(3,2),
  reviewed_by INT, completed_at DATETIMEOFFSET);
CREATE TABLE telemed_consults (id UUID PRIMARY KEY, patient_id INT,
  doctor_id INT, started_at DATETIMEOFFSET, ended_at DATETIMEOFFSET,
  modality VARCHAR(20), recording_url VARCHAR(500), consent_given BIT);
CREATE TABLE teleradiology_jobs (id UUID PRIMARY KEY, study_id UUID,
  external_provider VARCHAR(80), sent_at DATETIMEOFFSET,
  report_received_at DATETIMEOFFSET, sla_min INT);
```

### 4.2 Vector
- `kb_standards_health_it` (HL7 FHIR R5, DICOM, IHE)
- `kb_security_controls` (NIST CSF, NCA ECC)

## 5) Frontend
Biomed asset map, PM calendar, IT integration health board,
Translation queue, Telemedicine console, Teleradiology queue, Audit explorer.

## 6-15) Infra/CI/Tests/BPMN/ERD/Stories: standard.
- BPMN: `biomed_pm_workflow.bpmn`, `it_incident_response.bpmn`, `telemed_consult.bpmn`.
```gherkin
Feature: Calibration overdue gate
  Scenario: Defibrillator calibration overdue
    Given device next_pm < today and status = active
    Then device flagged out-of-service until calibration completed
```

## 16-22) Style/i18n/Seeders/Manual/Compliance
Accent `#94a3b8`. Seeders 200 devices, 50 calibrations, 100 audit logs. PDPL, NCA ECC, MoH eHealth standards, KSA SDAIA AI ethics.

## 23) Risks
PACS storage scaling; cyber incident readiness; HL7 interface drift; AI model governance + bias monitoring.
