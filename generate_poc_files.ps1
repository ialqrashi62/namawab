# AUTOPILOT POC PowerShell Generator
# يقرأ محتوى الملفات من chat context (محفوظ في snippets) ويكتبها دفعة واحدة
# تشغيل: pwsh -File generate_poc_files.ps1

$ErrorActionPreference = "Stop"
$root = "c:\Users\ice\Desktop\NMEDCALVSCODE\.ai-brain\02_MODULES_NEW\POC"

# === ملف 3: 01_clinical_workflows.md (CARD-002) ===
$file3 = @'
<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
# CARD-002 Clinical Workflows (CMO Voice)

## 1. STEMI Pathway (Door-to-Balloon)

### Activation criteria
ECG: ST elevation ≥1 mm in 2+ contiguous leads; OR new LBBB with symptoms. Posterior MI: V7-V9. High-risk: anterior, RV (V4R), cardiogenic shock, age>75, DM, prior CABG.

### Door-to-Balloon Timer (≤90 min)
```
T+0    Arrival. ECG within 10 min. ASA 325 mg PO. IV x2.
T+5    STEMI confirmed. Auto-trigger cath lab.
T+10   P2Y12 loading (2-MD/1-RN/1-pharm gate).
T+15   Anticoagulation UFH 70-100 U/kg (2-RN double-check + 5-rights + witness).
T+30   Cath lab activated.
T+45   Patient on table (radial preferred).
T+60   Diagnostic angiography.
T+75   Lesion + SYNTAX.
T+90   Balloon/stent deployed (stent gate: SFDA UDI + cosign).
T+120  Transfer to CCU.
```

### D2B Exception Categories
| Exception | Audit |
|-----------|-------|
| Patient delay | `cath.d2b_exception.patient` |
| Diagnostic uncertainty | `cath.d2b_exception.diagnostic` |
| Transfer | `cath.d2b_exception.transfer` |
| Capacity | `cath.d2b_exception.capacity` |
| MCS first | `cath.d2b_exception.mcs` |
| CPR | `cath.d2b_exception.cpr` |

## 2. PCI Workflow
**Pre-procedure:** Indication, risk (SYNTAX/GRACE/TIMI), access (radial), DAPT, consent, NPHIES preauth (48h).
**Intra-procedure:** Time-out, access, diagnostic, physiology (FFR/iFR), imaging (IVUS/OCT), PCI (balloon/stent), final angiogram, SFDA UDI scan, ACT, radiation, contrast, complications.
**Post-procedure:** Sheath removal checklist, access site monitoring, DAPT compliance, telemetry 24h, CIN surveillance (Cr 24h/48h), discharge planning.

## 3. Structural Heart MDT (Heart Team)
**Composition:** Interventional cardiology (lead), CT surgery, HF cardiology, cardiac imaging, anesthesiology, vascular surgery, geriatrics, nurse coordinator, admin/finance.

**TAVR Workup:** TTE → TEE → CT-TAVR → coronary angio → PFTs → STS + EuroSCORE II → frailty → cognitive → labs → vascular CT → MDT → NPHIES preauth → consent → scheduling (Hybrid OR).

**MitraClip Workup:** Indication = severe primary/secondary MR + symptoms despite GDMT. Echo: EROA ≥0.4 cm². MDT: COAPT criteria. Procedure: transseptal → clip delivery → grasping → deployment.

**Watchman Workup:** AF + CHA₂DS₂-VASc ≥2(M)/≥3(F) + OAC contraindication. CT + TEE (LAA thrombus excluded). MDT decision.

## 4. High-Alert Drug Double-Check
| Step | Action | Documented |
|------|--------|------------|
| 1 | Order (MD) | MAR |
| 2 | Pharmacy verify | MAR |
| 3 | RN A prepare + 5 Rights | MAR |
| 4 | RN B independent verify | MAR |
| 5 | Witness signature | MAR |
| 6 | Administration | MAR |
| 7 | Post-monitoring | Vitals |

**Hard blocks:** allergic → BLOCK; wrong dose → BLOCK; wrong patient → BLOCK; ACT out of range → BLOCK.

## 5. Stent Implant Gate
1. Lesion + stent selected
2. Package opened (witness)
3. SFDA UDI scan
4. Manufacturer+batch+lot+expiration
5. Deployment (operator+assistant)
6. Post-deployment angiogram
7. Operator+assistant cosign
8. SFDA registry (within 7d)

## 6. Structural Heart MDT Gate
BEFORE scheduling: (1) referral (2) workup (3) MDT conference ≥5 specialists (4) decision documented (5) all voting members cosign (6) patient+family discussion (7) NPHIES pre-auth (8) scheduling.
**Hard block:** No individual operator override.

## 7. DAPT Loading Gate
BEFORE elective: (1) indication (2) bleeding risk (PRECISE-DAPT, CRUSADE) (3) DAPT score (4) P2Y12 (5) 2-MD cosign (6) 1-RN (7) 1-pharmacist (8) administration.

## 8. Radiation Safety
Dose limits: Operator 20 mSv/y; Scrub tech 6 mSv/y; Circulating nurse 1 mSv/y; Anesthesiologist 2 mSv/y; Lens 20 mSv/y.
Per-procedure: Fluoro >60 min alert; DAP >500 Gy·cm² alert; Air kerma >5000 mGy alert.

## 9. Disposition
**To CCU:** unstable; complex PCI; shock; high radiation.
**To ward:** stable; telemetry 24h.
**Same-day discharge:** elective; uncomplicated; radial; SCAI 2021 criteria.

## 10. Documentation
Operator: indication, risk, access, findings, intervention + UDI, final angiogram, recommendations.
RN: time-out, vitals, medications, ACT, sheath, monitoring, discharge.
Coordinator (Structural Heart): workup, MDT, decision letter, NPHIES, patient communication.

## 11. Quality Metrics
**Time-based:** D2B %, FMC-to-device, lab activation, radial %, DAPT loading, ACT in-range %, MDT turnaround, NPHIES preauth, TAVR MDT→procedure.
**Clinical:** In-hospital mortality, stent thrombosis, CIN, BARC 3-5, vascular complications, radiation (median/90th), operator volume (SCAI min 50), 30-d readmission.
**Patient experience:** Consent comprehension (teach-back), discharge readiness, Press Ganey, Heart Team coordination.

## 12. Disaster & Surge
- Cath lab unavailable: DIDO <30 min; backup lab 2; fibrinolysis if needed.
- MCI: triage; lab 2; fibrinolysis for non-STEMI.
- Equipment failure: IVUS/OCT fail → FFR; IABP/Impella fail → manual compress + surgical backup.

---
*Section 01 of CARD-002. CMO voice. L1 DRAFT.*
'@
[System.IO.File]::WriteAllText("$root\CARD-002\01_clinical_workflows.md", $file3, [System.Text.UTF8Encoding]::new($false))

Write-Host "✅ 01_clinical_workflows.md (CARD-002) written"
