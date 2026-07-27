// P3-ER pcc_neuro_ext9_engine v3.108.0
'use strict';
function AdultPHIEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'adultPHIEval-none';
  if (t === 'yes') plan = 'adultPHIEval-protocol';
  return { plan, t };
}
function PediatricPHIEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricPHIEval-none';
  if (t === 'yes') plan = 'pediatricPHIEval-protocol';
  return { plan, t };
}
function NeurocysticercosisEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neurocysticercosisEval-none';
  if (t === 'yes') plan = 'neurocysticercosisEval-protocol';
  return { plan, t };
}
function CerebralToxoplasmosis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cerebralToxoplasmosis-none';
  if (t === 'yes') plan = 'cerebralToxoplasmosis-protocol';
  return { plan, t };
}
function CerebralMalaria(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cerebralMalaria-none';
  if (t === 'yes') plan = 'cerebralMalaria-protocol';
  return { plan, t };
}
function BrainAbscessEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'brainAbscessEval-none';
  if (t === 'yes') plan = 'brainAbscessEval-protocol';
  return { plan, t };
}
function SubduralEmpyemaEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'subduralEmpyemaEval-none';
  if (t === 'yes') plan = 'subduralEmpyemaEval-protocol';
  return { plan, t };
}
function EpiduralAbscessEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'epiduralAbscessEval-none';
  if (t === 'yes') plan = 'epiduralAbscessEval-protocol';
  return { plan, t };
}
function VentriculitisEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'ventriculitisEval-none';
  if (t === 'yes') plan = 'ventriculitisEval-protocol';
  return { plan, t };
}
function CNSLymphomaEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cNSLymphomaEval-none';
  if (t === 'yes') plan = 'cNSLymphomaEval-protocol';
  return { plan, t };
}
module.exports = { AdultPHIEval, PediatricPHIEval, NeurocysticercosisEval, CerebralToxoplasmosis, CerebralMalaria, BrainAbscessEval, SubduralEmpyemaEval, EpiduralAbscessEval, VentriculitisEval, CNSLymphomaEval };
