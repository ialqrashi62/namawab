// P3_ET pcc_pediatric_neuro_surg_ext_engine v3.110.0
'use strict';
function PediatricSelectiveDorsalRhizotomy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricSelectiveDorsalRhizotomy-none';
  if (t === 'yes') plan = 'pediatricSelectiveDorsalRhizotomy-protocol';
  return { plan, t };
}
function PediatricIntrathecalBaclofen(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricIntrathecalBaclofen-none';
  if (t === 'yes') plan = 'pediatricIntrathecalBaclofen-protocol';
  return { plan, t };
}
function PediatricVagalNerveStimulator(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricVagalNerveStimulator-none';
  if (t === 'yes') plan = 'pediatricVagalNerveStimulator-protocol';
  return { plan, t };
}
function PediatricDeepBrainStimulation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricDeepBrainStimulation-none';
  if (t === 'yes') plan = 'pediatricDeepBrainStimulation-protocol';
  return { plan, t };
}
function PediatricSpinalFusionSurg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricSpinalFusionSurg-none';
  if (t === 'yes') plan = 'pediatricSpinalFusionSurg-protocol';
  return { plan, t };
}
function PediatricTetheredCordRelease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricTetheredCordRelease-none';
  if (t === 'yes') plan = 'pediatricTetheredCordRelease-protocol';
  return { plan, t };
}
function PediatricScoliosisSurg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricScoliosisSurg-none';
  if (t === 'yes') plan = 'pediatricScoliosisSurg-protocol';
  return { plan, t };
}
function PediatricCraniectomy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricCraniectomy-none';
  if (t === 'yes') plan = 'pediatricCraniectomy-protocol';
  return { plan, t };
}
function PediatricSkullBaseSurg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricSkullBaseSurg-none';
  if (t === 'yes') plan = 'pediatricSkullBaseSurg-protocol';
  return { plan, t };
}
function PediatricEndoscopicThirdVentriculostomy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricEndoscopicThirdVentriculostomy-none';
  if (t === 'yes') plan = 'pediatricEndoscopicThirdVentriculostomy-protocol';
  return { plan, t };
}
module.exports = { PediatricSelectiveDorsalRhizotomy, PediatricIntrathecalBaclofen, PediatricVagalNerveStimulator, PediatricDeepBrainStimulation, PediatricSpinalFusionSurg, PediatricTetheredCordRelease, PediatricScoliosisSurg, PediatricCraniectomy, PediatricSkullBaseSurg, PediatricEndoscopicThirdVentriculostomy };
