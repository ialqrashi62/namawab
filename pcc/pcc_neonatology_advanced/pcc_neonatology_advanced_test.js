// P3-DQ pcc_neonatology_advanced unit tests
const Engine = require('./pcc_neonatology_advanced_engine.js');
const assert = require('assert');
let passed = 0, failed = 0;
function it(name, fn) { try { fn(); console.log('  ✓ ' + name); passed++; } catch (e) { console.log('  ✗ ' + name + ': ' + e.message); failed++; } }
function assertEq(a, b) { assert.strictEqual(a, b); }
console.log('pcc_neonatology_advanced engine tests:');
it('NeonatalResuscitationAdvanced', () => assertEq(Engine.NeonatalResuscitationAdvanced({ t: 'yes' }).plan, 'neonatalresuscitationadvanced-protocol'));
it('NeonatalSepsisAdvanced', () => assertEq(Engine.NeonatalSepsisAdvanced({ t: 'yes' }).plan, 'neonatalsepsisadvanced-protocol'));
it('NeonatalHypoglycemia', () => assertEq(Engine.NeonatalHypoglycemia({ t: 'yes' }).plan, 'neonatalhypoglycemia-protocol'));
it('NeonatalJaundiceAdvanced', () => assertEq(Engine.NeonatalJaundiceAdvanced({ t: 'yes' }).plan, 'neonataljaundiceadvanced-protocol'));
it('NeonatalRespiratoryDistress', () => assertEq(Engine.NeonatalRespiratoryDistress({ t: 'yes' }).plan, 'neonatalrespiratorydistress-protocol'));
it('NeonatalSeizures', () => assertEq(Engine.NeonatalSeizures({ t: 'yes' }).plan, 'neonatalseizures-protocol'));
it('NeonatalHypoxicIschemic', () => assertEq(Engine.NeonatalHypoxicIschemic({ t: 'yes' }).plan, 'neonatalhypoxicischemic-protocol'));
it('NeonatalNecrotizingEnterocolitis', () => assertEq(Engine.NeonatalNecrotizingEnterocolitis({ t: 'yes' }).plan, 'neonatalnecrotizingenterocolitis-protocol'));
it('NeonatalPatentDuctusArteriosus', () => assertEq(Engine.NeonatalPatentDuctusArteriosus({ t: 'yes' }).plan, 'neonatalpatentductusarteriosus-protocol'));
it('NeonatalRetinopathyPrematurity', () => assertEq(Engine.NeonatalRetinopathyPrematurity({ t: 'yes' }).plan, 'neonatalretinopathyprematurity-protocol'));
console.log('UNIT: ' + passed + ', FAIL: ' + failed);
process.exit(failed ? 1 : 0);
