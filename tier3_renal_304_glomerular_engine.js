/**
 * TIER3_RENAL-304 Glomerular Disease Engine
 * Nephrotic/nephritic dx + induction + maintenance + relapse detection + biopsy indication
 */
'use strict';

class ValidationError extends Error {
  constructor(code, message) { super(message); this.name = 'ValidationError'; this.code = code; }
}

const CITATIONS = { KDIGO_GN: 'KDIGO Glomerulonephritis 2021', KIDGO_GN_UPDATE: 'KDIGO GN Update 2024' };

function differentialDiagnosis(input) {
  const { proteinuria_g_per_day, hematuria, dysmorphic_rbc, complement_low, anca, anti_gbm, age } = input;
  let syndrome = 'undetermined';
  if (proteinuria_g_per_day >= 3.5 && !hematuria) syndrome = 'nephrotic';
  else if (hematuria && proteinuria_g_per_day < 3.5) syndrome = 'nephritic';
  else if (proteinuria_g_per_day >= 3.5 && hematuria) syndrome = 'mixed';
  let etiology = 'undetermined';
  if (syndrome === 'nephrotic' && age < 40) etiology = 'likely_MCD_or_FSGS';
  else if (syndrome === 'nephrotic' && age >= 40) etiology = 'likely_membranous_secondary';
  else if (syndrome === 'nephritic' && complement_low) etiology = 'lupus_or_PIGN';
  else if (anca) etiology = 'ANCA_vasculitis_pauci_immune';
  else if (anti_gbm) etiology = 'anti_GBM_disease_Goodpasture';
  return { syndrome, etiology, workup: ['complement_C3_C4', 'ANA', 'ANCA', 'anti_GBM', 'serum_albumin', 'renal_biopsy'] };
}

function inductionTherapy(input) {
  const { diagnosis, severity, age, comorbidity } = input;
  const regimens = {
    MCD: { 'adult': 'prednisone_1mg/kg', 'child': 'prednisone_60mg/m2' },
    FSGS: 'prednisone_1mg/kg + consider_CNI',
    Membranous: 'rituximab_1g + cyclophosphamide_if_high_risk',
    'ANCA_vasculitis': 'rituximab_or_cyclophosphamide + glucocorticoids',
    Lupus_nephritis_IV: 'mycophenolate_or_cyclophosphamide + steroids',
    'anti_GBM': 'plasmapheresis + cyclophosphamide + steroids',
  };
  return { diagnosis, regimen: regimens[diagnosis] || 'specialist_referral', citation: CITATIONS.KIDGO_GN_UPDATE };
}

function maintenanceTherapy(input) {
  const { diagnosis } = input;
  const map = {
    MCD: 'no_maintenance_typical',
    FSGS: 'CNI_or_MMF_2y',
    Membranous: 'rituximab_PRN',
    ANCA_vasculitis: 'azathioprine_or_MMF_2-4y',
    Lupus_nephritis: 'mycophenolate_or_azathioprine_long_term',
  };
  return { diagnosis, regimen: map[diagnosis] || 'specialist_consult', duration_years: 2 };
}

function relapseDetection(input) {
  const { baseline_creatinine, current_creatinine, baseline_proteinuria, current_proteinuria, active_sediment } = input;
  const relapse = current_creatinine > baseline_creatinine * 1.3 && (current_proteinuria > baseline_proteinuria * 2 || active_sediment);
  return {
    relapse_detected: relapse,
    severity: current_creatinine > baseline_creatinine * 2 ? 'severe' : current_creatinine > baseline_creatinine * 1.5 ? 'moderate' : 'mild',
    action: relapse ? 'restart_induction OR consider_biopsy' : 'continue_maintenance',
  };
}

function biopsyIndication(input) {
  const { proteinuria_g_per_day, hematuria, cretinine_rising, age } = input;
  const indication = proteinuria_g_per_day > 1 && (cretinine_rising || hematuria || age < 18 || age > 60) || proteinuria_g_per_day > 3.5;
  return { biopsy_indicated: indication, urgency: cretinine_rising && proteinuria_g_per_day > 3.5 ? 'urgent' : 'elective' };
}

module.exports = { differentialDiagnosis, inductionTherapy, maintenanceTherapy, relapseDetection, biopsyIndication, CITATIONS, ValidationError };