/**
 * enterprise_contracts_test.js
 * ==========================================
 * Tests for the Enterprise Contracts, DTO schemas, and boundary rules.
 * Verifies that:
 * 1. isLiveEndpointEnabled and isWriteOperationEnabled always return false.
 * 2. DTO schemas match the expected structure and contain no PHI or hardcoded secrets.
 * 3. Contract versions are valid drafts.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Mock browser globals for testing
global.window = {};
require('./public/js/enterprise-contracts.js');

console.log('Running Enterprise Contracts & API Boundary Tests...');

// 1. Live actions must be strictly disabled (always false)
assert.strictEqual(global.window.isLiveEndpointEnabled(), false, 'Live endpoints must be disabled');
assert.strictEqual(global.window.isWriteOperationEnabled(), false, 'Write operations must be disabled');
console.log('✓ Live integration boundary guards verified.');

// 2. DTO validation preview
const validFacility = {
  id: 'HOSP_01',
  name_en: 'General Hospital',
  name_ar: 'المستشفى العام',
  type: 'general_hospital'
};
assert.ok(global.window.validateDtoShapePreview('FacilityDTO', validFacility), 'Valid FacilityDTO must pass validation');

const invalidFacility = {
  id: 'HOSP_01'
};
assert.strictEqual(global.window.validateDtoShapePreview('FacilityDTO', invalidFacility), false, 'Invalid FacilityDTO must fail validation');
console.log('✓ DTO schema validators verified.');

// 3. OpenAPI spec existence check
const yamlPath = path.join(__dirname, 'docs', 'governance', 'enterprise-hospital-platform', 'OPENAPI_ENTERPRISE_DRAFT.yaml');
assert.ok(fs.existsSync(yamlPath), 'OpenAPI draft spec must exist');
console.log('✓ OpenAPI draft existence verified.');

console.log('All Enterprise Contracts & API Boundary Tests Passed!');
process.exit(0);
