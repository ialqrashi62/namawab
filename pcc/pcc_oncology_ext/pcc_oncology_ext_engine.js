// P3-CG pcc_oncology_ext_engine v3.45.0
'use strict';
function Regimen(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'supportive-care';
  if (t === 'CHOP') plan = 'CHOP-lymphoma';
  else if (t === 'FOLFOX') plan = 'FOLFOX-CRC';
  else if (t === 'AC-T') plan = 'AC-T-breast';
  return { plan, t };
}
function Cycle(input) {
  const i = input || {};
  const n = Number(i.n ?? 0);
  let plan = 'pre-cycle';
  if (n >= 1) plan = 'cycle-1';
  if (n >= 6) plan = 'mid-treatment';
  return { plan, n };
}
function Toxicity(input) {
  const i = input || {};
  const g = Number(i.g ?? 0);
  let plan = 'no-toxicity';
  if (g >= 4) plan = 'G4-life-threatening';
  else if (g >= 3) plan = 'G3-severe';
  else if (g >= 1) plan = 'G1-mild';
  return { plan, g };
}
function Response(input) {
  const i = input || {};
  const r = String(i.r || '');
  let plan = 'not-assessed';
  if (r === 'CR') plan = 'complete-response';
  else if (r === 'PR') plan = 'partial-response';
  else if (r === 'SD') plan = 'stable-disease';
  else if (r === 'PD') plan = 'progressive-disease';
  return { plan, r };
}
function DoseReduction(input) {
  const i = input || {};
  const pct = Number(i.pct ?? 0);
  let plan = 'no-reduction';
  if (pct >= 50) plan = 'major-reduction';
  else if (pct >= 25) plan = 'moderate-reduction';
  else if (pct > 0) plan = 'minor-reduction';
  return { plan, pct };
}
function HoldReason(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-hold';
  if (t === 'toxicity') plan = 'hold-for-toxicity';
  else if (t === 'counts') plan = 'hold-for-counts';
  return { plan, t };
}
function Biomarker(input) {
  const i = input || {};
  const m = String(i.m || '');
  let plan = 'not-tested';
  if (m === 'PDL1') plan = 'PDL1-IO-eligible';
  else if (m === 'HER2') plan = 'HER2-targeted-therapy';
  else if (m === 'EGFR') plan = 'EGFR-TKI-eligible';
  return { plan, m };
}
function Survivorship(input) {
  const i = input || {};
  const yr = Number(i.yr ?? 0);
  let plan = 'no-survivorship';
  if (yr >= 1) plan = '1yr-survivorship-clinic';
  if (yr >= 5) plan = 'long-term-survivorship';
  return { plan, yr };
}
function TumorBoard(input) {
  const i = input || {};
  const presented = String(i.pres || '');
  let plan = 'no-board';
  if (presented === 'yes') plan = 'tumor-board-reviewed';
  return { plan, presented };
}
function Palliative(input) {
  const i = input || {};
  const d = String(i.d || '');
  let plan = 'no-palliative';
  if (d === 'yes') plan = 'palliative-referral';
  return { plan, d };
}
module.exports = {
  Regimen, Cycle, Toxicity, Response, DoseReduction, HoldReason, Biomarker, Survivorship, TumorBoard, Palliative
};
