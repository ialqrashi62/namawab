'use strict';
class ValidationError extends Error { constructor(m){super(m);this.name='ValidationError';} }
const CITATIONS = { asra: 'ASRA Regional Anesthesia Guidelines 2018' };
function ensureNumber(v, name) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(name+' must be number'); return v; }
function ensureEnum(v, opts, name) { if (!opts.includes(v)) throw new ValidationError(name+' must be one of '+opts.join(',')); return v; }
function ensureObj(v, name) { if (!v || typeof v !== 'object') throw new ValidationError(name+' required'); return v; }

function neuraxialBlock(input) {
  ensureObj(input, 'input');
  const inr = ensureNumber(input.inr, 'inr');
  const platelet = ensureNumber(input.platelet, 'platelet');
  const on_anticoagulation = !!input.on_anticoagulation;
  const infection_at_site = !!input.infection_at_site;
  const icp_elevated = !!input.icp_elevated;
  const patient_refusal = !!input.patient_refusal;
  let safe;
  if (inr > 1.5 || platelet < 80 || infection_at_site || icp_elevated || patient_refusal) { safe = 'contraindicated'; }
  else if (on_anticoagulation || inr >= 1.3 || platelet < 100) { safe = 'high_risk_consult'; }
  else { safe = 'safe'; }
  const recommendation = safe === 'safe' ? 'proceed_with_neuraxial' : 'consider_alternative';
  return { inr, platelet, on_anticoagulation, infection_at_site, icp_elevated, patient_refusal, safe, recommendation, citations:['asra'] };
}

function peripheralBlock(input) {
  ensureObj(input, 'input');
  const procedure = ensureEnum(input.procedure, ['shoulder','elbow','forearm','hand','hip','knee','ankle','foot','abdominal','thoracic'], 'procedure');
  const anticoagulated = !!input.anticoagulated;
  const allergy_lido = !!input.allergy_lido;
  let block;
  if (procedure === 'shoulder') { block = 'interscalene'; }
  else if (procedure === 'elbow' || procedure === 'forearm' || procedure === 'hand') { block = 'axillary_or_infraclavicular'; }
  else if (procedure === 'hip') { block = 'fascia_iliaca'; }
  else if (procedure === 'knee') { block = 'femoral_or_adductor'; }
  else if (procedure === 'ankle' || procedure === 'foot') { block = 'ankle_block'; }
  else if (procedure === 'abdominal') { block = 'tap_block'; }
  else { block = 'paravertebral_or_esp'; }
  if (allergy_lido) { block = 'consider_bupivacaine_or_ropivacaine'; }
  return { procedure, anticoagulated, allergy_lido, block };
}

module.exports = { neuraxialBlock, peripheralBlock, CITATIONS, ValidationError };
