// P3-EO pcc_pediatric_psych_ext_engine v3.105.0
'use strict';
function PediatricSchizophreniaEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricSchizophreniaEval-none';
  if (t === 'yes') plan = 'pediatricSchizophreniaEval-protocol';
  return { plan, t };
}
function PediatricPsychosisEarly(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricPsychosisEarly-none';
  if (t === 'yes') plan = 'pediatricPsychosisEarly-protocol';
  return { plan, t };
}
function PediatricCatatonia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricCatatonia-none';
  if (t === 'yes') plan = 'pediatricCatatonia-protocol';
  return { plan, t };
}
function PediatricDissociativeDisorder(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricDissociativeDisorder-none';
  if (t === 'yes') plan = 'pediatricDissociativeDisorder-protocol';
  return { plan, t };
}
function PediatricEatingDisorderExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricEatingDisorderExt-none';
  if (t === 'yes') plan = 'pediatricEatingDisorderExt-protocol';
  return { plan, t };
}
function PediatricGenderDysphoria(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricGenderDysphoria-none';
  if (t === 'yes') plan = 'pediatricGenderDysphoria-protocol';
  return { plan, t };
}
function PediatricSelfHarm(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricSelfHarm-none';
  if (t === 'yes') plan = 'pediatricSelfHarm-protocol';
  return { plan, t };
}
function PediatricSuicideRisk(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricSuicideRisk-none';
  if (t === 'yes') plan = 'pediatricSuicideRisk-protocol';
  return { plan, t };
}
function PediatricCrisisEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricCrisisEval-none';
  if (t === 'yes') plan = 'pediatricCrisisEval-protocol';
  return { plan, t };
}
function PediatricPsychEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricPsychEval-none';
  if (t === 'yes') plan = 'pediatricPsychEval-protocol';
  return { plan, t };
}
module.exports = { PediatricSchizophreniaEval, PediatricPsychosisEarly, PediatricCatatonia, PediatricDissociativeDisorder, PediatricEatingDisorderExt, PediatricGenderDysphoria, PediatricSelfHarm, PediatricSuicideRisk, PediatricCrisisEval, PediatricPsychEval };
