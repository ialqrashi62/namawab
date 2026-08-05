// P3_DT pcc_trauma_center_l2_engine v3.84.0
'use strict';
function ATLSPrimarySurvey(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'aTLSPrimarySurvey-none';
  if (t === 'yes') plan = 'aTLSPrimarySurvey-protocol';
  return { plan, t };
}
function FASTExamIndication(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'fASTExamIndication-none';
  if (t === 'yes') plan = 'fASTExamIndication-protocol';
  return { plan, t };
}
function PelvicFractureStability(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pelvicFractureStability-none';
  if (t === 'yes') plan = 'pelvicFractureStability-protocol';
  return { plan, t };
}
function BluntCardiacInjury(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'bluntCardiacInjury-none';
  if (t === 'yes') plan = 'bluntCardiacInjury-protocol';
  return { plan, t };
}
function TraumaActivationCriteria(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'traumaActivationCriteria-none';
  if (t === 'yes') plan = 'traumaActivationCriteria-protocol';
  return { plan, t };
}
function MassiveTransfusionProtocol(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'massiveTransfusionProtocol-none';
  if (t === 'yes') plan = 'massiveTransfusionProtocol-protocol';
  return { plan, t };
}
function OpenFractureGustilo(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'openFractureGustilo-none';
  if (t === 'yes') plan = 'openFractureGustilo-protocol';
  return { plan, t };
}
function TraumaticBrainInjuryGCS(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'traumaticBrainInjuryGCS-none';
  if (t === 'yes') plan = 'traumaticBrainInjuryGCS-protocol';
  return { plan, t };
}
function SpineClearanceNEXUS(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'spineClearanceNEXUS-none';
  if (t === 'yes') plan = 'spineClearanceNEXUS-protocol';
  return { plan, t };
}
function BurnParklandEstimate(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'burnParklandEstimate-none';
  if (t === 'yes') plan = 'burnParklandEstimate-protocol';
  return { plan, t };
}
module.exports = { ATLSPrimarySurvey, FASTExamIndication, PelvicFractureStability, BluntCardiacInjury, TraumaActivationCriteria, MassiveTransfusionProtocol, OpenFractureGustilo, TraumaticBrainInjuryGCS, SpineClearanceNEXUS, BurnParklandEstimate };
