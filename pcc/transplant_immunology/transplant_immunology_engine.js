// P3-BG transplant_immunology_engine.js — 10 pure functions
const Engine = {
  ABOMatch: function (i) {
    const donorABO = (i.donorABO || 'O');
    const recipABO = (i.recipABO || 'O');
    const compatible = { 'O': ['O', 'A', 'B', 'AB'], 'A': ['A', 'AB'], 'B': ['B', 'AB'], 'AB': ['AB'] };
    const ok = (compatible[donorABO] || []).includes(recipABO);
    if (ok) return { plan: 'ABO-compatible-and-proceed' };
    return { plan: 'ABO-incompatible-and-desensitization-or-paired' };
  },
  Crossmatch: function (i) {
    const tcell = (i.tcell || 'negative');
    const bcell = (i.bcell || 'negative');
    if (tcell === 'positive') return { plan: 'T-cell-positive-and-contraindicated' };
    if (bcell === 'positive') return { plan: 'B-cell-positive-and-evaluate-rituximab' };
    return { plan: 'crossmatch-negative-and-proceed' };
  },
  DSAPanel: function (i) {
    const pra = (i.pra || 0);
    const mfi = (i.mfi || 0);
    const donorSpecific = (i.donorSpecific || 'no');
    if (pra > 80 && donorSpecific === 'yes') return { plan: 'high-immunologic-risk-and-desensitization' };
    if (pra > 50) return { plan: 'elevated-risk-and-avoid-specific-donor' };
    if (mfi > 5000) return { plan: 'high-MFI-and-consider-other-donor' };
    return { plan: 'acceptable-risk' };
  },
  InductionProtocol: function (i) {
    const risk = (i.risk || 'low');
    const organ = (i.organ || 'kidney');
    const age = (i.age || 50);
    if (risk === 'high' && organ === 'kidney') return { plan: 'rATG-and-steroids-and-MMF' };
    if (risk === 'high' && organ === 'liver') return { plan: 'rATG-and-steroids' };
    if (risk === 'medium') return { plan: 'basiliximab-and-MMF-tac' };
    if (age < 18) return { plan: 'basiliximab-and-low-dose-MMF' };
    return { plan: 'standard-IS-without-induction' };
  },
  MaintenanceIS: function (i) {
    const months = (i.months || 0);
    const rejection = (i.rejection || 'no');
    const renal = (i.renal || 'normal');
    if (rejection === 'recent') return { plan: 'high-target-tac-and-MMF-and-steroid' };
    if (months < 3) return { plan: 'high-target-tac-and-MMF' };
    if (months < 12 && renal === 'normal') return { plan: 'tac-and-MMF-and-monitor' };
    if (months >= 12 && renal === 'normal') return { plan: 'low-target-tac-or-mTOR' };
    if (renal === 'impaired') return { plan: 'low-target-tac-and-avoid-MMF' };
    return { plan: 'tac-and-monitor' };
  },
  RejectionAcute: function (i) {
    const grade = (i.grade || 'borderline');
    const day = (i.day || 30);
    if (grade === 'borderline') return { plan: 'optimize-MMF-and-repeat-biopsy' };
    if (grade === 'IA' && day < 7) return { plan: 'rATG-and-pulse-steroid' };
    if (grade === 'IA' && day >= 7) return { plan: 'pulse-steroid-and-rATG-if-resistant' };
    if (grade === 'IB' || grade === 'IIA') return { plan: 'rATG-and-pulse-steroid-and-MMF' };
    if (grade === 'III') return { plan: 'rATG-and-plasmapheresis-and-IVIG' };
    return { plan: 'standard-treatment' };
  },
  RejectionChronic: function (i) {
    const cad = (i.cad || 'mild');
    const ifta = (i.ifta || 'mild');
    const months = (i.months || 0);
    if (cad === 'severe' || ifta === 'severe') return { plan: 'mTOR-conversion-and-optimize' };
    if (cad === 'moderate') return { plan: 'mTOR-add-and-statin-and-ACE' };
    if (months < 6) return { plan: 'maintain-current-IS-and-monitor' };
    return { plan: 'optimize-IS-and-statin-and-ACE' };
  },
  DSAmonitor: function (i) {
    const mfi = (i.mfi || 0);
    const trend = (i.trend || 'stable');
    const biopsy = (i.biopsy || 'not-done');
    if (mfi > 10000 && trend === 'rising') return { plan: 'urgent-biopsy-and-treatment' };
    if (mfi > 5000 && trend === 'rising') return { plan: 'biopsy-and-consider-treatment' };
    if (mfi > 5000 && trend === 'stable') return { plan: 'monitor-3-months-and-biopsy-if-rising' };
    if (biopsy === 'positive') return { plan: 'treat-and-monitor-DSA' };
    return { plan: 'routine-monitor' };
  },
  InfectionProphylaxis: function (i) {
    const organ = (i.organ || 'kidney');
    const months = (i.months || 0);
    const serostatus = (i.serostatus || 'negative');
    if (organ === 'lung') return { plan: 'valcyte-6mo-and-bactrim-12mo-and-azole' };
    if (serostatus === 'D+R-' && organ === 'kidney') return { plan: 'valcyte-3mo-and-bactrim-12mo' };
    if (months < 12) return { plan: 'bactrim-12mo-and-valcyte-3mo' };
    if (months < 6) return { plan: 'bactrim-and-valcyte' };
    return { plan: 'routine-prophylaxis' };
  },
  VaccinationSchedule: function (i) {
    const months = (i.months || 0);
    const live = (i.live || 'no');
    if (months < 1) return { plan: 'defer-all-vaccines' };
    if (live === 'yes' && months < 24) return { plan: 'avoid-live-vaccines' };
    if (months < 6) return { plan: 'influenza-and-pneumococcal-and-hepB' };
    if (months < 12) return { plan: 'complete-inactivated-series' };
    return { plan: 'annual-influenza-and-routine' };
  },
};
module.exports = Engine;
