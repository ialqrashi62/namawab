<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
module_id: ER-005
name: "Stroke Unit / Code Stroke"
parent: "Emergency"
code: ER
generated: 2026-07-24
loop_status: "L1 DRAFT (P3-B)"
template_ref: TPL:DEPT
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# Stroke Unit / Code Stroke — ER-005

## Mission
Acute stroke: door-to-needle <60 min, door-to-puncture (mechanical thrombectomy) <90 min, drip-and-ship, telemedicine stroke.

## Scope
Code Stroke activation, NIHSS, CT head 25 min, CT angio, tPA eligibility, mechanical thrombectomy eligibility, drip-and-ship, stroke unit admission, secondary prevention, AF detection, dysphagia screen.

## Top 10 Conditions: 1. Acute ischemic stroke (I63.9) 2. TIA (G45.9) 3. Intracerebral hemorrhage (I61.9) 4. SAH (I60.9) 5. CVST (I67.6) 6. Cryptogenic stroke (I63.9) 7. AF-related stroke (I48.91) 8. Carotid dissection (I77.71) 9. Posterior circulation stroke (I63.09) 10. Pediatric stroke (I63.9)
## Top 20 Procedures: NIHSS, CT head non-contrast 70450, CT angio head/neck 70496, CT perfusion 0042T, MRI brain 70551, DWI, MR angio 70544, tPA administration (Activase J2997), mechanical thrombectomy (Merci, Solitaire), hemicraniectomy 61322, BP control, glucose check, dysphagia screen, AF monitoring 93224, TTE 93306, TEE 93312, carotid duplex 93880, telemetry, swallow eval, antiplatelet Rx, anticoagulation Rx, statin, rehabilitation referral
## Red Flags: Stroke in evolution · ICH with mass effect · Brainstem stroke · Basilar occlusion · Cerebellar stroke (hydrocephalus risk) · Malignant MCA (decompressive craniectomy) · Hemorrhagic transformation · MoyaMoya · Hyperacute AF · Air embolism (cerebral) · Venous sinus thrombosis with infarct
## Database: 7 tables, RLS-forced
## 14 endpoints, 5 LangChain chains

## Compliance: JCI/CBAHI/NPHIES/ZATCA/PDPL/HIPAA. AHA/ASA acute stroke 2018, 2021. WSO. ESO. KSA MOH stroke program.

## Engine: stroke_engine.js
NIHSSScore, ASPECTS_Score, tPAEligibilityCheck, ThrombectomyEligibility, DripAndShip, PosteriorCirculationAssessment, ICHScore, DVTProphylaxis, AFDetectionMonitoring, DysphagiaScreen

## Sub-Departments: Stroke Unit, Neuro-ICU, Telestroke, Stroke Coordinator

---
*L1 DRAFT complete.*