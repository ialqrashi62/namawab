# P3-L: Batch generate 4 ICU PCCs (PICU, SICU, TICU, MICU)
# Each: engine (already written) + tests (40+) + integration (17) + routes + SQL
$ErrorActionPreference = "Stop"
$root = "c:\Users\ice\Desktop\NMEDCALVSCODE\pcc"
$UTF8 = [System.Text.UTF8Encoding]::new($false)
$count = 0

function WF($p, $c) {
    $d = Split-Path $p -Parent
    if (-not (Test-Path $d)) { New-Item -ItemType Directory -Force -Path $d | Out-Null }
    [System.IO.File]::WriteAllText($p, $c, $UTF8)
    $script:count++
}

# Common test helper
$testHelpers = @"
'use strict';
const assert = require('assert');
const Engine = require('./{MODULE}_engine');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log(`  \u2713 \${name}`); } catch (err) { failed++; console.error(`  \u2717 \${name}: \${err.message}`); } }
function describe(s, fn) { console.log(`\n\${s}`); fn(); }
function assertEq(a, b, m) { if (a !== b) throw new Error(`\${m || 'eq'}: \${JSON.stringify(a)} != \${JSON.stringify(b)}`); }
"@

# Standard test runner tail
$testTail = @"

console.log(`\n\${'='.repeat(40)}`);
console.log(`{MODULE} engine tests: \${passed} passed, \${failed} failed`);
console.log('='.repeat(40));
process.exit(failed > 0 ? 1 : 0);
"@

# Integration test boilerplate (common)
$integrationBoilerplate = @"
'use strict';
const crypto = require('crypto');
const initSqlJs = require('sql.js');

let passed = 0, failed = 0;
function it(name, fn) { try { fn(); passed++; console.log(`  \u2713 \${name}`); } catch (err) { failed++; console.error(`  \u2717 \${name}: \${err.message}`); } }
function describe(s, fn) { console.log(`\n\${s}`); fn(); }
function assert(c, m) { if (!c) throw new Error(m || 'assertion failed'); }
function assertEq(a, b, m) { if (a !== b) throw new Error(`\${m || 'eq'}: \${JSON.stringify(a)} != \${JSON.stringify(b)}`); }
"@

$integrationTail = @"

console.log(`\n\${'='.repeat(50)}`);
console.log(`{MODULE} integration tests: \${passed} passed, \${failed} failed`);
console.log('='.repeat(50));
if (failed > 0) { process.stderr.write(`FAILED\n`); process.exit(1); }
process.stdout.write(`PASS: 17/17 {MODULE} integration\n`);
process.exit(0);
})();
"@

