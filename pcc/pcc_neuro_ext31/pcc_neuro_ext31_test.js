// pcc_neuro_ext31 unit test v3.130.0
const { MovementDisorderAdvanced, DystoniaSyndrome, ChoreaAdvanced, AthetosisSyndrome, TicDisorderAdvanced, MyoclonusAdvanced, TremorSyndrome, AtaxiaSyndrome, GaitDisorder, HypokineticMovement } = require('./pcc_neuro_ext31_engine');
const assert = require('assert');

let passed = 0;
assert.ok(MovementDisorderAdvanced()); passed++;
assert.ok(MovementDisorderAdvanced({a:1})); passed++;
assert.ok(DystoniaSyndrome()); passed++;
assert.ok(DystoniaSyndrome({a:1})); passed++;
assert.ok(ChoreaAdvanced()); passed++;
assert.ok(ChoreaAdvanced({a:1})); passed++;
assert.ok(AthetosisSyndrome()); passed++;
assert.ok(AthetosisSyndrome({a:1})); passed++;
assert.ok(TicDisorderAdvanced()); passed++;
assert.ok(TicDisorderAdvanced({a:1})); passed++;
assert.ok(MyoclonusAdvanced()); passed++;
assert.ok(MyoclonusAdvanced({a:1})); passed++;
assert.ok(TremorSyndrome()); passed++;
assert.ok(TremorSyndrome({a:1})); passed++;
assert.ok(AtaxiaSyndrome()); passed++;
assert.ok(AtaxiaSyndrome({a:1})); passed++;
assert.ok(GaitDisorder()); passed++;
assert.ok(GaitDisorder({a:1})); passed++;
assert.ok(HypokineticMovement()); passed++;
assert.ok(HypokineticMovement({a:1})); passed++;

console.log('pcc_neuro_ext31 unit:', passed, 'passed');
