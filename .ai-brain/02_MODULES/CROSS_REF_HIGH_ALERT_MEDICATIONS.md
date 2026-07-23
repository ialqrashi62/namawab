---
module_id: CROSS-REF
section: 04_devops
template_ref: TPL:DEPT-CROSSLINK
generated: 2026-07-23
audited_by: CMO + CQO
---

# CROSS-REFERENCE MAP — High-Alert Medication Categories

> **Purpose:** Resolve the "chemo/biologic cross-link" gap identified in the 2026-07-23 multi-agent audit.
> **Authority:** Module-level red-flags remain the source of truth; this map points each module to its *owning* high-alert module for cross-boundary situations.

## Ownership Map

| High-alert category | Owning module | Why |
|---|---|---|
| **Chemotherapy / Cytotoxic** | [ONC-001](../ONC-001/) | `chemotherapy_orders` table + chemo cycle validation; IPSG.3 double-check |
| **Biologic / Monoclonal (TNF/IL- inhibitors)** | [RHEUM-001](../RHEUM-001/) | Drug safety: biologics + immunosuppressants |
| **Insulin (all forms)** | [ENDO-001](../ENDO-001/) | glycemic control engine + DKA/HHS protocols |
| **Anticoagulants (heparin, warfarin, DOACs)** | [CARD-001](../CARD-001/) | ACS / AF / VTE; reversal protocols; bridging |
| **Opioids** | [PAIN-001](../PAIN-001/) + [ANES-001](../ANES-001/) | Stewardship, 5-rights, PCA safety |
| **Sedation (propofol, midazolam)** | [ANES-001](../ANES-001/) + [MICU](../MICU/) | Airway protection, vent weaning |
| **Electrolytes (KCl, Mg, Insulin)** | [MICU](../MICU/) + [NEPH-001](../NEPH-001/) | Cardiac-arrest prevention, replacement protocols |
| **Pediatric high-alert (all categories)** | [PEDS-002](../PEDS-002/) | Weight-based dosing, max-dose checks |
| **OB-specific (MgSO4, uterotonics)** | [OBG-001](../OBG-001/) | Eclampsia, PPH, retained product |
| **Surgical (local anesthetics, contrast)** | [SURG-001](../SURG-001/) + [RAD-001](../RAD-001/) | LAST, contrast nephropathy |

## Cross-reference rule (for all modules)

> **If a clinical scenario requires a high-alert medication, the prescribing module MUST:**
> 1. Verify the **owning module** has the corresponding protocol + safety check
> 2. Apply the **owning module's red-flag detection** (e.g., chemo dose cap = ONC-001)
> 3. Cross-link the order to the **owning module's audit trail**
> 4. Apply **CMO veto** for any dose exceeding the protocol without explicit override reason

## Affected modules (must add this map to `04_clinical_red_flags.md` footer)

- [ER-001](../ER-001/) — covers emergent admin only; defers chronic med management
- [MICU](../MICU/) — covered for in-ICU admin
- [PEDS-002](../PEDS-002/) — covered for pediatric-specific overrides
- [OBG-001](../OBG-001/) — covered for OB-specific (MgSO4)
- [SURG-001](../SURG-001/) — covered for peri-op high-alert

## Audit trail

- **Created:** 2026-07-23 by CMO (Dr. Sarah Chen, VETO) + ORC
- **Validation:** L4 Gate 2 (Drug Safety) — PASS for all 10 owning modules
- **Distribution:** All clinical modules + `docs/MASTER_BLUEPRINT/IMPLEMENTATION_STATUS.md`

---

*End of cross-reference map. No clinical content removed or changed; pure documentation alignment.*
