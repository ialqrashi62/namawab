// P3-DP pcc_immunology_advanced_engine v3.80.0
'use strict';
function PrimaryImmunodeficiency(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'primaryimmunodeficiency-none';
  if (t === 'yes') plan = 'primaryimmunodeficiency-protocol';
  return { plan, t };
}
function SecondaryImmunodeficiency(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'secondaryimmunodeficiency-none';
  if (t === 'yes') plan = 'secondaryimmunodeficiency-protocol';
  return { plan, t };
}
function AutoimmuneLymphoproliferative(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'autoimmunelymphoproliferative-none';
  if (t === 'yes') plan = 'autoimmunelymphoproliferative-protocol';
  return { plan, t };
}
function ImmuneReconstitution(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'immunereconstitution-none';
  if (t === 'yes') plan = 'immunereconstitution-protocol';
  return { plan, t };
}
function CytokineStorm(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cytokinestorm-none';
  if (t === 'yes') plan = 'cytokinestorm-protocol';
  return { plan, t };
}
function HypersensitivityPneumonitis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hypersensitivitypneumonitis-none';
  if (t === 'yes') plan = 'hypersensitivitypneumonitis-protocol';
  return { plan, t };
}
function ImmuneCheckpointToxicity(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'immunecheckpointtoxicity-none';
  if (t === 'yes') plan = 'immunecheckpointtoxicity-protocol';
  return { plan, t };
}
function TransplantRejectionImmune(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'transplantrejectionimmune-none';
  if (t === 'yes') plan = 'transplantrejectionimmune-protocol';
  return { plan, t };
}
function VaccineResponseAssessment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vaccineresponseassessment-none';
  if (t === 'yes') plan = 'vaccineresponseassessment-protocol';
  return { plan, t };
}
function BiologicMonitoring(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'biologicmonitoring-none';
  if (t === 'yes') plan = 'biologicmonitoring-protocol';
  return { plan, t };
}
module.exports = {
  PrimaryImmunodeficiency, SecondaryImmunodeficiency, AutoimmuneLymphoproliferative, ImmuneReconstitution, CytokineStorm, HypersensitivityPneumonitis, ImmuneCheckpointToxicity, TransplantRejectionImmune, VaccineResponseAssessment, BiologicMonitoring
};
