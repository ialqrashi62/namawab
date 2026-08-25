const express = require('express');
module.exports = function () { return express.Router(); };
module.exports.router = module.exports;
// TEMP STUB for local boot verification - real file exists on deploy machine
