// P3-AV: Hand-Therapy Engine — 10 pure functions
const Engine = {};

Engine.GripStrength = function ({ grip = 30, age = 40, hand = 'right', dominant = 'right' } = {}) {
  const expected = age >= 60 ? 28 : (age >= 40 ? 35 : (age >= 20 ? 40 : 30));
  const ratio = grip / expected;
  let classification;
  if (ratio >= 1.0) classification = 'normal-grip';
  else if (ratio >= 0.8) classification = 'near-normal-grip';
  else if (ratio >= 0.6) classification = 'mild-weakness';
  else if (ratio >= 0.4) classification = 'moderate-weakness';
  else classification = 'severe-weakness';
  const handednessFactor = hand === dominant ? 'dominant-hand' : 'non-dominant-hand';
  return { classification, handednessFactor, recommendation: ratio < 0.6 ? 'strengthening-and-OT' : 'monitor' };
};

Engine.PinchStrength = function ({ tipPinch = 8, lateralPinch = 10, threeJawPinch = 10 } = {}) {
  let classification;
  const minPinch = Math.min(tipPinch, lateralPinch, threeJawPinch);
  if (minPinch >= 8) classification = 'normal-pinch-strength';
  else if (minPinch >= 6) classification = 'mild-pinch-weakness';
  else if (minPinch >= 4) classification = 'moderate-pinch-weakness';
  else classification = 'severe-pinch-weakness';
  return { classification, recommendation: minPinch < 6 ? 'OT-pinch-strengthening' : 'monitor' };
};

Engine.CARPA = function ({ thumbIPFlexion = 0, thumbIPExtension = 0, thumbPalmarAbduction = 0, thumbRadialAbduction = 0, thumbOpposition = 0 } = {}) {
  const total = thumbIPFlexion + thumbIPExtension + thumbPalmarAbduction + thumbRadialAbduction + thumbOpposition;
  let assessment;
  if (total >= 100) assessment = 'normal-thumb-CARPA';
  else if (total >= 80) assessment = 'mild-loss-of-thumb-ROM';
  else if (total >= 60) assessment = 'moderate-loss-thumb-OT';
  else if (total >= 40) assessment = 'severe-loss-OT-and-surgical-eval';
  else assessment = 'very-severe-loss-surgical-eval';
  return { total, assessment, recommendation: total < 60 ? 'OT-and-hand-surgery' : 'OT-protocol' };
};

Engine.CARPATotal = function ({ shoulderFlexion = 0, shoulderExtension = 0, shoulderAbduction = 0, shoulderExternal = 0, shoulderInternal = 0, elbowFlexion = 0, elbowExtension = 0, forearmPronation = 0, forearmSupination = 0, wristFlexion = 0, wristExtension = 0, wristRadial = 0, wristUlnar = 0, fingerFlexion = 0, fingerExtension = 0, fingerAbduction = 0, thumbTotal = 0 } = {}) {
  const upperExtremity = shoulderFlexion + shoulderExtension + shoulderAbduction + shoulderExternal + shoulderInternal + elbowFlexion + elbowExtension + forearmPronation + forearmSupination + wristFlexion + wristExtension + wristRadial + wristUlnar + fingerFlexion + fingerExtension + fingerAbduction + thumbTotal;
  let status;
  if (upperExtremity >= 500) status = 'normal-upper-extremity-function';
  else if (upperExtremity >= 400) status = 'mild-loss-OT-protocol';
  else if (upperExtremity >= 300) status = 'moderate-loss-OT-protocol';
  else if (upperExtremity >= 200) status = 'severe-loss-OT-and-surgical';
  else status = 'very-severe-loss-surgical';
  return { upperExtremity, status, recommendation: upperExtremity < 400 ? 'intensive-OT-and-hand-surgery-consult' : 'maintenance-OT' };
};

Engine.TinelSign = function ({ nerve = 'median', location = 'wrist', symptoms = 'positive' } = {}) {
  let interpretation;
  if (symptoms === 'positive' && nerve === 'median' && location === 'wrist') interpretation = 'positive-Tinel-carpal-tunnel-syndrome';
  else if (symptoms === 'positive' && nerve === 'ulnar' && location === 'elbow') interpretation = 'positive-Tinel-cubital-tunnel';
  else if (symptoms === 'positive') interpretation = `positive-Tinel-${nerve}-at-${location}`;
  else interpretation = 'negative-Tinel';
  return { interpretation, recommendation: interpretation.includes('positive') ? 'EMG-NCS-and-hand-surgery' : 'monitor' };
};

