// P3_DS pcc_dialysis_engine v3.83.0
'use strict';
function DialysisInitiation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dialysisinitiation-none';
  if (t === 'yes') plan = 'dialysisinitiation-protocol';
  return { plan, t };
}
function HDAdequacyKtV(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hdadequacyktv-none';
  if (t === 'yes') plan = 'hdadequacyktv-protocol';
  return { plan, t };
}
function PDAdequacyKtV(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pdadequacyktv-none';
  if (t === 'yes') plan = 'pdadequacyktv-protocol';
  return { plan, t };
}
function CRRTDose(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'crrtdose-none';
  if (t === 'yes') plan = 'crrtdose-protocol';
  return { plan, t };
}
function VascularAccess(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vascularaccess-none';
  if (t === 'yes') plan = 'vascularaccess-protocol';
  return { plan, t };
}
function DialysisHypotension(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dialysishypotension-none';
  if (t === 'yes') plan = 'dialysishypotension-protocol';
  return { plan, t };
}
function DialysisDisequilibrium(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'dialysisdisequilibrium-none';
  if (t === 'yes') plan = 'dialysisdisequilibrium-protocol';
  return { plan, t };
}
function HyperkalemiaDialysis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hyperkalemiadialysis-none';
  if (t === 'yes') plan = 'hyperkalemiadialysis-protocol';
  return { plan, t };
}
function ContrastNephropathyProphylaxis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'contrastnephropathyprophylaxis-none';
  if (t === 'yes') plan = 'contrastnephropathyprophylaxis-protocol';
  return { plan, t };
}
function TransplantWaitlist(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'transplantwaitlist-none';
  if (t === 'yes') plan = 'transplantwaitlist-protocol';
  return { plan, t };
}
module.exports = {
  DialysisInitiation, HDAdequacyKtV, PDAdequacyKtV, CRRTDose, VascularAccess, DialysisHypotension, DialysisDisequilibrium, HyperkalemiaDialysis, ContrastNephropathyProphylaxis, TransplantWaitlist
};
