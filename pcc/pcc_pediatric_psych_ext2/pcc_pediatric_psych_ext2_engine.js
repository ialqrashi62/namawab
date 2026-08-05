// P3_EU pcc_pediatric_psych_ext2_engine v3.111.0
'use strict';
function PediatricASDManagement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricASDManagement-none';
  if (t === 'yes') plan = 'pediatricASDManagement-protocol';
  return { plan, t };
}
function PediatricADHDManagement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricADHDManagement-none';
  if (t === 'yes') plan = 'pediatricADHDManagement-protocol';
  return { plan, t };
}
function PediatricAnxietyManagement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricAnxietyManagement-none';
  if (t === 'yes') plan = 'pediatricAnxietyManagement-protocol';
  return { plan, t };
}
function PediatricDepressionManagement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricDepressionManagement-none';
  if (t === 'yes') plan = 'pediatricDepressionManagement-protocol';
  return { plan, t };
}
function PediatricOCDManagement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricOCDManagement-none';
  if (t === 'yes') plan = 'pediatricOCDManagement-protocol';
  return { plan, t };
}
function PediatricBipolarManagement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricBipolarManagement-none';
  if (t === 'yes') plan = 'pediatricBipolarManagement-protocol';
  return { plan, t };
}
function PediatricTraumaTherapy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricTraumaTherapy-none';
  if (t === 'yes') plan = 'pediatricTraumaTherapy-protocol';
  return { plan, t };
}
function PediatricDBTEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricDBTEval-none';
  if (t === 'yes') plan = 'pediatricDBTEval-protocol';
  return { plan, t };
}
function PediatricFamilyTherapy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricFamilyTherapy-none';
  if (t === 'yes') plan = 'pediatricFamilyTherapy-protocol';
  return { plan, t };
}
function PediatricGroupTherapy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricGroupTherapy-none';
  if (t === 'yes') plan = 'pediatricGroupTherapy-protocol';
  return { plan, t };
}
module.exports = { PediatricASDManagement, PediatricADHDManagement, PediatricAnxietyManagement, PediatricDepressionManagement, PediatricOCDManagement, PediatricBipolarManagement, PediatricTraumaTherapy, PediatricDBTEval, PediatricFamilyTherapy, PediatricGroupTherapy };
