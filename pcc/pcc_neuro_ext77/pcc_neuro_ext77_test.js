// Auto-generated test
"use strict";
const {SpinalMuscularAtrophyExt, SBMAExt, FSHDExt, MyotonicDystrophyExt, LimbGirdleMuscularDystrophyExt, FacioscapulohumeralExt, InclusionBodyMyositisExt, DermatomyositisExt, PolymyositisExt, MyastheniaGravisMyopathyExt} = require('./pcc_neuro_ext77_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(SpinalMuscularAtrophyExt({}).function, 'SpinalMuscularAtrophyExt', 'SpinalMuscularAtrophyExt basic');
assertEq(SBMAExt({}).function, 'SBMAExt', 'SBMAExt basic');
assertEq(FSHDExt({}).function, 'FSHDExt', 'FSHDExt basic');
assertEq(MyotonicDystrophyExt({}).function, 'MyotonicDystrophyExt', 'MyotonicDystrophyExt basic');
assertEq(LimbGirdleMuscularDystrophyExt({}).function, 'LimbGirdleMuscularDystrophyExt', 'LimbGirdleMuscularDystrophyExt basic');
assertEq(FacioscapulohumeralExt({}).function, 'FacioscapulohumeralExt', 'FacioscapulohumeralExt basic');
assertEq(InclusionBodyMyositisExt({}).function, 'InclusionBodyMyositisExt', 'InclusionBodyMyositisExt basic');
assertEq(DermatomyositisExt({}).function, 'DermatomyositisExt', 'DermatomyositisExt basic');
assertEq(PolymyositisExt({}).function, 'PolymyositisExt', 'PolymyositisExt basic');
assertEq(MyastheniaGravisMyopathyExt({}).function, 'MyastheniaGravisMyopathyExt', 'MyastheniaGravisMyopathyExt basic');
console.log('pcc_neuro_ext77 unit: ' + passed + ' passed');