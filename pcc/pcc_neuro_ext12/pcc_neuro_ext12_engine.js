// P3_EU pcc_neuro_ext12_engine v3.111.0
'use strict';
function NeuroAIDSEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neuroAIDSEval-none';
  if (t === 'yes') plan = 'neuroAIDSEval-protocol';
  return { plan, t };
}
function PMLDiagnosis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pMLDiagnosis-none';
  if (t === 'yes') plan = 'pMLDiagnosis-protocol';
  return { plan, t };
}
function JCVEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'jCVEval-none';
  if (t === 'yes') plan = 'jCVEval-protocol';
  return { plan, t };
}
function ToxoplasmosisCerebral(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'toxoplasmosisCerebral-none';
  if (t === 'yes') plan = 'toxoplasmosisCerebral-protocol';
  return { plan, t };
}
function CryptococcalMeningitis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cryptococcalMeningitis-none';
  if (t === 'yes') plan = 'cryptococcalMeningitis-protocol';
  return { plan, t };
}
function TBMeningitisEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'tB MeningitisEval-none';
  if (t === 'yes') plan = 'tB MeningitisEval-protocol';
  return { plan, t };
}
function LymeNeuroborreliosis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'lymeNeuroborreliosis-none';
  if (t === 'yes') plan = 'lymeNeuroborreliosis-protocol';
  return { plan, t };
}
function BrucellosisNeuro(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'brucellosisNeuro-none';
  if (t === 'yes') plan = 'brucellosisNeuro-protocol';
  return { plan, t };
}
function WhippleDiseaseNeuro(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'whippleDiseaseNeuro-none';
  if (t === 'yes') plan = 'whippleDiseaseNeuro-protocol';
  return { plan, t };
}
function BehcetNeuroSyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'behcetNeuroSyndrome-none';
  if (t === 'yes') plan = 'behcetNeuroSyndrome-protocol';
  return { plan, t };
}
module.exports = { NeuroAIDSEval, PMLDiagnosis, JCVEval, ToxoplasmosisCerebral, CryptococcalMeningitis, TBMeningitisEval, LymeNeuroborreliosis, BrucellosisNeuro, WhippleDiseaseNeuro, BehcetNeuroSyndrome };
