// P3-DR pcc_gynecology_advanced_engine v3.82.0
'use strict';
function OvarianCancerAdvanced(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'ovariancanceradvanced-none';
  if (t === 'yes') plan = 'ovariancanceradvanced-protocol';
  return { plan, t };
}
function EndometrialCancer(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'endometrialcancer-none';
  if (t === 'yes') plan = 'endometrialcancer-protocol';
  return { plan, t };
}
function CervicalCancerAdvanced(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cervicalcanceradvanced-none';
  if (t === 'yes') plan = 'cervicalcanceradvanced-protocol';
  return { plan, t };
}
function UterineFibroidsRefractory(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'uterinefibroidsrefractory-none';
  if (t === 'yes') plan = 'uterinefibroidsrefractory-protocol';
  return { plan, t };
}
function EndometriosisAdvanced(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'endometriosisadvanced-none';
  if (t === 'yes') plan = 'endometriosisadvanced-protocol';
  return { plan, t };
}
function PCOSRefractory(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pcosrefractory-none';
  if (t === 'yes') plan = 'pcosrefractory-protocol';
  return { plan, t };
}
function PelvicInflammatoryDisease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pelvicinflammatorydisease-none';
  if (t === 'yes') plan = 'pelvicinflammatorydisease-protocol';
  return { plan, t };
}
function VulvodyniaAdvanced(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vulvodyniaadvanced-none';
  if (t === 'yes') plan = 'vulvodyniaadvanced-protocol';
  return { plan, t };
}
function GynecologicSurgeryRisk(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'gynecologicsurgeryrisk-none';
  if (t === 'yes') plan = 'gynecologicsurgeryrisk-protocol';
  return { plan, t };
}
function FertilityPreservation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'fertilitypreservation-none';
  if (t === 'yes') plan = 'fertilitypreservation-protocol';
  return { plan, t };
}
module.exports = {
  OvarianCancerAdvanced, EndometrialCancer, CervicalCancerAdvanced, UterineFibroidsRefractory, EndometriosisAdvanced, PCOSRefractory, PelvicInflammatoryDisease, VulvodyniaAdvanced, GynecologicSurgeryRisk, FertilityPreservation
};
