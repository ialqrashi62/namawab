// filepath: namaweb/drug_interaction_engine.js
// Drug-drug interaction checker.
// Pure-JS, deterministic lookup over a curated clinical interaction table.
// Server-side only — never logs patient identifiers.
// Pattern: nm-clinical-engine

'use strict';

// Curated interaction matrix. Each entry: drug_a + drug_b -> interaction.
// severity: contraindicated | major | moderate | minor | info
// Keys are normalized to lowercase.
const INTERACTIONS = {
    // ===== Anticoagulants / antiplatelets =====
    'warfarin|aspirin':        { severity: 'major',         mechanism: 'Increased bleeding risk', recommendation: 'Avoid combination; if needed, use lowest ASA dose and monitor INR closely.' },
    'warfarin|ibuprofen':      { severity: 'major',         mechanism: 'Increased bleeding risk via platelet inhibition', recommendation: 'Avoid NSAIDs with warfarin; use acetaminophen for pain.' },
    'warfarin|naproxen':       { severity: 'major',         mechanism: 'Increased bleeding risk', recommendation: 'Avoid combination.' },
    'warfarin|amiodarone':     { severity: 'major',         mechanism: 'CYP2C9 inhibition increases warfarin levels', recommendation: 'Reduce warfarin dose 30-50%, monitor INR every 3-5 days.' },
    'warfarin|fluconazole':    { severity: 'major',         mechanism: 'CYP2C9 inhibition increases warfarin levels', recommendation: 'Reduce warfarin dose, monitor INR closely.' },
    'warfarin|trimethoprim':   { severity: 'moderate',      mechanism: 'CYP2C9 inhibition', recommendation: 'Monitor INR; consider dose reduction.' },
    'warfarin|metronidazole':  { severity: 'major',         mechanism: 'CYP2C9 inhibition', recommendation: 'Reduce warfarin dose 25-50%, monitor INR.' },
    'warfarin|rifampin':       { severity: 'major',         mechanism: 'CYP3A4 induction reduces warfarin effect', recommendation: 'Increase warfarin dose, monitor INR weekly.' },
    'warfarin|phenytoin':      { severity: 'major',         mechanism: 'Complex CYP interactions', recommendation: 'Monitor INR and phenytoin levels; adjust doses.' },
    'warfarin|carbamazepine':  { severity: 'major',         mechanism: 'CYP3A4 induction reduces warfarin effect', recommendation: 'Monitor INR; expect warfarin dose increase.' },
    'warfarin|st johns wort':  { severity: 'major',         mechanism: 'CYP3A4 induction', recommendation: 'Avoid combination or significantly increase warfarin dose with INR monitoring.' },
    'aspirin|clopidogrel':     { severity: 'major',         mechanism: 'Additive antiplatelet effect, increased bleeding', recommendation: 'Acceptable short-term post-PCI; chronic use increases bleeding risk.' },
    'aspirin|ibuprofen':       { severity: 'moderate',      mechanism: 'Ibuprofen blocks aspirin antiplatelet effect', recommendation: 'Take ibuprofen 8+ hours after or 30 min before immediate-release aspirin.' },
    'aspirin|heparin':         { severity: 'major',         mechanism: 'Additive anticoagulant effect', recommendation: 'Monitor for bleeding; adjust heparin dose.' },
    'apixaban|aspirin':        { severity: 'major',         mechanism: 'Increased bleeding risk', recommendation: 'Avoid or minimize duration; monitor for bleeding.' },
    'rivaroxaban|aspirin':     { severity: 'major',         mechanism: 'Increased bleeding risk', recommendation: 'Avoid combination or use lowest ASA dose with caution.' },
    'dabigatran|aspirin':      { severity: 'major',         mechanism: 'Increased bleeding risk', recommendation: 'Avoid or minimize duration.' },

    // ===== QT prolongation =====
    'amiodarone|sotalol':      { severity: 'contraindicated', mechanism: 'Additive QT prolongation, torsades risk', recommendation: 'Avoid combination.' },
    'amiodarone|haloperidol':  { severity: 'major',         mechanism: 'Additive QT prolongation', recommendation: 'Monitor ECG; correct electrolytes.' },
    'amiodarone|ondansetron':  { severity: 'major',         mechanism: 'Additive QT prolongation', recommendation: 'Monitor ECG; consider alternative antiemetic.' },
    'sotalol|ciprofloxacin':   { severity: 'contraindicated', mechanism: 'Additive QT prolongation', recommendation: 'Avoid combination.' },
    'azithromycin|amiodarone': { severity: 'major',         mechanism: 'Additive QT prolongation', recommendation: 'Monitor ECG; avoid in structural heart disease.' },
    'fluconazole|amiodarone':  { severity: 'contraindicated', mechanism: 'QT prolongation + CYP inhibition', recommendation: 'Avoid combination.' },

    // ===== Serotonin syndrome =====
    'fluoxetine|tramadol':     { severity: 'major',         mechanism: 'Serotonin syndrome risk', recommendation: 'Avoid combination; if needed, monitor for serotonin syndrome.' },
    'sertraline|tramadol':     { severity: 'major',         mechanism: 'Serotonin syndrome risk', recommendation: 'Avoid combination or use lowest tramadol dose.' },
    'fluoxetine|linezolid':    { severity: 'contraindicated', mechanism: 'Serotonin syndrome risk (MAOI-like effect)', recommendation: 'Avoid combination; discontinue SSRI 2+ weeks before linezolid.' },
    'ssri|maoi':               { severity: 'contraindicated', mechanism: 'Fatal serotonin syndrome', recommendation: 'Contraindicated. 14-day washout between MAOI and SSRI.' },
    'fluoxetine|phenytoin':    { severity: 'major',         mechanism: 'CYP2D6 inhibition increases phenytoin', recommendation: 'Monitor phenytoin levels.' },
    'sertraline|warfarin':     { severity: 'moderate',      mechanism: 'Increased bleeding risk via platelet effects', recommendation: 'Monitor INR; counsel patient on bleeding signs.' },

    // ===== Renal / electrolyte =====
    'lisinopril|spironolactone': { severity: 'major',       mechanism: 'Hyperkalemia risk', recommendation: 'Monitor potassium and renal function; avoid if CrCl <30.' },
    'lisinopril|potassium':    { severity: 'major',         mechanism: 'Hyperkalemia risk', recommendation: 'Avoid routine K+ supplementation; monitor serum K+.' },
    'enalapril|lithium':       { severity: 'major',         mechanism: 'Reduced lithium clearance', recommendation: 'Monitor lithium levels; expect dose reduction.' },
    'furosemide|lithium':      { severity: 'major',         mechanism: 'Reduced lithium clearance', recommendation: 'Monitor lithium levels.' },
    'ibuprofen|lisinopril':    { severity: 'moderate',      mechanism: 'Reduced ACE-I efficacy, renal risk', recommendation: 'Avoid chronic NSAID; monitor BP and creatinine.' },
    'ibuprofen|furosemide':    { severity: 'moderate',      mechanism: 'Reduced diuretic effect', recommendation: 'Monitor for diuretic resistance.' },
    'digoxin|furosemide':      { severity: 'moderate',      mechanism: 'Hypokalemia potentiates digoxin toxicity', recommendation: 'Monitor potassium and digoxin levels.' },
    'digoxin|amiodarone':      { severity: 'major',         mechanism: 'Increased digoxin levels', recommendation: 'Reduce digoxin dose 50%, monitor levels.' },
    'digoxin|verapamil':       { severity: 'major',         mechanism: 'Increased digoxin levels', recommendation: 'Reduce digoxin dose, monitor levels.' },

    // ===== CYP450 inducers / inhibitors =====
    'rifampin|oral contraceptive': { severity: 'major',     mechanism: 'Reduced OCP efficacy', recommendation: 'Use non-hormonal contraception during rifampin and 4 weeks after.' },
    'rifampin|metformin':      { severity: 'minor',         mechanism: 'Possible reduced efficacy', recommendation: 'Monitor glucose.' },
    'clarithromycin|simvastatin': { severity: 'contraindicated', mechanism: 'Rhabdomyolysis risk via CYP3A4 inhibition', recommendation: 'Hold simvastatin during macrolide course or switch to azithromycin.' },
    'erythromycin|simvastatin': { severity: 'contraindicated', mechanism: 'Rhabdomyolysis risk', recommendation: 'Avoid combination.' },
    'fluconazole|simvastatin': { severity: 'major',         mechanism: 'Increased simvastatin levels', recommendation: 'Limit simvastatin to 20 mg or switch to pravastatin.' },
    'grapefruit|simvastatin':  { severity: 'major',         mechanism: 'CYP3A4 inhibition', recommendation: 'Avoid grapefruit juice with simvastatin.' },
    'ketoconazole|simvastatin':{ severity: 'contraindicated', mechanism: 'CYP3A4 inhibition, rhabdomyolysis', recommendation: 'Contraindicated.' },

    // ===== Diabetes =====
    'metformin|contrast dye':  { severity: 'major',         mechanism: 'Lactic acidosis risk in renal impairment', recommendation: 'Hold metformin 48h around contrast; reassess renal function.' },
    'glipizide|fluconazole':   { severity: 'major',         mechanism: 'Increased hypoglycemia', recommendation: 'Monitor glucose; reduce glipizide dose.' },
    'insulin|beta blocker':    { severity: 'moderate',      mechanism: 'Masked hypoglycemia symptoms', recommendation: 'Monitor glucose closely; counsel on hypoglycemia.' },
    'metformin|furosemide':    { severity: 'minor',         mechanism: 'Possible renal function changes', recommendation: 'Monitor renal function.' },

    // ===== Antibiotics =====
    'ciprofloxacin|antacid':   { severity: 'moderate',      mechanism: 'Reduced ciprofloxacin absorption', recommendation: 'Separate doses by 2 hours.' },
    'ciprofloxacin|iron':      { severity: 'major',         mechanism: 'Chelation reduces absorption', recommendation: 'Separate by 2 hours.' },
    'ciprofloxacin|warfarin':  { severity: 'major',         mechanism: 'Increased INR', recommendation: 'Monitor INR closely.' },
    'ciprofloxacin|tizanidine':{ severity: 'contraindicated', mechanism: 'CYP1A2 inhibition, severe hypotension/sedation', recommendation: 'Contraindicated.' },
    'azithromycin|warfarin':   { severity: 'moderate',      mechanism: 'Possible INR increase', recommendation: 'Monitor INR.' },
    'metronidazole|alcohol':   { severity: 'major',         mechanism: 'Disulfiram-like reaction', recommendation: 'Avoid alcohol during and 72h after metronidazole.' },

    // ===== Mental health =====
    'haloperidol|methadone':   { severity: 'major',         mechanism: 'Additive QT prolongation', recommendation: 'Monitor ECG.' },
    'lithium|ibuprofen':       { severity: 'major',         mechanism: 'Reduced lithium clearance', recommendation: 'Monitor lithium levels; expect dose reduction.' },
    'lithium|hydrochlorothiazide': { severity: 'major',     mechanism: 'Reduced lithium clearance', recommendation: 'Monitor lithium levels; reduce dose 25-50%.' },
    'benzodiazepine|opioid':   { severity: 'contraindicated', mechanism: 'Respiratory depression, death', recommendation: 'Avoid combination; if necessary, use lowest dose and shortest duration.' },
    'alprazolam|oxycodone':    { severity: 'contraindicated', mechanism: 'Respiratory depression', recommendation: 'Avoid combination.' },

    // ===== Cardiovascular =====
    'beta blocker|verapamil':  { severity: 'major',         mechanism: 'Bradycardia, heart block, hypotension', recommendation: 'Avoid IV verapamil with beta blockers; monitor ECG if oral combination.' },
    'beta blocker|diltiazem':  { severity: 'major',         mechanism: 'Bradycardia, heart block', recommendation: 'Monitor HR and BP.' },
    'clonidine|beta blocker':  { severity: 'major',         mechanism: 'Severe bradycardia on withdrawal', recommendation: 'Avoid combination or taper carefully.' },
    'nifedipine|beta blocker': { severity: 'moderate',      mechanism: 'Additive hypotension', recommendation: 'Monitor BP.' },

    // ===== Misc =====
    'allopurinol|azathioprine':{ severity: 'contraindicated', mechanism: 'Xanthine oxidase inhibition increases AZA toxicity', recommendation: 'Reduce azathioprine dose 66% or avoid.' },
    'allopurinol|warfarin':    { severity: 'moderate',      mechanism: 'Possible CYP inhibition', recommendation: 'Monitor INR.' },
    'tacrolimus|fluconazole':  { severity: 'major',         mechanism: 'CYP3A4 inhibition increases tacrolimus', recommendation: 'Reduce tacrolimus dose 50%, monitor trough levels.' },
    'tacrolimus|rifampin':     { severity: 'major',         mechanism: 'CYP3A4 induction reduces tacrolimus', recommendation: 'Increase tacrolimus dose, monitor trough.' },
    'methotrexate|ibuprofen':  { severity: 'major',         mechanism: 'Reduced MTX clearance', recommendation: 'Avoid combination in renal impairment.' },
    'methotrexate|trimethoprim': { severity: 'major',       mechanism: 'Additive antifolate effect, pancytopenia', recommendation: 'Avoid combination.' }
};

