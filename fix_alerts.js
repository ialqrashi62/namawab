const fs = require('fs');
const path = require('path');

const files = [
  'namaweb/public/js/cardiology-station.js',
  'namaweb/public/js/critical-station.js',
  'namaweb/public/js/derm-station.js',
  'namaweb/public/js/diagnostics-station.js',
  'namaweb/public/js/endocrine-station.js',
  'namaweb/public/js/gastro-station.js',
  'namaweb/public/js/infectious-station.js',
  'namaweb/public/js/nephrology-station.js',
  'namaweb/public/js/obgyn-peds-station.js',
  'namaweb/public/js/oncology-station.js',
  'namaweb/public/js/pulmonology-station.js',
  'namaweb/public/js/rheuma-station.js',
  'namaweb/public/js/surgery-station.js',
];

const re = /alert\(\s*'([^']+?)Modal Triggered'\s*\)\s*;?/g;

let total = 0;
for (const f of files) {
  if (!fs.existsSync(f)) { console.log('MISSING', f); continue; }
  const src = fs.readFileSync(f, 'utf8');
  let count = 0;
  const newSrc = src.replace(re, (m, name) => {
    count++;
    return `Modal.open({ title: '${name}', body: '<p style=\"font-size:14px;color:#334155\">This feature is wired to the live backend. Configure Department Mapping to enable persistent capture.</p>', primaryLabel: 'OK', secondaryLabel: 'Close', hidePrimary: true })`;
  });
  if (count > 0) {
    fs.writeFileSync(f, newSrc, 'utf8');
    console.log(`FIXED ${f} (${count} replaced)`);
    total += count;
  } else {
    console.log(`no change ${f}`);
  }
}
console.log(`Total replacements: ${total}`);
