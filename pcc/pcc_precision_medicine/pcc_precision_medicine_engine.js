// P3_DB pcc_precision_medicine_engine v3.66.0
'use strict';
function Pharmacogenomics(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pharmacogenomics-none';
  if (t === 'yes') plan = 'pharmacogenomics-protocol';
  return { plan, t };
}
function OmicsProfile(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'omicsprofile-none';
  if (t === 'yes') plan = 'omicsprofile-protocol';
  return { plan, t };
}
function BiomarkerPanel(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'biomarkerpanel-none';
  if (t === 'yes') plan = 'biomarkerpanel-protocol';
  return { plan, t };
}
function TargetedTherapy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'targetedtherapy-none';
  if (t === 'yes') plan = 'targetedtherapy-protocol';
  return { plan, t };
}
function RareVariant(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'rarevariant-none';
  if (t === 'yes') plan = 'rarevariant-protocol';
  return { plan, t };
}
function TumorProfiling(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'tumorprofiling-none';
  if (t === 'yes') plan = 'tumorprofiling-protocol';
  return { plan, t };
}
function MicrobiomeGuide(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'microbiomeguide-none';
  if (t === 'yes') plan = 'microbiomeguide-protocol';
  return { plan, t };
}
function Nutrigenomics(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'nutrigenomics-none';
  if (t === 'yes') plan = 'nutrigenomics-protocol';
  return { plan, t };
}
function Proteomics(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'proteomics-none';
  if (t === 'yes') plan = 'proteomics-protocol';
  return { plan, t };
}
function Metabolomics(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'metabolomics-none';
  if (t === 'yes') plan = 'metabolomics-protocol';
  return { plan, t };
}
module.exports = {
  Pharmacogenomics, OmicsProfile, BiomarkerPanel, TargetedTherapy, RareVariant, TumorProfiling, MicrobiomeGuide, Nutrigenomics, Proteomics, Metabolomics
};
