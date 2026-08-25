const express = require('express');
const app = express();

console.log('loading mw...');
const mw = require('./mw');
console.log('mw keys:', Object.keys(mw));

console.log('loading cardiology_router...');
try {
  const r = require('./cardiology_router');
  console.log('cardiology_router loaded, typeof:', typeof r);
  console.log('routes stack length:', r.stack ? r.stack.length : 'no stack');
  if (r.stack) {
    r.stack.forEach((layer, i) => {
      console.log(`  ${i}: ${layer.route ? layer.route.path : 'mw'} ${layer.route ? Object.keys(layer.route.methods).join(',') : ''}`);
    });
  }
} catch (e) {
  console.error('FAIL:', e.message, e.stack);
}

console.log('loading cardiology_engine...');
try {
  const e = require('./cardiology_engine');
  console.log('engine keys:', Object.keys(e).join(', '));
} catch (e) {
  console.error('engine FAIL:', e.message);
}
