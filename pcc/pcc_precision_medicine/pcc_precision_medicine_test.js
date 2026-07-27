// P3-DB pcc_precision_medicine unit tests
const Engine = require('./pcc_precision_medicine_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_precision_medicine engine tests:');
it('Pharmacogenomics', () => assertEq(Engine.Pharmacogenomics({ t: 'yes' }).plan, 'pharmacogenomics-protocol'));
it('OmicsProfile', () => assertEq(Engine.OmicsProfile({ t: 'yes' }).plan, 'omicsprofile-protocol'));
it('BiomarkerPanel', () => assertEq(Engine.BiomarkerPanel({ t: 'yes' }).plan, 'biomarkerpanel-protocol'));
it('TargetedTherapy', () => assertEq(Engine.TargetedTherapy({ t: 'yes' }).plan, 'targetedtherapy-protocol'));
it('RareVariant', () => assertEq(Engine.RareVariant({ t: 'yes' }).plan, 'rarevariant-protocol'));
it('TumorProfiling', () => assertEq(Engine.TumorProfiling({ t: 'yes' }).plan, 'tumorprofiling-protocol'));
it('MicrobiomeGuide', () => assertEq(Engine.MicrobiomeGuide({ t: 'yes' }).plan, 'microbiomeguide-protocol'));
it('Nutrigenomics', () => assertEq(Engine.Nutrigenomics({ t: 'yes' }).plan, 'nutrigenomics-protocol'));
it('Proteomics', () => assertEq(Engine.Proteomics({ t: 'yes' }).plan, 'proteomics-protocol'));
it('Metabolomics', () => assertEq(Engine.Metabolomics({ t: 'yes' }).plan, 'metabolomics-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
