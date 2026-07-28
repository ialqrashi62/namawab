<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
module_id: BICU
name: "Burn Intensive Care Unit"
parent: "ICU"
code: ICU
generated: 2026-07-24
loop_status: "L1 DRAFT (P3-B)"
template_ref: TPL:DEPT
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# Burn Intensive Care Unit — BICU

## Mission
Burn ICU: severe burns (TBSA>20%), inhalation injury, fluid resuscitation (Parkland), escharotomy, debridement, skin graft.

## Scope
Burn resuscitation (Parkland formula), inhalation injury (bronchoscopy, intubation), escharotomy, fasciotomy, burn wound care, surgical debridement, skin graft (STSG, FTSG), nutrition (high cal), infection control (MRSA, VRE, pseudomonas), pain management, rehabilitation, scar management.

## Top 10 Conditions: 1. Severe burn (T30) 2. TBSA>20% (T31) 3. Inhalation injury (T27) 4. Burn shock (T30) 5. Burn sepsis (A41) 6. Compartment syndrome (T79.6) 7. Electrical burn (T75.0) 8. Chemical burn (T54) 9. Hypothermia burn 10. Rhabdomyolysis (M62.82)
## Top 20 Procedures: Parkland formula (4 mL × kg × %TBSA), lactated Ringer's, escharotomy, fasciotomy, bronchoscopy (inhalation), intubation, mechanical vent, central line, arterial line, foley, NG tube, TPN, enteral feeding, burn wound care (silver sulfadiazine, mafenide, mupirocin), surgical debridement, STSG (split-thickness skin graft), FTSG, allograft, xenograft, dermal substitute, antibiotics (broad spectrum), antifungal, MRSA screening, isolation, pain management (fentanyl, hydromorphone), sedation, anti-psychotic for ICU delirium, rehabilitation, scar compression, sunscreen, multidisciplinary burn team
## Red Flags: TBSA>40% (very high mortality) · Inhalation injury with ARDS · Compartment syndrome (extremity, abdominal) · Escharotomy need · Burn shock (Parkland under-resuscitation) · Over-resuscitation (abdominal compartment) · Burn wound sepsis · Multi-organ failure · Curling ulcer (GI bleed) · Rhabdomyolysis (electrical) · Compartment syndrome (eschar) · Severe electrolyte (hyperK, hypoCa) · Disseminated intravascular coagulation (DIC)
## Database: 9 tables, RLS-forced
## 18 endpoints, 4 LangChain chains

## Compliance: JBI/CBAHI/NPHIES/ZATCA/SFDA/PDPL/HIPAA. ABA/ACS burn center verification. ISBI guidelines. KSA burn center standards.

## Engine: bicu_engine.js
ParklandFormula, TBSACalculation, InhalationInjurySeverity, EscharotomyIndication, BurnSepsisDiagnosis, FluidResuscitationAdjustment, NutritionalNeeds, ScarAssessment, BurnMortalityScore, BauxScore

## Sub-Departments: Burn ICU, Hydrotherapy, OR, Rehab, Scar Clinic

---
*L1 DRAFT complete.*