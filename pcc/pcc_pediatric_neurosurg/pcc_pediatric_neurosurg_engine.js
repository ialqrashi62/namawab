// P3-EI pcc_pediatric_neurosurg_engine v3.99.0
'use strict';
function PediatricHydrocephalus(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricHydrocephalus-none';
  if (t === 'yes') plan = 'pediatricHydrocephalus-protocol';
  return { plan, t };
}
function ChiariMalformation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'chiariMalformation-none';
  if (t === 'yes') plan = 'chiariMalformation-protocol';
  return { plan, t };
}
function Craniosynostosis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'craniosynostosis-none';
  if (t === 'yes') plan = 'craniosynostosis-protocol';
  return { plan, t };
}
function SpinalDysraphism(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'spinalDysraphism-none';
  if (t === 'yes') plan = 'spinalDysraphism-protocol';
  return { plan, t };
}
function PediatricBrainTumorSurg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricBrainTumorSurg-none';
  if (t === 'yes') plan = 'pediatricBrainTumorSurg-protocol';
  return { plan, t };
}
function PediatricEpilepsySurg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricEpilepsySurg-none';
  if (t === 'yes') plan = 'pediatricEpilepsySurg-protocol';
  return { plan, t };
}
function PediatricTBI(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricTBI-none';
  if (t === 'yes') plan = 'pediatricTBI-protocol';
  return { plan, t };
}
function PediatricSpineTrauma(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricSpineTrauma-none';
  if (t === 'yes') plan = 'pediatricSpineTrauma-protocol';
  return { plan, t };
}
function PediatricVascularNeurosurg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricVascularNeurosurg-none';
  if (t === 'yes') plan = 'pediatricVascularNeurosurg-protocol';
  return { plan, t };
}
function PediatricCraniofacial(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricCraniofacial-none';
  if (t === 'yes') plan = 'pediatricCraniofacial-protocol';
  return { plan, t };
}
module.exports = { PediatricHydrocephalus, ChiariMalformation, Craniosynostosis, SpinalDysraphism, PediatricBrainTumorSurg, PediatricEpilepsySurg, PediatricTBI, PediatricSpineTrauma, PediatricVascularNeurosurg, PediatricCraniofacial };
