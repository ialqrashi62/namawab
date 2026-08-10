/**
 * validation_test.js — pure unit tests for ./validation (no DB, no network).
 * Run: node validation_test.js   (exit 0 = all pass)
 */
'use strict';
const v = require('./validation');

let pass = 0, fail = 0;
function ok(name, cond) { if (cond) { pass++; } else { fail++; console.error('  FAIL:', name); } }
function throws(name, fn) {
    try { fn(); ok(name + ' (should throw)', false); }
    catch (e) { ok(name, e instanceof v.ValidationError && e.statusCode === 400); }
}
function noThrow(name, fn) { try { fn(); ok(name, true); } catch (e) { ok(name + ' (' + e.message + ')', false); } }

// str
noThrow('str accepts normal', () => v.str('Ahmad', { field: 'name' }));
ok('str trims', v.str('  x  ', { field: 'n' }) === 'x');
throws('str required blank', () => v.str('   ', { field: 'n' }));
throws('str required undefined', () => v.str(undefined, { field: 'n' }));
throws('str max length', () => v.str('abcdef', { field: 'n', max: 3 }));
throws('str min length', () => v.str('ab', { field: 'n', min: 3 }));
throws('str non-string', () => v.str(123, { field: 'n' }));
ok('str optional empty -> ""', v.str('', { field: 'n', required: false }) === '');

// int / id
ok('int parses', v.int('42', { field: 'x' }) === 42);
throws('int non-integer', () => v.int('4.5', { field: 'x' }));
throws('int below min', () => v.int(0, { field: 'x', min: 1 }));
throws('int above max', () => v.int(11, { field: 'x', max: 10 }));
ok('id accepts positive', v.id(7) === 7);
throws('id rejects zero', () => v.id(0));
throws('id rejects negative', () => v.id(-3));
throws('id rejects non-int', () => v.id('abc'));

// enumOf
ok('enum accepts allowed', v.enumOf('Paid', ['Paid', 'Pending']) === 'Paid');
throws('enum rejects other', () => v.enumOf('Hacked', ['Paid', 'Pending']));
throws('enum required missing', () => v.enumOf('', ['A'], { required: true }));

// bool
ok('bool true variants', v.bool('1') === true && v.bool(true) === true && v.bool('true') === true);
ok('bool false variants', v.bool('0') === false && v.bool(false) === false);
throws('bool invalid', () => v.bool('maybe'));

// dateStr
noThrow('date ISO ok', () => v.dateStr('2026-06-30'));
throws('date invalid', () => v.dateStr('not-a-date'));
throws('date required missing', () => v.dateStr('', { required: true }));

// nationalId
ok('nationalId 10 digits', v.nationalId('1234567890') === '1234567890');
throws('nationalId 9 digits', () => v.nationalId('123456789', { required: true }));
throws('nationalId letters', () => v.nationalId('12345abcde', { required: true }));
ok('nationalId optional empty', v.nationalId('', { required: false }) === '');

// phone
noThrow('phone ok', () => v.phone('+966 50-123-4567'));
throws('phone too short', () => v.phone('12', { required: true }));

// validate() schema runner
noThrow('validate schema ok', () => v.validate(
    { name: 'Sara', age: '30', status: 'Active' },
    { name: { type: 'str', max: 50 }, age: { type: 'int', min: 0, max: 150 }, status: { type: 'enumOf', allowed: ['Active', 'Inactive'] } }
));
ok('validate returns cleaned', v.validate({ age: '30' }, { age: { type: 'int' } }).age === 30);
throws('validate fails on bad field', () => v.validate(
    { patient_id: 'x' }, { patient_id: { type: 'id' } }
));
throws('validate rejects non-object', () => v.validate(null, { a: { type: 'str' } }));

// validateBody middleware (fake req/res)
(function testMiddleware() {
    const mw = v.validateBody({ name: { type: 'str', max: 10 } });
    // success path
    let nextCalled = false; const req1 = { body: { name: 'ok' } };
    mw(req1, { status: () => ({ json: () => {} }) }, () => { nextCalled = true; });
    ok('middleware next on valid', nextCalled === true && req1.validated.name === 'ok');
    // failure path
    let status = 0, payload = null;
    const res2 = { status: (s) => { status = s; return { json: (p) => { payload = p; } }; } };
    mw({ body: { name: 'this-is-way-too-long' } }, res2, () => { ok('middleware should NOT call next on invalid', false); });
    ok('middleware 400 on invalid', status === 400 && payload && /name/.test(payload.error));
})();

console.log(`validation_test: ${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
