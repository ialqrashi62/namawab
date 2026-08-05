// P3_CE pcc_research_engine v3.43.0
'use strict';
function Protocol(input) {
  const i = input || {};
  const phase = String(i.phase || '');
  let plan = 'observational-study';
  if (phase === 'I') plan = 'phase-I-safety';
  else if (phase === 'II') plan = 'phase-II-efficacy';
  else if (phase === 'III') plan = 'phase-III-RCT';
  else if (phase === 'IV') plan = 'phase-IV-surveillance';
  return { plan, phase };
}
function Consent(input) {
  const i = input || {};
  const type = String(i.type || '');
  let plan = 'standard-consent';
  if (type === 'pediatric') plan = 'pediatric-assent';
  else if (type === 'pregnant') plan = 'pregnancy-consent';
  else if (type === 'incapacitated') plan = 'LAR-consent';
  return { plan, type };
}
function IRB(input) {
  const i = input || {};
  const risk = String(i.risk || '');
  let plan = 'exempt-review';
  if (risk === 'minimal') plan = 'expedited-review';
  else if (risk === 'greater') plan = 'full-board-review';
  return { plan, risk };
}
function Enrollment(input) {
  const i = input || {};
  const n = Number(i.target ?? 0);
  let plan = 'feasibility-stage';
  if (n >= 1000) plan = 'large-trial';
  else if (n >= 100) plan = 'medium-trial';
  else if (n >= 10) plan = 'pilot-trial';
  return { plan, n };
}
function Adverse(input) {
  const i = input || {};
  const sev = String(i.severity || '');
  let plan = 'no-AE';
  if (sev === 'mild') plan = 'grade-1-AE';
  else if (sev === 'moderate') plan = 'grade-2-AE';
  else if (sev === 'severe') plan = 'grade-3-AE';
  else if (sev === 'life') plan = 'grade-4-AE-susar';
  return { plan, sev };
}
function Randomization(input) {
  const i = input || {};
  const ratio = String(i.ratio || '');
  let plan = 'simple-randomization';
  if (ratio === 'block') plan = 'block-randomization';
  else if (ratio === 'stratified') plan = 'stratified-randomization';
  else if (ratio === 'cluster') plan = 'cluster-randomization';
  return { plan, ratio };
}
function Biostats(input) {
  const i = input || {};
  const method = String(i.method || '');
  let plan = 'descriptive-only';
  if (method === 't') plan = 't-test';
  else if (method === 'chi') plan = 'chi-square';
  else if (method === 'regress') plan = 'multivariable-regression';
  else if (method === 'survival') plan = 'kaplan-meier';
  return { plan, method };
}
function Publication(input) {
  const i = input || {};
  const target = String(i.target || '');
  let plan = 'internal-bulletin';
  if (target === 'journal') plan = 'peer-review-journal';
  else if (target === 'conference') plan = 'conference-abstract';
  else if (target === 'poster') plan = 'scientific-poster';
  return { plan, target };
}
function Funding(input) {
  const i = input || {};
  const src = String(i.src || '');
  let plan = 'institutional';
  if (src === 'NIH') plan = 'federal-grant';
  else if (src === 'industry') plan = 'industry-sponsored';
  else if (src === 'foundation') plan = 'foundation-grant';
  return { plan, src };
}
function Dataset(input) {
  const i = input || {};
  const type = String(i.type || '');
  let plan = 'anonymized-export';
  if (type === 'limited') plan = 'limited-dataset';
  if (type === 'identified') plan = 'identified-dataset-IRB';
  if (type === 'deidentified') plan = 'HIPAA-deidentified';
  return { plan, type };
}
module.exports = {
  Protocol, Consent, IRB, Enrollment, Adverse, Randomization, Biostats, Publication, Funding, Dataset
};