Engine.PhalenTest = function ({ duration = 30, symptoms = 'positive', position = 'wrist-flexion' } = {}) {
  let result;
  if (symptoms === 'positive' && duration >= 30) result = 'Phalen-positive-carpal-tunnel';
  else if (symptoms === 'positive' && duration >= 60) result = 'Phalen-strongly-positive-carpal-tunnel';
  else if (symptoms === 'mild') result = 'Phalen-mildly-positive';
  else result = 'Phalen-negative';
  return { result, recommendation: result.includes('positive') ? 'EMG-NCS-and-hand-surgery' : 'monitor' };
};

Engine.DupuytrenContracture = function ({ palmNodule = false, pretendinousCord = false, mcpContracture = 5, pipContracture = 0 } = {}) {
  let stage;
  if (!palmNodule && !pretendinousCord) stage = 'no-Dupuytren';
  else if (palmNodule && !pretendinousCord) stage = 'early-Dupuytren-nodule-only';
  else if (mcpContracture === 0 && pipContracture === 0) stage = 'Dupuytren-cord-no-contracture';
  else if (mcpContracture < 30) stage = 'mild-Dupuytren-MCP-contracture';
  else if (mcpContracture >= 30 && pipContracture < 30) stage = 'moderate-Dupuytren-candidate-for-needle-aponeurotomy';
  else if (mcpContracture >= 30 && pipContracture >= 30) stage = 'severe-Dupuytren-candidate-for-surgery';
  else stage = 'unspecified';
  return { stage, recommendation: stage.includes('moderate') || stage.includes('severe') ? 'hand-surgery' : 'monitor' };
};

Engine.FlexorTendonRepair = function ({ zone = 2, weeksPost = 2, tendonGlide = 'early', protocol = 'modified-Kleinert' } = {}) {
  let status;
  if (zone === 2 && weeksPost < 3) status = 'early-protected-motion';
  else if (zone === 2 && weeksPost < 6) status = 'mid-active-motion';
  else if (zone === 2 && weeksPost < 12) status = 'late-strengthening';
  else if (zone === 5 && weeksPost < 6) status = 'early-zone-5-protected';
  else if (zone === 1) status = 'zone-1-Doyle-protocol';
  else status = 'standard-tendon-rehab';
  if (tendonGlide === 'limited') status += '-and-address-adhesions';
  return { status, recommendation: 'hand-therapy-protocol-following-repair' };
};

Engine.RSDSCRPS = function ({ pain = 5, swelling = false, temperatureChange = false, trophicChanges = false, weeksPost = 8 } = {}) {
  let diagnosis;
  if (pain >= 7 && swelling && temperatureChange && weeksPost >= 4) diagnosis = 'CRPS-stage-1-warm-edematous';
  else if (pain >= 5 && trophicChanges && weeksPost >= 12) diagnosis = 'CRPS-stage-2-dystrophic';
  else if (pain >= 3 && weeksPost >= 26) diagnosis = 'CRPS-stage-3-atrophic';
  else if (pain >= 4 && (swelling || temperatureChange)) diagnosis = 'CRPS-suspected-early';
  else diagnosis = 'no-CRPS';
  return { diagnosis, recommendation: diagnosis.includes('CRPS') && !diagnosis.includes('no') ? 'desensitization-mirror-therapy-and-pain-management' : 'monitor' };
};

Engine.Splinting = function ({ condition = 'CTS', splintType = 'wrist-cock-up', durationWeeks = 6, dayOrNight = 'night' } = {}) {
  let recommendation;
  if (condition === 'CTS' && splintType === 'wrist-cock-up' && dayOrNight === 'night') recommendation = 'night-wrist-cock-up-6-weeks-CTS';
  else if (condition === 'trigger-finger' && splintType === 'MCP-block') recommendation = 'MCP-block-splint-6-weeks-trigger-finger';
  else if (condition === 'Dupuytren-post-op') recommendation = 'post-op-extension-splint-Dupuytren';
  else if (condition === 'RA-wrist') recommendation = 'RA-wrist-resting-splint';
  else if (condition === 'burn') recommendation = 'anti-deformity-burn-splint';
  else recommendation = 'individualized-splint';
  return { recommendation, protocolDuration: durationWeeks, recWithDuration: `${recommendation}-${durationWeeks}-weeks` };
};

module.exports = Engine;
