// P3-ET pcc_neuro_ext11_engine v3.110.0
'use strict';
function DemyelinatingPolyneuropathy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'demyelinatingPolyneuropathy-none';
  if (t === 'yes') plan = 'demyelinatingPolyneuropathy-protocol';
  return { plan, t };
}
function CIDPExtEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cIDPExtEval-none';
  if (t === 'yes') plan = 'cIDPExtEval-protocol';
  return { plan, t };
}
function GBSVariantEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'gBSVariantEval-none';
  if (t === 'yes') plan = 'gBSVariantEval-protocol';
  return { plan, t };
}
function MillerFisherSyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'millerFisherSyndrome-none';
  if (t === 'yes') plan = 'millerFisherSyndrome-protocol';
  return { plan, t };
}
function BickerstaffBrainstemEncephalitis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'bickerstaffBrainstemEncephalitis-none';
  if (t === 'yes') plan = 'bickerstaffBrainstemEncephalitis-protocol';
  return { plan, t };
}
function AMANEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'aMANEval-none';
  if (t === 'yes') plan = 'aMANEval-protocol';
  return { plan, t };
}
function SensoryCIDPEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'sensoryCIDPEval-none';
  if (t === 'yes') plan = 'sensoryCIDPEval-protocol';
  return { plan, t };
}
function MotorCIDPEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'motorCIDPEval-none';
  if (t === 'yes') plan = 'motorCIDPEval-protocol';
  return { plan, t };
}
function AutonomicNeuropathyEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'autonomicNeuropathyEval-none';
  if (t === 'yes') plan = 'autonomicNeuropathyEval-protocol';
  return { plan, t };
}
function SmallFiberNeuropathyEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'smallFiberNeuropathyEval-none';
  if (t === 'yes') plan = 'smallFiberNeuropathyEval-protocol';
  return { plan, t };
}
module.exports = { DemyelinatingPolyneuropathy, CIDPExtEval, GBSVariantEval, MillerFisherSyndrome, BickerstaffBrainstemEncephalitis, AMANEval, SensoryCIDPEval, MotorCIDPEval, AutonomicNeuropathyEval, SmallFiberNeuropathyEval };
