<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->
---
module_id: ER-008
name: "Toxicology Emergency"
parent: "Emergency"
code: ER
generated: 2026-07-24
loop_status: "L1 DRAFT (P3-B)"
template_ref: TPL:DEPT
owners: {clinical: CMO, technical: AIE, compliance: CQO}
---

# Toxicology Emergency — ER-008

## Mission
Toxicology emergency: poisoning, drug overdose, envenomation, chemical exposure, antidotes, enhanced elimination.

## Scope
Toxidrome recognition, decontamination (activated charcoal, gastric lavage, whole bowel irrigation), antidotes (NAC, naloxone, flumazenil, atropine, pralidoxime, sodium bicarbonate, digoxin Fab, glucagon), enhanced elimination (HD, HP, CRRT), poison control consultation, snake/scorpion envenomation.

## Top 10 Conditions: 1. Acetaminophen overdose (T39.1) 2. Opioid overdose (T40) 3. TCA overdose (T43.0) 4. Beta-blocker OD (T44.7) 5. Calcium channel blocker OD (T46.1) 6. Digoxin toxicity (T46.0) 7. Organophosphate poisoning (T60.0) 8. Carbon monoxide (T58) 9. Snake envenomation (T63.0) 10. Scorpion sting (T63.2)
## Top 20 Procedures: Toxidrome assessment, acetaminophen level 80329, salicylate level 80330, methanol level 80321, ethylene glycol 80321, digoxin level 80162, lithium level 80178, theophylline 80198, iron 83540, lead 83655, co-oximetry (CO) 82375, methemoglobin 83050, cholinesterase, urine drug screen 80307, EKG (QRS, QT), activated charcoal, gastric lavage, whole bowel irrigation, NAC 25h protocol, fomepizole, glucagon, naloxone, flumazenil, sodium bicarbonate, digoxin Fab, atropine, pralidoxime, antivenom, HD for toxins, MDAC (multi-dose activated charcoal)
## Red Flags: TCA overdose (QRS>100) · APAP >150 at 4h · Methanol/ethylene glycol (osmolar gap) · Salicylate toxicity · Opioid with respiratory depression · Beta-blocker/CCB with bradycardia/hypotension · Digoxin toxicity with arrhythmia · Organophosphate (cholinergic crisis) · CO poisoning (LOC) · Methemoglobinemia (cyanosis unresponsive to O2) · Snake envenomation (systemic) · Anaphylactoid reaction · Delayed paraquat (pulmonary fibrosis) · Amanita phalloides (delayed hepatic failure)
## Database: 6 tables, RLS-forced
## 12 endpoints, 4 LangChain chains

## Compliance: JCI/CBAHI/NPHIES/ZATCA/SFDA/PDPL/HIPAA. WHO Poison Control. AAPCC guidelines. KSA poison control center. Antidote stocking standards.

## Engine: toxicology_engine.js
ToxidromeRecognizer, APAP4HourNomogram, SalicylateLevelInterpretation, MethanolEGGap, OpioidReversalDose, TCA_QRSWidth, CCBBetaBlockerDose, DigoxinLevelArrhythmia, COLevelSeverity, AntidoteRecommendation

## Sub-Departments: Tox Bay, Poison Control Coordination, Antidote Stockpile

---
*L1 DRAFT complete.*