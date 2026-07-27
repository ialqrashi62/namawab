// P3-CI pcc_path_ext_engine v3.47.0
'use strict';
function SpecimenType(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'unknown-type';
  if (t === 'tissue') plan = 'tissue-path';
  else if (t === 'cytology') plan = 'cytology';
  else if (t === 'fluid') plan = 'fluid-analysis';
  return { plan, t };
}
function Grossing(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'standard-gross';
  if (t === 'urgent') plan = 'intraoperative-frozen';
  return { plan, t };
}
function Embedding(input) {
  const i = input || {};
  const m = String(i.m || '');
  let plan = 'paraffin';
  if (m === 'plastic') plan = 'plastic-embed';
  return { plan, m };
}
function Stain(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'H&E';
  if (t === 'IHC') plan = 'immunohistochemistry';
  else if (t === 'special') plan = 'special-stain';
  return { plan, t };
}
function Diagnosis(input) {
  const i = input || {};
  const m = String(i.m || '');
  let plan = 'no-malignancy';
  if (m === 'malignant') plan = 'malignant-diagnosis';
  else if (m === 'benign') plan = 'benign-diagnosis';
  return { plan, m };
}
function Margin(input) {
  const i = input || {};
  const s = String(i.s || '');
  let plan = 'margins-clear';
  if (s === 'positive') plan = 'positive-margin-re-excision';
  return { plan, s };
}
function Stage(input) {
  const i = input || {};
  const n = Number(i.n ?? 0);
  let plan = 'low-stage';
  if (n >= 3) plan = 'high-stage';
  else if (n >= 1) plan = 'mid-stage';
  return { plan, n };
}
function Grade(input) {
  const i = input || {};
  const g = Number(i.g ?? 1);
  let plan = 'low-grade';
  if (g >= 3) plan = 'high-grade';
  else if (g >= 2) plan = 'intermediate-grade';
  return { plan, g };
}
function Tnm(input) {
  const i = input || {};
  const stage = String(i.s || '');
  let plan = 'TNM-not-assigned';
  if (stage === 'I') plan = 'TNM-Stage-I';
  else if (stage === 'IV') plan = 'TNM-Stage-IV';
  return { plan, stage };
}
function Molecular(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-molecular';
  if (t === 'NGS') plan = 'NGS-panel';
  else if (t === 'FISH') plan = 'FISH-test';
  return { plan, t };
}
module.exports = {
  SpecimenType, Grossing, Embedding, Stain, Diagnosis, Margin, Stage, Grade, Tnm, Molecular
};
