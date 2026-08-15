# CARD-303_ONCO — Workflow & Orchestration

## Phase 1: Pre-Treatment CV Risk Assessment
- **Trigger**: New cancer diagnosis
- **Actions**: CV history, baseline echo + GLS, troponin, BNP, ECG
- **SLA**: Complete within 7 days before chemo
- **Tools**: Echo lab, Cardio-Onc clinic

## Phase 2: Cardiotoxicity Risk Stratification
- **Trigger**: Pre-treatment
- **Actions**: Apply HFA-ICOS risk score
- **SLA**: Score within 24 hours
- **Tools**: Cardio-Onc risk calculator

## Phase 3: Cardioprotection Decision
- **Trigger**: High-risk patient identified
- **Actions**: Decide on primary/secondary prevention
- **SLA**: Decision before chemo starts
- **Tools**: Decision support engine

## Phase 4: Anthracycline Monitoring
- **Trigger**: Patient on anthracycline
- **Actions**: Echo every 3 months + troponin
- **SLA**: Echo within 3 months
- **Tools**: Echo scheduler, biomarker tracking

## Phase 5: Trastuzumab Monitoring
- **Trigger**: HER2+ breast cancer on trastuzumab
- **Actions**: Echo every 3 months
- **SLA**: Echo within 3 months
- **Tools**: Echo lab, oncology tracker

## Phase 6: ICI Myocarditis Detection
- **Trigger**: ICI therapy started
- **Actions**: ECG + troponin baseline + every cycle
- **SLA**: Within 24 hours of any cycle
- **Tools**: ECG scheduler, biomarker protocol

## Phase 7: VTE Management
- **Trigger**: Cancer-associated VTE
- **Actions**: Initiate DOAC, monitor
- **SLA**: Within 24 hours
- **Tools**: Anticoagulation clinic

## Phase 8: HTN Management (VEGF inhibitors)
- **Trigger**: VEGF inhibitor started
- **Actions**: Weekly BP first cycle
- **SLA**: Same-day for severe HTN
- **Tools**: BP monitoring, antihypertensive

## Phase 9: Cardiac Amyloid Workup
- **Trigger**: Suspected amyloid (HCM phenotype, AL/ATTR)
- **Actions**: Pyrophosphate scan, biopsy
- **SLA**: Within 30 days
- **Tools**: Nuclear medicine, biopsy

## Phase 10: Survivorship
- **Trigger**: Cancer in remission
- **Actions**: Annual CV risk assessment
- **SLA**: Lifetime
- **Tools**: Survivorship clinic

## BPMN Diagram
See `26_business_flow.md`.

## Orchestration Engines
- **Risk Stratification Engine**: HFA-ICOS + CARDIOTOX
- **Surveillance Scheduler**: Echo/biomarker timing
- **ICI Myocarditis Detection**: Troponin/EF trends
- **VTE Treatment**: DOAC vs LMWH
- **Cardioprotection Decision**: Per-risk
- **Drug-Drug Interaction**: Cardio-Onc specific
- **Survivorship Tracker**: Long-term CV outcomes
