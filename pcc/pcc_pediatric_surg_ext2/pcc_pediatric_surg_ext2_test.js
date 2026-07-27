// P3-EV pcc_pediatric_surg_ext2 unit tests
const Engine = require('./pcc_pediatric_surg_ext2_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_pediatric_surg_ext2 engine tests:');
it('PediatricCircumcision', () => assertEq(Engine.PediatricCircumcision({ t: 'yes' }).plan, 'pediatricCircumcision-protocol'));
it('PediatricHerniaRepair', () => assertEq(Engine.PediatricHerniaRepair({ t: 'yes' }).plan, 'pediatricHerniaRepair-protocol'));
it('PediatricAppendectomy', () => assertEq(Engine.PediatricAppendectomy({ t: 'yes' }).plan, 'pediatricAppendectomy-protocol'));
it('PediatricCholecystectomy', () => assertEq(Engine.PediatricCholecystectomy({ t: 'yes' }).plan, 'pediatricCholecystectomy-protocol'));
it('PediatricFundoplication', () => assertEq(Engine.PediatricFundoplication({ t: 'yes' }).plan, 'pediatricFundoplication-protocol'));
it('PediatricGTube', () => assertEq(Engine.PediatricGTube({ t: 'yes' }).plan, 'pediatricGTube-protocol'));
it('PediatricOrchiopexy', () => assertEq(Engine.PediatricOrchiopexy({ t: 'yes' }).plan, 'pediatricOrchiopexy-protocol'));
it('PediatricHypospadias', () => assertEq(Engine.PediatricHypospadias({ t: 'yes' }).plan, 'pediatricHypospadias-protocol'));
it('PediatricCleftLip', () => assertEq(Engine.PediatricCleftLip({ t: 'yes' }).plan, 'pediatricCleftLip-protocol'));
it('PediatricCleftPalate', () => assertEq(Engine.PediatricCleftPalate({ t: 'yes' }).plan, 'pediatricCleftPalate-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
