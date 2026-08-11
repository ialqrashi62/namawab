// filepath: scripts/fix_route_schemas.js
// Fix route_schemas.js by moving family medicine + AI schemas BEFORE module.exports
'use strict';
const fs = require('fs');
const path = 'namaweb/route_schemas.js';
let content = fs.readFileSync(path, 'utf8');

// Remove the duplicate family medicine + AI schema definitions at the end (after module.exports)
const DUPLICATE_START = '\n// Family Medicine schemas (added 2026-08-11, e52)';
const DUPLICATE_END = '\n// AI Co-Pilot schemas (added 2026-08-11, e53b)';
const aiSchemaEnd = '    metadata:     { type: \'obj\', required: false }\n};';

const dupStart = content.indexOf(DUPLICATE_START);
if (dupStart > 0) {
    const dupEnd = content.indexOf(aiSchemaEnd, dupStart);
    if (dupEnd > 0) {
        // Remove everything from DUPLICATE_START through aiSchemaEnd (inclusive)
        content = content.substring(0, dupStart) + content.substring(dupEnd + aiSchemaEnd.length);
        console.log('Removed duplicate schemas at end of file');
    }
}

// Now insert the new schemas BEFORE module.exports
const moduleExportsMarker = '\nmodule.exports = {';
const insertPos = content.indexOf(moduleExportsMarker);
if (insertPos < 0) {
    console.error('Could not find module.exports marker');
    process.exit(1);
}

const newSchemas = `// ============================================================
// Family Medicine + AI Co-Pilot schemas (added 2026-08-11, e52 + e53b)
// Moved BEFORE module.exports to avoid TDZ ReferenceError
// ============================================================
const familyMedicineVisitCreate = {
    patient_id:         { type: 'id', required: true },
    visit_date:         { type: 'dateStr', required: false },
    chief_complaint:    { type: 'str', required: true, max: 1000 },
    sbp:                { type: 'num', required: false, min: 50, max: 300 },
    hr:                 { type: 'num', required: false, min: 20, max: 250 },
    weight:             { type: 'num', required: false, min: 0.5, max: 500 },
    height:             { type: 'num', required: false, min: 20, max: 250 },
    diagnosis:          { type: 'str', required: false, max: 500 },
    notes:              { type: 'str', required: false, max: 5000 }
};

const familyMedicineWellness = {
    patient_id:               { type: 'id', required: true },
    age:                      { type: 'num', required: true, min: 0, max: 120 },
    bmi:                      { type: 'num', required: false, min: 10, max: 80 },
    smoker:                   { type: 'bool', required: false },
    activity_min_per_week:    { type: 'num', required: false, min: 0, max: 2000 },
    chronic_count:            { type: 'num', required: false, min: 0, max: 20 }
};

const familyMedicineChronic = {
    patient_id:      { type: 'id', required: true },
    diabetes:        { type: 'bool', required: false },
    htn:             { type: 'bool', required: false },
    chf:             { type: 'bool', required: false },
    copd:            { type: 'bool', required: false },
    asthma:          { type: 'bool', required: false },
    ckd:             { type: 'bool', required: false },
    cad:             { type: 'bool', required: false },
    stroke:          { type: 'bool', required: false },
    cancer_history:  { type: 'bool', required: false },
    depression:      { type: 'bool', required: false },
    dyslipidemia:    { type: 'bool', required: false }
};

const familyMedicineVaccinations = {
    patient_id:      { type: 'id', required: true },
    age:             { type: 'num', required: true, min: 0, max: 120 },
    immunizations:   { type: 'arr', required: false }
};

const familyMedicineFamilyHistory = {
    patient_id:       { type: 'id', required: true },
    family_history:   { type: 'arr', required: false }
};

const familyMedicinePreventive = {
    patient_id:        { type: 'id', required: true },
    age:               { type: 'num', required: true, min: 0, max: 120 },
    sex:               { type: 'str', required: false, enum: ['M', 'F'] },
    smoker:            { type: 'bool', required: false },
    bmi:               { type: 'num', required: false, min: 10, max: 80 },
    sbp:               { type: 'num', required: false, min: 50, max: 300 },
    family_history:    { type: 'arr', required: false }
};

const aiCoPilotAsk = {
    query:        { type: 'str', required: true, min: 3, max: 2000 },
    locale:       { type: 'str', required: false, enum: ['ar', 'en', 'fr', 'ur'] },
    doc_kind:     { type: 'str', required: false }
};

const aiDocumentIngest = {
    doc_id:       { type: 'str', required: true, min: 1, max: 200 },
    doc_kind:     { type: 'str', required: true, enum: ['pdf', 'md', 'cds', 'icd10', 'drug', 'lab'] },
    content:      { type: 'str', required: true, min: 10, max: 500000 },
    metadata:     { type: 'obj', required: false }
};

`;

content = content.substring(0, insertPos) + newSchemas + content.substring(insertPos);

// Add the new schema names to the module.exports object
const exportsInsert = ',familyMedicineVisitCreate\n    ,familyMedicineWellness\n    ,familyMedicineChronic\n    ,familyMedicineVaccinations\n    ,familyMedicineFamilyHistory\n    ,familyMedicinePreventive\n    ,aiCoPilotAsk\n    ,aiDocumentIngest';
const messageCreateMatch = content.indexOf('    ,messageCreate');
if (messageCreateMatch > 0) {
    // Find end of that line
    const lineEnd = content.indexOf('\n', messageCreateMatch);
    if (lineEnd > 0) {
        // Check if the new schemas are already there
        const afterMsg = content.substring(messageCreateMatch, messageCreateMatch + 500);
        if (!afterMsg.includes('familyMedicineVisitCreate')) {
            content = content.substring(0, lineEnd) + exportsInsert + content.substring(lineEnd);
            console.log('Added new schemas to module.exports');
        } else {
            console.log('Schemas already in module.exports');
        }
    }
}

fs.writeFileSync(path, content);
console.log('Fixed route_schemas.js');