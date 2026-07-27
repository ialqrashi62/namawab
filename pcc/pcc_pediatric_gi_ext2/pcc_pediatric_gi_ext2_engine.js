// P3-ER pcc_pediatric_gi_ext2_engine v3.108.0
'use strict';
function PediatricGERDEvalExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricGERDEvalExt-none';
  if (t === 'yes') plan = 'pediatricGERDEvalExt-protocol';
  return { plan, t };
}
function PediatricEosinophilicEsophagitis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricEosinophilicEsophagitis-none';
  if (t === 'yes') plan = 'pediatricEosinophilicEsophagitis-protocol';
  return { plan, t };
}
function PediatricCeliacExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricCeliacExt-none';
  if (t === 'yes') plan = 'pediatricCeliacExt-protocol';
  return { plan, t };
}
function PediatricIBDExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricIBDExt-none';
  if (t === 'yes') plan = 'pediatricIBDExt-protocol';
  return { plan, t };
}
function PediatricHirschsprungExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricHirschsprungExt-none';
  if (t === 'yes') plan = 'pediatricHirschsprungExt-protocol';
  return { plan, t };
}
function PediatricPyloricStenosisExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricPyloricStenosisExt-none';
  if (t === 'yes') plan = 'pediatricPyloricStenosisExt-protocol';
  return { plan, t };
}
function PediatricIntussusceptionExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricIntussusceptionExt-none';
  if (t === 'yes') plan = 'pediatricIntussusceptionExt-protocol';
  return { plan, t };
}
function PediatricHepatologyExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricHepatologyExt-none';
  if (t === 'yes') plan = 'pediatricHepatologyExt-protocol';
  return { plan, t };
}
function PediatricPancreatitisExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricPancreatitisExt-none';
  if (t === 'yes') plan = 'pediatricPancreatitisExt-protocol';
  return { plan, t };
}
function PediatricLiverDiseaseExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricLiverDiseaseExt-none';
  if (t === 'yes') plan = 'pediatricLiverDiseaseExt-protocol';
  return { plan, t };
}
module.exports = { PediatricGERDEvalExt, PediatricEosinophilicEsophagitis, PediatricCeliacExt, PediatricIBDExt, PediatricHirschsprungExt, PediatricPyloricStenosisExt, PediatricIntussusceptionExt, PediatricHepatologyExt, PediatricPancreatitisExt, PediatricLiverDiseaseExt };
