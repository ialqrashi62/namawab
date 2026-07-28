// Auto-generated test
"use strict";
const {PediatricTonsillectomyOSASurgExt, PediatricSupraglottoplastyExt, PediatricLaryngotrachealSurgExt, PediatricBronchoscopyExt, PediatricTrachealReconstructionExt, PediatricPEGInsertionExt, PediatricGJTubesExt, PediatricFundoplicationExt, PediatricTracheostomyPlastyExt, PediatricChestWallReconstructionExt} = require('./pcc_pediatric_surg_ext75_engine');
let passed=0;
function assertEq(a,b,msg){if(a===b){passed++;}else if(typeof a==='object'&&JSON.stringify(a)===JSON.stringify(b)){passed++;}else{console.error('FAIL',msg,a,b);process.exit(1);}}
assertEq(PediatricTonsillectomyOSASurgExt({}).function, 'PediatricTonsillectomyOSASurgExt', 'PediatricTonsillectomyOSASurgExt basic');
assertEq(PediatricSupraglottoplastyExt({}).function, 'PediatricSupraglottoplastyExt', 'PediatricSupraglottoplastyExt basic');
assertEq(PediatricLaryngotrachealSurgExt({}).function, 'PediatricLaryngotrachealSurgExt', 'PediatricLaryngotrachealSurgExt basic');
assertEq(PediatricBronchoscopyExt({}).function, 'PediatricBronchoscopyExt', 'PediatricBronchoscopyExt basic');
assertEq(PediatricTrachealReconstructionExt({}).function, 'PediatricTrachealReconstructionExt', 'PediatricTrachealReconstructionExt basic');
assertEq(PediatricPEGInsertionExt({}).function, 'PediatricPEGInsertionExt', 'PediatricPEGInsertionExt basic');
assertEq(PediatricGJTubesExt({}).function, 'PediatricGJTubesExt', 'PediatricGJTubesExt basic');
assertEq(PediatricFundoplicationExt({}).function, 'PediatricFundoplicationExt', 'PediatricFundoplicationExt basic');
assertEq(PediatricTracheostomyPlastyExt({}).function, 'PediatricTracheostomyPlastyExt', 'PediatricTracheostomyPlastyExt basic');
assertEq(PediatricChestWallReconstructionExt({}).function, 'PediatricChestWallReconstructionExt', 'PediatricChestWallReconstructionExt basic');
console.log('pcc_pediatric_surg_ext75 unit: ' + passed + ' passed');