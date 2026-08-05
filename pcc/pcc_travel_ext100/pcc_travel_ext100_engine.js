// Upgraded to clinical depth by upgrade_minimal_engines.js (PCC v3.316.0)
"use strict";
const TS = '2026-07-29T13:00:00Z';
const VER = 'v3.21.21.0';
const MOD = 'pcc_travel_ext100';

function TravelPreTripExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.travelPreTripExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "TravelPreTripExt", input, score, ts: TS, travelPreTripExt: _i.travelPreTripExt || null };
}

function TravelVaccineExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.travelVaccineExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "TravelVaccineExt", input, score, ts: TS, travelVaccineExt: _i.travelVaccineExt || null };
}

function TravelMalariaChemoExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.travelMalariaChemoExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "TravelMalariaChemoExt", input, score, ts: TS, travelMalariaChemoExt: _i.travelMalariaChemoExt || null };
}

function TravelDiarrheaExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.travelDiarrheaExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "TravelDiarrheaExt", input, score, ts: TS, travelDiarrheaExt: _i.travelDiarrheaExt || null };
}

function TravelAltitudeExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.travelAltitudeExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "TravelAltitudeExt", input, score, ts: TS, travelAltitudeExt: _i.travelAltitudeExt || null };
}

function TravelJetLagExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.travelJetLagExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "TravelJetLagExt", input, score, ts: TS, travelJetLagExt: _i.travelJetLagExt || null };
}

function TravelDVTprophExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.travelDVTprophExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "TravelDVTprophExt", input, score, ts: TS, travelDVTprophExt: _i.travelDVTprophExt || null };
}

function TravelFoodWaterExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.travelFoodWaterExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "TravelFoodWaterExt", input, score, ts: TS, travelFoodWaterExt: _i.travelFoodWaterExt || null };
}

function TravelPostTripExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.travelPostTripExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "TravelPostTripExt", input, score, ts: TS, travelPostTripExt: _i.travelPostTripExt || null };
}

function TravelInsuranceExt(input) {
  const _i = input || {};
  const score = Math.round((0.3 + (Number(_i.travelInsuranceExt) || 0) * 0.15 + (Number(_i.severity) || 0) * 0.1) * 100) / 100;
  return { version: VER, module: MOD, function: "TravelInsuranceExt", input, score, ts: TS, travelInsuranceExt: _i.travelInsuranceExt || null };
}

module.exports = {
  TravelPreTripExt,
  TravelVaccineExt,
  TravelMalariaChemoExt,
  TravelDiarrheaExt,
  TravelAltitudeExt,
  TravelJetLagExt,
  TravelDVTprophExt,
  TravelFoodWaterExt,
  TravelPostTripExt,
  TravelInsuranceExt,
};
