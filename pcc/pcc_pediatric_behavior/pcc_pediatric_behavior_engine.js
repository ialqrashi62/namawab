// P3-EL pcc_pediatric_behavior_engine v3.102.0
'use strict';
function AutismSpectrumEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'autismSpectrumEval-none';
  if (t === 'yes') plan = 'autismSpectrumEval-protocol';
  return { plan, t };
}
function ADHDAssessment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'aDHDAssessment-none';
  if (t === 'yes') plan = 'aDHDAssessment-protocol';
  return { plan, t };
}
function PediatricAnxiety(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricAnxiety-none';
  if (t === 'yes') plan = 'pediatricAnxiety-protocol';
  return { plan, t };
}
function PediatricDepression(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricDepression-none';
  if (t === 'yes') plan = 'pediatricDepression-protocol';
  return { plan, t };
}
function PediatricOCD(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricOCD-none';
  if (t === 'yes') plan = 'pediatricOCD-protocol';
  return { plan, t };
}
function PediatricBipolarEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricBipolarEval-none';
  if (t === 'yes') plan = 'pediatricBipolarEval-protocol';
  return { plan, t };
}
function PediatricConductDisorder(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricConductDisorder-none';
  if (t === 'yes') plan = 'pediatricConductDisorder-protocol';
  return { plan, t };
}
function PediatricOppositionalDefiant(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricOppositionalDefiant-none';
  if (t === 'yes') plan = 'pediatricOppositionalDefiant-protocol';
  return { plan, t };
}
function PediatricTicDisorders(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricTicDisorders-none';
  if (t === 'yes') plan = 'pediatricTicDisorders-protocol';
  return { plan, t };
}
function PediatricSelectiveMutism(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricSelectiveMutism-none';
  if (t === 'yes') plan = 'pediatricSelectiveMutism-protocol';
  return { plan, t };
}
module.exports = { AutismSpectrumEval, ADHDAssessment, PediatricAnxiety, PediatricDepression, PediatricOCD, PediatricBipolarEval, PediatricConductDisorder, PediatricOppositionalDefiant, PediatricTicDisorders, PediatricSelectiveMutism };