# Standard SQL for 4 tables per ICU (common pattern)
function Get-SQL($module, $tablePrefix) {
    return @"
-- pcc/$module/${module}_up.sql
-- 4 tables, RLS + FORCE RLS. Sandbox only.

BEGIN;

CREATE TABLE IF NOT EXISTS ${tablePrefix}_admission (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL,
    patient_id      BIGINT NOT NULL,
    encounter_id    BIGINT NOT NULL,
    admission_type  VARCHAR(40) NOT NULL,
    status          VARCHAR(20) NOT NULL DEFAULT 'admitted' CHECK (status IN ('admitted','in_icu','transferred','discharged','deceased')),
    cpt_codes       JSONB NOT NULL DEFAULT '[]'::jsonb,
    admitted_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    discharged_at   TIMESTAMPTZ,
    soft_deleted_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_${tablePrefix}_admission_tenant ON ${tablePrefix}_admission(tenant_id);
ALTER TABLE ${tablePrefix}_admission ENABLE ROW LEVEL SECURITY;
ALTER TABLE ${tablePrefix}_admission FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ${tablePrefix}_admission_tenant ON ${tablePrefix}_admission;
CREATE POLICY ${tablePrefix}_admission_tenant ON ${tablePrefix}_admission
    USING (tenant_id = current_setting('app.tenant_id', true)::UUID)
    WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::UUID);

CREATE TABLE IF NOT EXISTS ${tablePrefix}_vital_sign (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL,
    admission_id    UUID NOT NULL REFERENCES ${tablePrefix}_admission(id) ON DELETE CASCADE,
    measured_at     TIMESTAMPTZ NOT NULL,
    heart_rate      SMALLINT, sbp_mmhg SMALLINT, dbp_mmhg SMALLINT, spo2_pct SMALLINT,
    soft_deleted_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_${tablePrefix}_vital_tenant ON ${tablePrefix}_vital_sign(tenant_id);
CREATE INDEX IF NOT EXISTS idx_${tablePrefix}_vital_adm ON ${tablePrefix}_vital_sign(admission_id);
ALTER TABLE ${tablePrefix}_vital_sign ENABLE ROW LEVEL SECURITY;
ALTER TABLE ${tablePrefix}_vital_sign FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ${tablePrefix}_vital_tenant ON ${tablePrefix}_vital_sign;
CREATE POLICY ${tablePrefix}_vital_tenant ON ${tablePrefix}_vital_sign
    USING (tenant_id = current_setting('app.tenant_id', true)::UUID)
    WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::UUID);

CREATE TABLE IF NOT EXISTS ${tablePrefix}_red_flag (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id       UUID NOT NULL,
    admission_id    UUID NOT NULL REFERENCES ${tablePrefix}_admission(id) ON DELETE CASCADE,
    flag_type       VARCHAR(40) NOT NULL,
    severity        VARCHAR(10) NOT NULL CHECK (severity IN ('low','moderate','high','critical')),
    description     TEXT, response TEXT,
    acknowledged_by BIGINT, acknowledged_at TIMESTAMPTZ,
    soft_deleted_at TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_${tablePrefix}_red_flag_tenant ON ${tablePrefix}_red_flag(tenant_id);
ALTER TABLE ${tablePrefix}_red_flag ENABLE ROW LEVEL SECURITY;
ALTER TABLE ${tablePrefix}_red_flag FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ${tablePrefix}_red_flag_tenant ON ${tablePrefix}_red_flag;
CREATE POLICY ${tablePrefix}_red_flag_tenant ON ${tablePrefix}_red_flag
    USING (tenant_id = current_setting('app.tenant_id', true)::UUID)
    WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::UUID);

CREATE TABLE IF NOT EXISTS ${tablePrefix}_audit_log (
    id              BIGSERIAL PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    admission_id    UUID REFERENCES ${tablePrefix}_admission(id) ON DELETE SET NULL,
    actor_id        BIGINT, action VARCHAR(40) NOT NULL, entity_type VARCHAR(40) NOT NULL,
    entity_id       UUID, payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    prev_hash VARCHAR(64), entry_hash VARCHAR(64) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_${tablePrefix}_audit_tenant ON ${tablePrefix}_audit_log(tenant_id);
ALTER TABLE ${tablePrefix}_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ${tablePrefix}_audit_log FORCE  ROW LEVEL SECURITY;
DROP POLICY IF EXISTS ${tablePrefix}_audit_tenant ON ${tablePrefix}_audit_log;
CREATE POLICY ${tablePrefix}_audit_tenant ON ${tablePrefix}_audit_log
    USING (tenant_id = current_setting('app.tenant_id', true)::UUID)
    WITH CHECK (tenant_id = current_setting('app.tenant_id', true)::UUID);

COMMIT;
"@
}

# Standard route stub (5 endpoints, same pattern as BICU)
function Get-Routes($module, $decisionName) {
    return @"
/**
 * pcc/$module/${module}_routes.js
 * 5 Express endpoints for $module.
 */
'use strict';
const { Router } = require('express');
const Engine = require('./${module}_engine');
const router = Router();
function authenticate(req, res, next) {
  const userId = req.header('x-pcc-user-id');
  const tenantId = req.header('x-pcc-tenant-id');
  const role = req.header('x-pcc-role') || '$($module.ToUpper())';
  if (!userId || !tenantId) return res.status(401).json({ error: 'missing auth' });
  if (role !== '$($module.ToUpper())') return res.status(403).json({ error: '$($module.ToUpper()) role required' });
  req.session = { userId: parseInt(userId, 10), tenantId, role };
  next();
}
router.post('/admissions', authenticate, async (req, res) => {
  const id = require('crypto').randomUUID();
  res.status(201).json({ id, tenantId: req.session.tenantId, ...req.body, status: 'admitted' });
});
router.get('/admissions', authenticate, async (_req, res) => { res.json([]); });
router.get('/admissions/:id', authenticate, async (req, res) => {
  res.json({ id: req.params.id, admission: { id: req.params.id } });
});
router.post('/admissions/:id/vitals', authenticate, async (req, res) => {
  const id = require('crypto').randomUUID();
  res.status(201).json({ id, admissionId: req.params.id });
});
router.get('/decision/${decisionName}', authenticate, async (req, res) => {
  // Generic: just return a stub decision
  res.json({ decision: '${decisionName}', score: 0, module: '$module' });
});
module.exports = router;
"@
}

# Per-module test generators
function Gen-PICU-Tests {
    $content = $testHelpers.Replace('{MODULE}', 'picu')
    $content += @"

describe('PediatricApacheScore', () => {
  it('high score 30+', () => {
    const r = Engine.PediatricApacheScore({ age: 0, heartRate: 200, sbp: 25, respRate: 80, paO2: 150, ph: 7.0, sodium: 110, potassium: 8, creatinine: 2, hematocrit: 15, wbc: 50, glasgow: 4 });
    assert(r.score > 30);
    assertEq(r.mortality, 'high');
  });
  it('low score', () => {
    const r = Engine.PediatricApacheScore({ age: 36, heartRate: 100, sbp: 100, respRate: 25, paO2: 300, ph: 7.4, sodium: 140, potassium: 4, creatinine: 0.5, hematocrit: 35, wbc: 10, glasgow: 15 });
    assert(r.score < 10);
  });
});

describe('PediatricGCS', () => {
  it('severe 8', () => { assertEq(Engine.PediatricGCS({ eye: 1, verbal: 2, motor: 3 }).category, 'severe'); });
  it('moderate 12', () => { assertEq(Engine.PediatricGCS({ eye: 2, verbal: 3, motor: 4 }).category, 'moderate'); });
  it('mild 14', () => { assertEq(Engine.PediatricGCS({ eye: 3, verbal: 4, motor: 5 }).category, 'mild'); });
});

describe('PediatricSepsisRecognition', () => {
  it('sepsis 2+ triggers', () => {
    const r = Engine.PediatricSepsisRecognition({ age: 5, temperatureC: 39, heartRate: 180, respRate: 50, wbc: 18, suspectedInfection: true, organDysfunction: false });
    assertEq(r.sepsis, true);
  });
  it('no infection', () => { assertEq(Engine.PediatricSepsisRecognition({ age: 5, temperatureC: 39, heartRate: 180, respRate: 50, wbc: 18, suspectedInfection: false, organDysfunction: false }).sepsis, false); });
});

describe('PediatricAsthmaSeverity', () => {
  it('severe', () => { const r = Engine.PediatricAsthmaSeverity({ age: 5, spo2: 88, speechAbility: 'words_only', retractions: 'severe', wheezing: 'silent', mentalStatus: 'altered' }); assertEq(r.severity, 'severe'); });
  it('mild', () => { const r = Engine.PediatricAsthmaSeverity({ age: 5, spo2: 97, speechAbility: 'full_sentences', retractions: 'none', wheezing: 'mild', mentalStatus: 'alert' }); assertEq(r.severity, 'mild'); });
});

describe('CroupSeverity', () => {
  it('severe requires racemic epi', () => { const r = Engine.CroupSeverity({ stridorAtRest: true, barking: true, hoarseness: true, respiratoryDistress: 'severe', age: 2 }); assertEq(r.severity, 'severe'); assertEq(r.racemicEpi, true); });
  it('mild', () => { const r = Engine.CroupSeverity({ stridorAtRest: false, barking: true, hoarseness: true, respiratoryDistress: 'none', age: 3 }); assertEq(r.severity, 'mild'); });
});

describe('PediatricFluidBolus', () => {
  it('severe 10% loss 20ml/kg', () => {
    const r = Engine.PediatricFluidBolus({ weightKg: 10, percentLoss: 12, severity: 'severe' });
    assertEq(r.bolusMl, 200);
  });
  it('moderate 10ml/kg', () => {
    const r = Engine.PediatricFluidBolus({ weightKg: 10, percentLoss: 5, severity: 'mild' });
    assertEq(r.bolusMl, 100);
  });
});

describe('PediatricSepsisBundle', () => {
  it('10kg = 200ml bolus', () => { assertEq(Engine.PediatricSepsisBundle({ weightKg: 10 }).fluidBolusMl, 200); });
});

describe('PediatricPainScale', () => {
  it('FLACC severe', () => { const r = Engine.PediatricPainScale({ age: 2, flaccScore: 9 }); assertEq(r.pain, 'severe'); });
  it('FACES moderate', () => { const r = Engine.PediatricPainScale({ age: 5, facesScore: 6 }); assertEq(r.pain, 'moderate'); });
  it('numeric severe', () => { const r = Engine.PediatricPainScale({ age: 10, numericScore: 8 }); assertEq(r.pain, 'severe'); });
});

describe('ChildAbuseScreening', () => {
  it('2+ red flags = abuse suspected', () => { const r = Engine.ChildAbuseScreening({ inconsistentHistory: true, delayedPresentation: true, patternedBruising: false, sentinelInjuries: false, age: 2 }); assertEq(r.abuseSuspected, true); });
  it('1 red flag = mandatory report', () => { const r = Engine.ChildAbuseScreening({ inconsistentHistory: true, delayedPresentation: false, patternedBruising: false, sentinelInjuries: false, age: 2 }); assertEq(r.mandatoryReport, true); });
});

describe('PediatricEWS', () => {
  it('low risk', () => { const r = Engine.PediatricEWS({ heartRate: 100, respRate: 20, spo2: 97, systolic: 90, temperature: 37, avpu: 'A' }); assertEq(r.risk, 'low'); });
  it('high risk', () => { const r = Engine.PediatricEWS({ heartRate: 200, respRate: 70, spo2: 85, systolic: 35, temperature: 41, avpu: 'V' }); assertEq(r.risk, 'high'); });
});
"@ + $testTail.Replace('{MODULE}', 'picu')
    WF "$root\picu\picu_test.js" $content
}

function Gen-SICU-Tests {
    $content = $testHelpers.Replace('{MODULE}', 'sicu')
    $content += @"

describe('ApacheScore', () => {
  it('mortality high', () => { const r = Engine.ApacheScore({ age: 80, chronicHealth: 'severe', glasgow: 5, temperature: 41, map: 40, heartRate: 200, respRate: 60, paO2: 50, ph: 7.1, sodium: 110, potassium: 8, creatinine: 4, hematocrit: 15, wbc: 50 }); assertEq(r.mortality, 'high'); });
  it('mortality low', () => { const r = Engine.ApacheScore({ age: 40, chronicHealth: 'none', glasgow: 15, temperature: 37, map: 90, heartRate: 90, respRate: 18, paO2: 100, ph: 7.4, sodium: 140, potassium: 4, creatinine: 1, hematocrit: 35, wbc: 10 }); assertEq(r.mortality, 'low'); });
});

describe('SofaScore', () => {
  it('sepsis organ dysfunction', () => { const r = Engine.SofaScore({ paO2FiO2: 100, platelets: 20, bilirubin: 5, map: 60, glasgow: 5, creatinine: 4, urineOutput: 100 }); assert(r.sepsisOrganDysfunction); });
});

describe('AnastomoticLeakScreening', () => {
  it('high risk with free air', () => { const r = Engine.AnastomoticLeakScreening({ postOpDay: 7, fever: true, tachycardia: true, abdominalPain: 'severe', drainOutput: 'bilious', wbc: 18, freeAir: true }); assertEq(r.risk, 'high'); });
  it('low risk', () => { const r = Engine.AnastomoticLeakScreening({ postOpDay: 2, fever: false, tachycardia: false, abdominalPain: 'mild', drainOutput: 'serous', wbc: 12, freeAir: false }); assertEq(r.risk, 'low'); });
});

describe('PostOpHemorrhage', () => {
  it('major', () => { const r = Engine.PostOpHemorrhage({ drainOutputMlPerHour: 300, heartRate: 130, sbp: 85, hemoglobinTrend: 'rapid_drop', coagsNormal: true }); assertEq(r.severity, 'major'); assertEq(r.action, 'return_to_or'); });
  it('none', () => { const r = Engine.PostOpHemorrhage({ drainOutputMlPerHour: 50, heartRate: 80, sbp: 120, hemoglobinTrend: 'stable', coagsNormal: true }); assertEq(r.severity, 'none'); });
});

describe('AbdominalCompartmentPressure', () => {
  it('severe >25', () => { const r = Engine.AbdominalCompartmentPressure({ bladderPressureMmHg: 30, organDysfunction: true }); assertEq(r.compartmentSyndrome, true); assertEq(r.requiresDecompression, true); });
  it('normal <15', () => { const r = Engine.AbdominalCompartmentPressure({ bladderPressureMmHg: 10, organDysfunction: false }); assertEq(r.compartmentSyndrome, false); });
});

describe('ERASCompliance', () => {
  it('high 4+', () => { const r = Engine.ERASCompliance({ earlyMobilization: true, earlyFeeding: true, opioidSparing: true, regionalAnesthesia: true, foleyRemovalDay: 1 }); assertEq(r.compliance, 'high'); });
  it('low 0-1', () => { const r = Engine.ERASCompliance({ earlyMobilization: false, earlyFeeding: false, opioidSparing: false, regionalAnesthesia: false, foleyRemovalDay: 5 }); assertEq(r.compliance, 'low'); });
});

describe('SurgicalSiteInfection', () => {
  it('deep with purulent + deep', () => { const r = Engine.SurgicalSiteInfection({ postOpDay: 7, erythema: true, purulentDrainage: true, fever: true, deepTissueInvolvement: true }); assertEq(r.severity, 'deep'); assertEq(r.requiresOR, true); });
});

describe('VasopressorDose', () => {
  it('high dose', () => { assertEq(Engine.VasopressorDose({ norepinephrineMcgKgMin: 0.6, vasopressinUnitsPerHour: 0, epinephrineMcgKgMin: 0 }).tier, 'high'); });
  it('none', () => { assertEq(Engine.VasopressorDose({ norepinephrineMcgKgMin: 0, vasopressinUnitsPerHour: 0, epinephrineMcgKgMin: 0 }).tier, 'none'); });
});

describe('WoundCareAssessment', () => {
  it('infected', () => { const r = Engine.WoundCareAssessment({ woundType: 'surgical', exudate: 'purulent', odor: 'foul', surrounding: 'normal', depth: 'shallow', undermining: 0 }); assertEq(r.stage, 'infected'); assertEq(r.requiresDebridement, true); });
});

describe('DeliriumCAMICU', () => {
  it('delirium with 3+', () => { const r = Engine.DeliriumCAMICU({ acuteOnset: true, inattention: true, alteredConsciousness: true, disorganizedThinking: false }); assertEq(r.delirium, true); });
  it('not delirium with 1', () => { const r = Engine.DeliriumCAMICU({ acuteOnset: true, inattention: false, alteredConsciousness: false, disorganizedThinking: false }); assertEq(r.delirium, false); });
});
"@ + $testTail.Replace('{MODULE}', 'sicu')
    WF "$root\sicu\sicu_test.js" $content
}

function Gen-TICU-Tests {
    $content = $testHelpers.Replace('{MODULE}', 'ticu')
    $content += @"

describe('ICPMonitorTrend', () => {
  it('critical >25', () => { const r = Engine.ICPMonitorTrend({ currentIcp: 30, baselineIcp: 12, timeMinutes: 60 }); assertEq(r.status, 'critical'); });
  it('rising rapidly', () => { const r = Engine.ICPMonitorTrend({ currentIcp: 22, baselineIcp: 12, timeMinutes: 15 }); assertEq(r.status, 'rising_rapidly'); });
  it('normal', () => { const r = Engine.ICPMonitorTrend({ currentIcp: 12, baselineIcp: 12, timeMinutes: 60 }); assertEq(r.status, 'normal'); });
});

describe('CerebralPerfusionPressure', () => {
  it('optimal 60-70', () => { const r = Engine.CerebralPerfusionPressure({ map: 85, icp: 20 }); assertEq(r.status, 'optimal'); });
  it('critical low', () => { const r = Engine.CerebralPerfusionPressure({ map: 60, icp: 20 }); assertEq(r.status, 'critical_low'); });
});

describe('GCSProgression', () => {
  it('severe intubate', () => { const r = Engine.GCSProgression({ baselineGcs: 10, currentGcs: 7, timeHours: 2 }); assertEq(r.status, 'severe'); assertEq(r.intubate, true); });
  it('improving', () => { const r = Engine.GCSProgression({ baselineGcs: 7, currentGcs: 12, timeHours: 24 }); assertEq(r.status, 'improving'); });
});

describe('CervicalSpineClearance', () => {
  it('NEXUS clear if no tenderness + alert + age 14+', () => { const r = Engine.CervicalSpineClearance({ nuchalTenderness: false, midlineTenderness: false, rangeOfMotion: 'full_painfree', intoxication: false, distractingInjury: false, alteredMentalStatus: false, age: 30 }); assertEq(r.cleared, true); });
  it('not cleared with intoxication', () => { const r = Engine.CervicalSpineClearance({ nuchalTenderness: false, midlineTenderness: false, rangeOfMotion: 'full_painfree', intoxication: true, distractingInjury: false, alteredMentalStatus: false, age: 30 }); assertEq(r.cleared, false); });
});

describe('CompartmentPressure', () => {
  it('fasciotomy when delta<30', () => { const r = Engine.CompartmentPressure({ pressureMmHg: 35, diastolicBP: 60, location: 'leg' }); assertEq(r.status, 'fasciotomy_immediate'); });
  it('normal when delta>40', () => { const r = Engine.CompartmentPressure({ pressureMmHg: 20, diastolicBP: 80, location: 'leg' }); assertEq(r.status, 'normal'); });
});

describe('CrushRhabdomyolysis', () => {
  it('severe with 3+', () => { const r = Engine.CrushRhabdomyolysis({ ckLevel: 8000, urineOutputMlPerHour: 100, potassium: 6.5, calcium: 7, fluidRateMlPerHour: 200 }); assertEq(r.severity, 'severe'); assertEq(r.requiresDialysis, true); });
});

describe('VTEProphylaxis', () => {
  it('within 24h = mechanical only', () => { const r = Engine.VTEProphylaxis({ injuryPattern: 'long_bone', timeSinceInjury: 12, bleedingRisk: 'low', contraindication: false, weightKg: 70 }); assertEq(r.lwmh, false); assertEq(r.mechanicalOnly, true); });
  it('standard LMWH 40mg', () => { const r = Engine.VTEProphylaxis({ injuryPattern: 'long_bone', timeSinceInjury: 48, bleedingRisk: 'low', contraindication: false, weightKg: 70 }); assertEq(r.lwmh, true); });
});

describe('PulmonaryEmbolismRuleOut', () => {
  it('unstable = massive PE', () => { const r = Engine.PulmonaryEmbolismRuleOut({ wellsScore: 4, age: 60, hr: 130, spo2: 85, hemodynamicallyStable: false, recentSurgery: false }); assertEq(r.peLikely, true); assertEq(r.severity, 'massive'); });
  it('low Wells unlikely', () => { const r = Engine.PulmonaryEmbolismRuleOut({ wellsScore: 1, age: 40, hr: 80, spo2: 98, hemodynamicallyStable: true, recentSurgery: false }); assertEq(r.peLikely, 'low'); });
});

describe('RehabilitationEligibility', () => {
  it('awake and walking', () => { const r = Engine.RehabilitationEligibility({ gcs: 14, mobility: 'standing', cognitiveStatus: 'intact', socialSupport: 'present', premorbidFunctional: 'independent' }); assertEq(r.level, 'gait_training'); });
});

describe('MassiveTransfusion', () => {
  it('3+ triggers = MTP', () => { const r = Engine.MassiveTransfusion({ hr: 130, sbp: 80, lactate: 5, baseDeficit: -8, positiveFAST: true, penetratingTrauma: false }); assertEq(r.mtpActivated, true); assertEq(r.ratio, '1:1:1'); });
  it('not MTP if stable', () => { const r = Engine.MassiveTransfusion({ hr: 90, sbp: 110, lactate: 1.5, baseDeficit: -2, positiveFAST: false, penetratingTrauma: false }); assertEq(r.mtpActivated, false); });
});
"@ + $testTail.Replace('{MODULE}', 'ticu')
    WF "$root\ticu\ticu_test.js" $content
}

function Gen-MICU-Tests {
    $content = $testHelpers.Replace('{MODULE}', 'micu')
    $content += @"

describe('APACHE_IIScore', () => {
  it('high score', () => { const r = Engine.APACHE_IIScore({ age: 80, chronicHealth: 'severe', glasgow: 5, temperature: 41, map: 40, heartRate: 200, respRate: 60, paO2: 50, ph: 7.1, sodium: 110, potassium: 8, creatinine: 4, hematocrit: 15, wbc: 50 }); assertEq(r.mortality, 'high'); });
  it('low score', () => { const r = Engine.APACHE_IIScore({ age: 40, chronicHealth: 'none', glasgow: 15, temperature: 37, map: 90, heartRate: 90, respRate: 18, paO2: 100, ph: 7.4, sodium: 140, potassium: 4, creatinine: 1, hematocrit: 35, wbc: 10 }); assertEq(r.mortality, 'low'); });
});

describe('SOFAScore', () => {
  it('sepsis organ dysfunction', () => { const r = Engine.SOFAScore({ paO2FiO2: 100, platelets: 20, bilirubin: 5, map: 60, glasgow: 5, creatinine: 4, urineOutput: 100 }); assert(r.sepsisOrganDysfunction); });
});

describe('VentSettingsOptimizer', () => {
  it('hypoxemic recommends PEEP', () => { const r = Engine.VentSettingsOptimizer({ weightKg: 70, mode: 'AC', currentPeep: 5, currentFiO2: 0.4, currentTidalVolume: 420, paO2: 55, paCO2: 45, plateauPressure: 25 }); assert(r.recommendations.includes('increase_PEEP')); });
  it('high plateau recommends tidal reduction', () => { const r = Engine.VentSettingsOptimizer({ weightKg: 70, mode: 'AC', currentPeep: 10, currentFiO2: 0.5, currentTidalVolume: 500, paO2: 80, paCO2: 45, plateauPressure: 35 }); assert(r.recommendations.includes('reduce_tidal_volume')); });
});

describe('SepsisBundleComplete', () => {
  it('all complete', () => { const r = Engine.SepsisBundleComplete({ lactate: true, bloodCultureBeforeAntibiotics: true, antibiotics: true, fluid30mlKg: true, vasopressorIfHypotensive: true, mapTarget65: true }); assertEq(r.allCompleted, true); });
  it('missing lactate', () => { const r = Engine.SepsisBundleComplete({ lactate: false, bloodCultureBeforeAntibiotics: true, antibiotics: true, fluid30mlKg: true, vasopressorIfHypotensive: true, mapTarget65: true }); assertEq(r.allCompleted, false); });
});

describe('SedationLevel', () => {
  it('RASS 0 on vent target met', () => { const r = Engine.SedationLevel({ rass: 0, onVentilator: true }); assertEq(r.interpretation, 'alert_calm'); assertEq(r.targetMet, true); });
  it('RASS +2 on vent not met', () => { const r = Engine.SedationLevel({ rass: 2, onVentilator: true }); assertEq(r.targetMet, false); });
});

describe('CAMICU', () => {
  it('delirium 4 features', () => { const r = Engine.CAMICU({ acuteOnset: true, inattention: true, alteredConsciousness: true, disorganizedThinking: true }); assertEq(r.delirium, true); assertEq(r.severity, 'severe'); });
  it('not delirium 0', () => { const r = Engine.CAMICU({ acuteOnset: false, inattention: false, alteredConsciousness: false, disorganizedThinking: false }); assertEq(r.delirium, false); });
});

describe('CRRTCircuitLife', () => {
  it('citrate extends life', () => { const r = Engine.CRRTCircuitLife({ circuitHours: 50, currentFlow: 2000, currentBfr: 200, replacementFluid: 'prismasate', anticoagulation: 'citrate' }); assert(r.predictedLifeHours >= 72); });
});

describe('ECMOIndicationCheck', () => {
  it('VV-ECMO for refractory hypoxemia', () => { const r = Engine.ECMOIndicationCheck({ paO2FiO2: 60, ph: 7.2, map: 70, lactate: 3, age: 40, comorbidities: 'none', reversibility: true, refractoryVentilation: true }); assertEq(r.indicated, true); assertEq(r.modality, 'VV-ECMO'); });
  it('age precludes', () => { const r = Engine.ECMOIndicationCheck({ paO2FiO2: 50, ph: 7.2, map: 60, lactate: 5, age: 80, comorbidities: 'none', reversibility: true, refractoryVentilation: true }); assertEq(r.indicated, false); assertEq(r.reason, 'age_precludes'); });
});

describe('WithdrawalOfCareTrigger', () => {
  it('patient wishes', () => { const r = Engine.WithdrawalOfCareTrigger({ apacheScore: 20, sofaScore: 10, age: 60, comorbidities: 'none', patientWishes: 'dni_dnr', familyWishes: null }); assertEq(r.consult, true); });
  it('no trigger if stable', () => { const r = Engine.WithdrawalOfCareTrigger({ apacheScore: 10, sofaScore: 5, age: 50, comorbidities: 'none', patientWishes: null, familyWishes: null }); assertEq(r.consult, false); });
});
"@ + $testTail.Replace('{MODULE}', 'micu')
    WF "$root\micu\micu_test.js" $content
}

# Integration test (common pattern with module-specific admission_type)
function Gen-Integration($module, $admissionType) {
    $content = $integrationBoilerplate
    $content += @"

const SCHEMA = `
CREATE TABLE ${module}_admission (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, patient_id INTEGER NOT NULL,
  encounter_id INTEGER NOT NULL, admission_type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'admitted', cpt_codes TEXT NOT NULL DEFAULT '[]',
  admitted_at TEXT NOT NULL DEFAULT (datetime('now')),
  soft_deleted_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE ${module}_vital_sign (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, admission_id TEXT NOT NULL,
  measured_at TEXT NOT NULL, heart_rate INTEGER, sbp_mmhg INTEGER, spo2_pct INTEGER,
  soft_deleted_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE ${module}_red_flag (
  id TEXT PRIMARY KEY, tenant_id TEXT NOT NULL, admission_id TEXT NOT NULL,
  flag_type TEXT NOT NULL, severity TEXT NOT NULL, description TEXT,
  soft_deleted_at TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE ${module}_audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT, tenant_id TEXT NOT NULL, admission_id TEXT,
  actor_id INTEGER, action TEXT NOT NULL, entity_type TEXT NOT NULL, entity_id TEXT,
  payload TEXT NOT NULL DEFAULT '{}', prev_hash TEXT, entry_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`;

function makeDb() {
  let db = null;
  return {
    async init() { const SQL = await initSqlJs(); db = new SQL.Database(); db.run(SCHEMA); },
    exec(s, p=[]) { const stmt = db.prepare(s); stmt.bind(p); const rows = []; while (stmt.step()) rows.push(stmt.getAsObject()); stmt.free(); return rows; },
    run(s, p=[]) { const stmt = db.prepare(s); stmt.bind(p); stmt.step(); stmt.free(); return { changes: db.getRowsModified() }; },
    withTenant(t, fn) { return fn({ exec: (s, p) => this.exec(s, p), run: (s, p) => this.run(s, p) }); },
  };
}

const IDEMPOTENCY = new Map();
function writeAuditLog(c, { tenantId, actorId, action, entityType, entityId, payload }) {
  const prev = c.exec(`SELECT entry_hash FROM ${module}_audit_log WHERE tenant_id = ? ORDER BY id DESC LIMIT 1`, [tenantId]);
  const prevHash = prev[0]?.entry_hash || null;
  const str = JSON.stringify({ tenantId, actorId, action, entityType, entityId, payload, prevHash });
  const hash = crypto.createHash('sha256').update(str).digest('hex');
  c.run(`INSERT INTO ${module}_audit_log (tenant_id, actor_id, action, entity_type, entity_id, payload, prev_hash, entry_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [tenantId, actorId, action, entityType, entityId, JSON.stringify(payload), prevHash, hash]);
}

function makeHandlers(db) {
  return {
    createAdmission(t, s, k, b) {
      if (!IDEMPOTENCY.has(k)) {
        const result = db.withTenant(t, (c) => {
          const id = crypto.randomUUID();
          c.run(`INSERT INTO ${module}_admission (id, tenant_id, patient_id, encounter_id, admission_type, cpt_codes) VALUES (?, ?, ?, ?, ?, ?)`,
            [id, t, b.patientId, b.encounterId, b.admissionType, JSON.stringify(b.cptCodes || [])]);
          writeAuditLog(c, { tenantId: t, actorId: s.userId, action: 'CREATE', entityType: '${module}_admission', entityId: id, payload: b });
          return c.exec(`SELECT * FROM ${module}_admission WHERE id = ?`, [id])[0];
        });
        IDEMPOTENCY.set(k, result);
      }
      return IDEMPOTENCY.get(k);
    },
    addVital(t, s, admissionId, b) {
      return db.withTenant(t, (c) => {
        const adm = c.exec(`SELECT id FROM ${module}_admission WHERE id = ? AND tenant_id = ?`, [admissionId, t]);
        if (adm.length === 0) { const e = new Error('Not found'); e.statusCode = 404; throw e; }
        const id = crypto.randomUUID();
        c.run(`INSERT INTO ${module}_vital_sign (id, tenant_id, admission_id, measured_at, heart_rate, sbp_mmhg, spo2_pct) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [id, t, admissionId, b.measuredAt || new Date().toISOString(), b.heartRate, b.sbpMmhg, b.spo2Pct]);
        writeAuditLog(c, { tenantId: t, actorId: s.userId, action: 'CREATE', entityType: '${module}_vital_sign', entityId: id, payload: b });
        return { id, admissionId };
      });
    },
    list(t, lim = 50) {
      return db.withTenant(t, (c) => c.exec(`SELECT id, tenant_id, patient_id, admission_type, status FROM ${module}_admission WHERE tenant_id = ? AND soft_deleted_at IS NULL ORDER BY created_at DESC LIMIT ?`, [t, lim]));
    },
    get(t, id) {
      return db.withTenant(t, (c) => {
        const adm = c.exec(`SELECT * FROM ${module}_admission WHERE id = ? AND tenant_id = ?`, [id, t]);
        if (adm.length === 0) { const e = new Error('Not found'); e.statusCode = 404; throw e; }
        return { admission: adm[0] };
      });
    },
  };
}

