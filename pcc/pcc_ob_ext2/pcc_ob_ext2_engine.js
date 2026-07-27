// P3-CJ pcc_ob_ext2_engine v3.48.0
'use strict';
function GADobstetric(input) {
  const i = input || {};
  const ga = Number(i.ga ?? 0);
  let plan = 'pre-pregnancy';
  if (ga >= 37) plan = 'term-GA-37plus';
  else if (ga >= 28) plan = 'preterm-GA-32';
  else if (ga >= 1) plan = 'second-trimester';
  return { plan, ga };
}
function Labor(input) {
  const i = input || {};
  const stage = String(i.st || '');
  let plan = 'no-labor';
  if (stage === 'active') plan = 'active-labor';
  else if (stage === 'latent') plan = 'latent-phase';
  return { plan, stage };
}
function Mode(input) {
  const i = input || {};
  const m = String(i.m || '');
  let plan = 'planned-vaginal';
  if (m === 'cesarean') plan = 'cesarean-section';
  else if (m === 'instrumental') plan = 'operative-vaginal';
  return { plan, m };
}
function FHR(input) {
  const i = input || {};
  const bpm = Number(i.bpm ?? 140);
  let plan = 'normal-FHR';
  if (bpm >= 160) plan = 'fetal-tachycardia';
  else if (bpm <= 100) plan = 'fetal-bradycardia';
  return { plan, bpm };
}
function Filter(input) {
  const i = input || {};
  const y = Number(i.y ?? 0);
  let plan = 'standard-filter';
  if (y <= 1) plan = 'year-1-medsafe';
  return { plan, y };
}
function PostnatalCare(input) {
  const i = input || {};
  const d = Number(i.d ?? 0);
  let plan = 'postpartum-day-0';
  if (d >= 1) plan = 'day-2-postpartum';
  return { plan, d };
}
function Bleeding(input) {
  const i = input || {};
  const ml = Number(i.ml ?? 0);
  let plan = 'normal-bleeding';
  if (ml >= 1000) plan = 'PPH-protocol';
  else if (ml >= 500) plan = 'mild-PPH';
  return { plan, ml };
}
function Screening(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'standard-screening';
  if (t === 'GBS') plan = 'GBS-screen';
  return { plan, t };
}
function Antenatal(input) {
  const i = input || {};
  const trimester = Number(i.tr ?? 1);
  let plan = 'first-visit';
  if (trimester >= 3) plan = 'trimester-3-visit';
  return { plan, trimester };
}
function Risk(input) {
  const i = input || {};
  const score = String(i.score || '');
  let plan = 'low-risk';
  if (score === 'high') plan = 'high-risk-maternal';
  return { plan, score };
}
module.exports = {
  GADobstetric, Labor, Mode, FHR, Filter, PostnatalCare, Bleeding, Screening, Antenatal, Risk
};