// Common aliases / brand name normalization
const ALIASES = {
    'asa': 'aspirin',
    'paracetamol': 'acetaminophen',
    'tylenol': 'acetaminophen',
    'advil': 'ibuprofen',
    'motrin': 'ibuprofen',
    'coumadin': 'warfarin',
    'plavix': 'clopidogrel',
    'zocor': 'simvastatin',
    'lipitor': 'atorvastatin',
    'glucophage': 'metformin',
    'lasix': 'furosemide',
    'zithromax': 'azithromycin',
    'flagyl': 'metronidazole',
    'cipro': 'ciprofloxacin',
    'septra': 'trimethoprim',
    'bactrim': 'trimethoprim',
    'diflucan': 'fluconazole',
    'lantus': 'insulin',
    'humalog': 'insulin',
    'novolog': 'insulin'
};

function normalize(name) {
    if (!name) return '';
    let n = String(name).toLowerCase().trim();
    n = n.replace(/\s*\(.*?\)\s*/g, '').trim();
    n = n.replace(/[^a-z0-9 \-]/g, '').trim();
    if (ALIASES[n]) return ALIASES[n];
    return n;
}

function pairKey(a, b) {
    return [a, b].sort().join('|');
}

function lookupInteraction(a, b) {
    const sorted = pairKey(a, b);
    if (INTERACTIONS[sorted]) return INTERACTIONS[sorted];
    // Fallback: try both orderings (in case dict used pre-sorted key)
    const alt = a + '|' + b;
    if (INTERACTIONS[alt]) return INTERACTIONS[alt];
    const alt2 = b + '|' + a;
    if (INTERACTIONS[alt2]) return INTERACTIONS[alt2];
    return null;
}

/**
 * Check for drug-drug interactions among a list of drugs.
 * @param {string[]} drugs - array of drug names
 * @returns {object[]} array of {drug_a, drug_b, severity, mechanism, recommendation, source}
 */
function checkInteractions(drugs) {
    const norm = drugs.map(normalize).filter(Boolean);
    const interactions = [];
    for (let i = 0; i < norm.length; i++) {
        for (let j = i + 1; j < norm.length; j++) {
            const hit = lookupInteraction(norm[i], norm[j]);
            if (hit) {
                interactions.push({
                    drug_a: norm[i],
                    drug_b: norm[j],
                    severity: hit.severity,
                    mechanism: hit.mechanism,
                    recommendation: hit.recommendation,
                    source: 'curated_internal'
                });
            }
        }
    }
    // Sort by severity (worst first)
    const severityRank = { contraindicated: 5, major: 4, moderate: 3, minor: 2, info: 1 };
    interactions.sort((a, b) => (severityRank[b.severity] || 0) - (severityRank[a.severity] || 0));
    return interactions;
}

function getInteractionCount() {
    return Object.keys(INTERACTIONS).length;
}

module.exports = { checkInteractions, normalize, getInteractionCount };