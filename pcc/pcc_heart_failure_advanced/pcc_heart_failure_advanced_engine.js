// P3-DI pcc_heart_failure_advanced_engine v3.73.0
'use strict';
function NYHAStaging(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'nyhastaging-none';
  if (t === 'yes') plan = 'nyhastaging-protocol';
  return { plan, t };
}
function BNPTrend(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'bnptrend-none';
  if (t === 'yes') plan = 'bnptrend-protocol';
  return { plan, t };
}
function EjectionFraction(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'ejectionfraction-none';
  if (t === 'yes') plan = 'ejectionfraction-protocol';
  return { plan, t };
}
function FluidStatus(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'fluidstatus-none';
  if (t === 'yes') plan = 'fluidstatus-protocol';
  return { plan, t };
}
function CardiacDevice(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cardiacdevice-none';
  if (t === 'yes') plan = 'cardiacdevice-protocol';
  return { plan, t };
}
function HeartTransplantEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hearttransplanteval-none';
  if (t === 'yes') plan = 'hearttransplanteval-protocol';
  return { plan, t };
}
function PalliativeHF(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'palliativehf-none';
  if (t === 'yes') plan = 'palliativehf-protocol';
  return { plan, t };
}
function AcuteDecompensation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'acutedecompensation-none';
  if (t === 'yes') plan = 'acutedecompensation-protocol';
  return { plan, t };
}
function DiureticStrategy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'diureticstrategy-none';
  if (t === 'yes') plan = 'diureticstrategy-protocol';
  return { plan, t };
}
function SelfManagement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'selfmanagement-none';
  if (t === 'yes') plan = 'selfmanagement-protocol';
  return { plan, t };
}
module.exports = {
  NYHAStaging, BNPTrend, EjectionFraction, FluidStatus, CardiacDevice, HeartTransplantEval, PalliativeHF, AcuteDecompensation, DiureticStrategy, SelfManagement
};
