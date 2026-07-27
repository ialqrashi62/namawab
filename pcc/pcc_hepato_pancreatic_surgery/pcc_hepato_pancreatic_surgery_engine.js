// P3-DY pcc_hepato_pancreatic_surgery_engine v3.89.0
'use strict';
function WhippleIndication(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'whippleIndication-none';
  if (t === 'yes') plan = 'whippleIndication-protocol';
  return { plan, t };
}
function LiverResectionHCC(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'liverResectionHCC-none';
  if (t === 'yes') plan = 'liverResectionHCC-protocol';
  return { plan, t };
}
function PancreaticCancerStaging(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pancreaticCancerStaging-none';
  if (t === 'yes') plan = 'pancreaticCancerStaging-protocol';
  return { plan, t };
}
function CholangiocarcinomaSurgery(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cholangiocarcinomaSurgery-none';
  if (t === 'yes') plan = 'cholangiocarcinomaSurgery-protocol';
  return { plan, t };
}
function BiliaryReconstruction(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'biliaryReconstruction-none';
  if (t === 'yes') plan = 'biliaryReconstruction-protocol';
  return { plan, t };
}
function LiverTransplantHCC(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'liverTransplantHCC-none';
  if (t === 'yes') plan = 'liverTransplantHCC-protocol';
  return { plan, t };
}
function PancreaticNecrosectomy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pancreaticNecrosectomy-none';
  if (t === 'yes') plan = 'pancreaticNecrosectomy-protocol';
  return { plan, t };
}
function DistalPancreatectomy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'distalPancreatectomy-none';
  if (t === 'yes') plan = 'distalPancreatectomy-protocol';
  return { plan, t };
}
function HepaticCystFenestration(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hepaticCystFenestration-none';
  if (t === 'yes') plan = 'hepaticCystFenestration-protocol';
  return { plan, t };
}
function PortalHypertensionShunt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'portalHypertensionShunt-none';
  if (t === 'yes') plan = 'portalHypertensionShunt-protocol';
  return { plan, t };
}
module.exports = { WhippleIndication, LiverResectionHCC, PancreaticCancerStaging, CholangiocarcinomaSurgery, BiliaryReconstruction, LiverTransplantHCC, PancreaticNecrosectomy, DistalPancreatectomy, HepaticCystFenestration, PortalHypertensionShunt };