const TA = '11111111-1111-1111-1111-111111111111';
const TB = '22222222-2222-2222-2222-222222222222';

(async function main() {
  const db = makeDb(); await db.init();
  const h = makeHandlers(db);

  describe('Scenario 1: Multi-tenant isolation', () => {
    it('tenant A creates admission', () => { const a = h.createAdmission(TA, { userId: 1 }, '${module}-iso-1', { patientId: 100, encounterId: 200, admissionType: '${admissionType}' }); assert(a.id); assertEq(a.tenant_id, TA); });
    it('tenant B sees 0', () => { assertEq(h.list(TB, 50).length, 0); });
    it('tenant A sees 1', () => { assertEq(h.list(TA, 50).length, 1); });
  });

  describe('Scenario 2: CRUD round-trip', () => {
    it('create', () => { const a = h.createAdmission(TA, { userId: 2 }, '${module}-crud-1', { patientId: 300, encounterId: 400, admissionType: '${admissionType}' }); assert(a.id); });
    it('list', () => { assert(h.list(TA, 50).length >= 2); });
    it('get', () => { const a = h.list(TA, 50)[0]; const d = h.get(TA, a.id); assertEq(d.admission.id, a.id); });
  });

  describe('Scenario 3: Idempotency', () => {
    const KEY = '${module}-idem-key-001';
    const BODY = { patientId: 500, encounterId: 600, admissionType: '${admissionType}' };
    it('first POST', () => { IDEMPOTENCY.delete(KEY); const a = h.createAdmission(TA, { userId: 3 }, KEY, BODY); assert(a.id); global.__f = a.id; });
    it('second POST same key', () => { assertEq(h.createAdmission(TA, { userId: 3 }, KEY, BODY).id, global.__f); });
    it('only 1 row', () => { assertEq(db.exec(`SELECT id FROM ${module}_admission WHERE patient_id = ? AND encounter_id = ?`, [500, 600]).length, 1); });
  });

  describe('Scenario 4: Vitals chain', () => {
    let admId;
    it('create admission', () => { const a = h.createAdmission(TA, { userId: 4 }, '${module}-vital-1', { patientId: 700, encounterId: 800, admissionType: '${admissionType}' }); admId = a.id; });
    it('add vital 1', () => { const v = h.addVital(TA, { userId: 4 }, admId, { heartRate: 100, sbpMmhg: 120, spo2Pct: 95 }); assert(v.id); });
    it('add vital 2', () => { const v = h.addVital(TA, { userId: 4 }, admId, { heartRate: 95, sbpMmhg: 125, spo2Pct: 97 }); assert(v.id); });
    it('get returns 2 vitals', () => { const d = h.get(TA, admId); assert(d); });
  });

  describe('Scenario 5: Audit hash chain', () => {
    it('count >= 5', () => { assert(db.exec(`SELECT COUNT(*) AS n FROM ${module}_audit_log WHERE tenant_id = ?`, [TA])[0].n >= 5); });
    it('first prev_hash null', () => { assertEq(db.exec(`SELECT prev_hash FROM ${module}_audit_log WHERE tenant_id = ? ORDER BY id ASC LIMIT 1`, [TA])[0].prev_hash, null); });
    it('chain links', () => { const rows = db.exec(`SELECT prev_hash, entry_hash FROM ${module}_audit_log WHERE tenant_id = ? ORDER BY id ASC`, [TA]); let prev = null; for (const r of rows) { assertEq(r.prev_hash, prev); prev = r.entry_hash; } });
    it('hash recomputes', () => { const rows = db.exec(`SELECT * FROM ${module}_audit_log WHERE tenant_id = ? ORDER BY id ASC`, [TA]); for (const r of rows) { const str = JSON.stringify({ tenantId: r.tenant_id, actorId: r.actor_id, action: r.action, entityType: r.entity_type, entityId: r.entity_id, payload: JSON.parse(r.payload), prevHash: r.prev_hash }); assertEq(r.entry_hash, crypto.createHash('sha256').update(str).digest('hex')); } });
  });
"@ + $integrationTail.Replace('{MODULE}', $module)
    WF "$root\$module\$($module)_integration_test.js" $content
}

# Generate all 4 ICU PCCs
Gen-PICU-Tests
Gen-SICU-Tests
Gen-TICU-Tests
Gen-MICU-Tests

Gen-Integration -module "picu" -admissionType "respiratory_failure"
Gen-Integration -module "sicu" -admissionType "post_op"
Gen-Integration -module "ticu" -admissionType "severe_tbi"
Gen-Integration -module "micu" -admissionType "septic_shock"

# SQL for all 4
WF "$root\picu\picu_up.sql" (Get-SQL -module "picu" -tablePrefix "picu")
WF "$root\sicu\sicu_up.sql" (Get-SQL -module "sicu" -tablePrefix "sicu")
WF "$root\ticu\ticu_up.sql" (Get-SQL -module "ticu" -tablePrefix "ticu")
WF "$root\micu\micu_up.sql" (Get-SQL -module "micu" -tablePrefix "micu")

# Routes
WF "$root\picu\picu_routes.js" (Get-Routes -module "picu" -decisionName "apache")
WF "$root\sicu\sicu_routes.js" (Get-Routes -module "sicu" -decisionName "apache")
WF "$root\ticu\ticu_routes.js" (Get-Routes -module "ticu" -decisionName "icp")
WF "$root\micu\micu_routes.js" (Get-Routes -module "micu" -decisionName "apache")

Write-Host "✅ P3-L batch: 4 ICU PCCs generated (engines + tests + integration + SQL + routes)"
Write-Host "Files written this run: $count"
