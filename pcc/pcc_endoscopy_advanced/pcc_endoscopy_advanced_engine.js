// P3_DO pcc_endoscopy_advanced_engine v3.79.0
'use strict';
function ColonoscopyScreeningAdvanced(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'colonoscopyscreeningadvanced-none';
  if (t === 'yes') plan = 'colonoscopyscreeningadvanced-protocol';
  return { plan, t };
}
function PolypectomyRisk(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'polypectomyrisk-none';
  if (t === 'yes') plan = 'polypectomyrisk-protocol';
  return { plan, t };
}
function ERCPIndication(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'ercpindication-none';
  if (t === 'yes') plan = 'ercpindication-protocol';
  return { plan, t };
}
function EUSIndication(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'eusindication-none';
  if (t === 'yes') plan = 'eusindication-protocol';
  return { plan, t };
}
function EndoscopicHemostasis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'endoscopichemostasis-none';
  if (t === 'yes') plan = 'endoscopichemostasis-protocol';
  return { plan, t };
}
function PEGPlacement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pegplacement-none';
  if (t === 'yes') plan = 'pegplacement-protocol';
  return { plan, t };
}
function EndoscopicDilation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'endoscopicdilation-none';
  if (t === 'yes') plan = 'endoscopicdilation-protocol';
  return { plan, t };
}
function EndoscopicResection(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'endoscopicresection-none';
  if (t === 'yes') plan = 'endoscopicresection-protocol';
  return { plan, t };
}
function CapsuleEndoscopy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'capsuleendoscopy-none';
  if (t === 'yes') plan = 'capsuleendoscopy-protocol';
  return { plan, t };
}
function EndoscopySedationRisk(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'endoscopysedationrisk-none';
  if (t === 'yes') plan = 'endoscopysedationrisk-protocol';
  return { plan, t };
}
module.exports = {
  ColonoscopyScreeningAdvanced, PolypectomyRisk, ERCPIndication, EUSIndication, EndoscopicHemostasis, PEGPlacement, EndoscopicDilation, EndoscopicResection, CapsuleEndoscopy, EndoscopySedationRisk
};
