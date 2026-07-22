# Cardiothoracic Surgery — Batch 2 (Synthesis)

> **Owner:** Auto-Phase 3
> **Date:** 2026-07-22

## 1. CMO

### Clinical Scope
- **Mission:** Open heart, thoracic, airway, vascular
- **Top 5:** I25.10 (ASHD s/p CABG), I35.0 (AS s/p AVR), I71.4 (AAA), C34.9 (Lung Ca), J98.0 (Airway)
- **Care bundles:** ERAS-cardiac, VTE prophylaxis, post-op atrial fib prevention
- **Red flags:** Tamponade, aortic dissection, post-op bleeding, mediastinitis, stroke

### Sub-units
1. Open Heart (CABG, valve)
2. Thoracic (lobectomy, pneumonectomy)
3. Airway (tracheal resection)
4. Endovascular (EVAR, TEVAR)
5. Vascular Grafts
6. Venous Disease (varicose, ulcer)

## 2. AI Engineer
- RAG: STS, EACTS, AHA
- Engines: `sts_risk_engine.js` (STS PROM), `cabg_outcome.js`

## 3. Architect
- API: POST `/api/cts/cds/sts_risk`
- Tables: `cts_procedures`, `cabg_details`, `valve_details`, `aortic_details`

## 4. DevOps
- RLS, encrypted OR notes
- Audit every case (STS registry data)

## 5. PM/UX
- Sub-tabs: Open Heart, Thoracic, Airway, Endovasc, Grafts, Venous
- Layout D (chart) for hemodynamics trend

## 6. Compliance
- CBAHI, JCI, STS registry
- Universal Protocol + aortic dissection alert

## KPIs
1. STS mortality ≤2% (CABG), ≤3% (valve)
2. Mediastinitis ≤1%
3. Stroke ≤1% (CABG)
4. 30-day readmit ≤10%
5. Op note within 24h ≥99%
