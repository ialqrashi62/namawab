// P3-BN id_ext_engine.js — 10 pure functions (advanced infectious disease)
const Engine = {
  SepsisBundle: function (i) {
    const time = (i.time || 1);
    const lactate = (i.lactate || 2);
    const abx = (i.abx || 'no');
    const fluid = (i.fluid || 'no');
    if (time <= 1 && abx === 'yes' && fluid === 'yes') return { plan: 'bundle-complete-and-monitor' };
    if (time <= 3 && abx === 'no') return { plan: 'urgent-abx-within-1h' };
    if (time <= 3 && fluid === 'no' && lactate >= 4) return { plan: '30mL/kg-fluid-bolus' };
    if (lactate >= 4) return { plan: 'repeat-lactate-and-fluid' };
    return { plan: 'monitor-and-eval' };
  },
  EmpiricAbx: function (i) {
    const site = (i.site || 'unknown');
    const risk = (i.risk || 'standard');
    if (site === 'CNS' && risk === 'standard') return { plan: 'vancomycin-and-ceftriaxone' };
    if (site === 'CNS') return { plan: 'vancomycin-and-meropenem' };
    if (site === 'intra-abdominal') return { plan: 'pip-tazo' };
    if (site === 'skin' && risk === 'standard') return { plan: 'cefazolin-or-nafcillin' };
    if (site === 'skin' && risk === 'MRSA') return { plan: 'vancomycin' };
    if (site === 'UTI') return { plan: 'ceftriaxone' };
    if (site === 'pneumonia') return { plan: 'ceftriaxone-and-azithromycin' };
    return { plan: 'evaluate-and-treat' };
  },
  HIVInitiation: function (i) {
    const cd4 = (i.cd4 || 500);
    const viral = (i.viral || 100000);
    const opportunistic = (i.opportunistic || 'no');
    if (opportunistic === 'yes') return { plan: 'treat-OI-and-start-ART' };
    if (cd4 < 200) return { plan: 'urgent-ART-and-prophylaxis' };
    if (viral > 100000) return { plan: 'ART-and-monitor' };
    return { plan: 'standard-ART' };
  },
  TB: function (i) {
    const disease = (i.disease || 'latent');
    const resistance = (i.resistance || 'unknown');
    if (disease === 'active' && resistance === 'MDR') return { plan: 'MDR-regimen-and-DOT' };
    if (disease === 'active') return { plan: 'RIPE-and-DOT' };
    if (disease === 'latent') return { plan: 'INH-9mo-or-3HP' };
    if (disease === 'exposure') return { plan: 'window-INH' };
    return { plan: 'evaluate-and-decide' };
  },
  Travel: function (i) {
    const region = (i.region || 'unknown');
    const prophylaxis = (i.prophylaxis || 'unknown');
    if (region === 'malaria' && prophylaxis === 'standard') return { plan: 'atovaquone-proguanil' };
    if (region === 'malaria') return { plan: 'mefloquine-or-doxy' };
    if (region === 'yellow-fever') return { plan: 'yellow-fever-vaccine' };
    if (region === 'hepatitis-A') return { plan: 'HAV-vaccine-and-IG' };
    if (region === 'typhoid') return { plan: 'typhoid-vaccine' };
    return { plan: 'standard-prophylaxis' };
  },
  Fungal: function (i) {
    const organism = (i.organism || 'unknown');
    const host = (i.host || 'normal');
    if (organism === 'candida' && host === 'icu') return { plan: 'micafungin-and-source-control' };
    if (organism === 'candida') return { plan: 'fluconazole' };
    if (organism === 'aspergillus') return { plan: 'voriconazole' };
    if (organism === 'cryptococcus' && host === 'HIV') return { plan: 'ampho-B-and-flucytosine' };
    if (organism === 'histoplasma') return { plan: 'itraconazole' };
    if (organism === 'PCP' && host === 'HIV') return { plan: 'TMP-SMX-and-steroid' };
    return { plan: 'evaluate-and-treat' };
  },
  Viral: function (i) {
    const virus = (i.virus || 'unknown');
    const host = (i.host || 'normal');
    if (virus === 'CMV' && host === 'transplant') return { plan: 'ganciclovir-and-monitor' };
    if (virus === 'CMV' && host === 'immunocompromised') return { plan: 'ganciclovir' };
    if (virus === 'HSV' && host === 'immunocompromised') return { plan: 'acyclovir-IV' };
    if (virus === 'HSV') return { plan: 'acyclovir-oral' };
    if (virus === 'VZV') return { plan: 'valacyclovir' };
    if (virus === 'HBV') return { plan: 'tenofovir-or-entecavir' };
    if (virus === 'HCV') return { plan: 'DAA-regimen' };
    if (virus === 'influenza') return { plan: 'oseltamivir' };
    return { plan: 'evaluate-and-treat' };
  },
  OPAT: function (i) {
    const infection = (i.infection || 'unknown');
    const drug = (i.drug || 'unknown');
    const pvc = (i.pvc || 'present');
    if (infection === 'endocarditis' && drug === 'vancomycin') return { plan: 'OPAT-and-weekly-trough' };
    if (infection === 'endocarditis') return { plan: 'OPAT-and-weekly-CBC' };
    if (infection === 'osteomyelitis') return { plan: 'OPAT-2-6w-and-FU' };
    if (pvc === 'absent') return { plan: 'PICC-and-OPAT' };
    if (drug === 'vancomycin') return { plan: 'OPAT-and-trough' };
    return { plan: 'OPAT-and-monitor' };
  },
  ProstheticJoint: function (i) {
    const timing = (i.timing || 'early');
    const organism = (i.organism || 'unknown');
    if (timing === 'early' && organism === 'staph') return { plan: 'DAIR-and-6w-abx' };
    if (timing === 'early') return { plan: 'DAIR-and-4w-abx' };
    if (timing === 'late' && organism === 'staph') return { plan: 'resection-and-6w-abx' };
    if (timing === 'late') return { plan: 'resection-and-4-6w-abx' };
    if (organism === 'culture-negative') return { plan: 'empiric-and-tissue' };
    return { plan: 'evaluate-and-treat' };
  },
  HIVPrep: function (i) {
    const hbv = (i.hbv || 'immune');
    const renal = (i.renal || 'normal');
    if (hbv === 'non-immune') return { plan: 'vaccinate-HBV-and-PrEP' };
    if (renal === 'impaired' && renal !== 'normal') return { plan: 'TDF-FTC-and-monitor' };
    if (renal === 'normal') return { plan: 'TDF-FTC-daily' };
    return { plan: 'PrEP-and-monitor' };
  },
};
module.exports = Engine;
