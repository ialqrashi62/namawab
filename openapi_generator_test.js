/**
 * openapi_generator_test.js — Unit tests for OpenAPI generation.
 */

'use strict';

const assert = require('assert');
const { generateOpenApi, generateSwaggerHtml, pathToOpenApi, pathToTags } = require('./openapi_generator');

const SAMPLE = `
app.get('/api/health', async (req, res) => {});
app.post('/api/auth/login', async (req, res) => {});
app.get('/api/patients/:id', async (req, res) => {});
app.put('/api/patients/:id/notes/:noteId', async (req, res) => {});
app.delete('/api/admin/users/:id', async (req, res) => {});
app.use('/static', express.static('public'));
app.get('/admin.html', (req, res) => {});
`;

// ---- Test 1: only /api routes ----
{
    const spec = generateOpenApi(SAMPLE);
    assert.ok(spec.paths['/api/health'], 'has /api/health');
    assert.ok(spec.paths['/api/auth/login'], 'has /api/auth/login');
    assert.ok(spec.paths['/admin.html'] === undefined, 'skips non-/api');
    assert.ok(!('/static' in spec.paths), 'skips app.use');
    console.log('[PASS] Only /api routes included');
}

// ---- Test 2: path param conversion ----
{
    const spec = generateOpenApi(SAMPLE);
    assert.ok(spec.paths['/api/patients/{id}'], 'converts :id to {id}');
    assert.ok(spec.paths['/api/patients/{id}/notes/{noteId}'], 'multi-param conversion');
    console.log('[PASS] Path params converted Express -> OpenAPI');
}

// ---- Test 3: methods correctly assigned ----
{
    const spec = generateOpenApi(SAMPLE);
    assert.ok(spec.paths['/api/health'].get, 'GET on /health');
    assert.ok(spec.paths['/api/auth/login'].post, 'POST on auth/login');
    assert.ok(spec.paths['/api/patients/{id}'].get, 'GET on patients/:id');
    assert.ok(spec.paths['/api/patients/{id}/notes/{noteId}'].put, 'PUT');
    assert.ok(spec.paths['/api/admin/users/{id}'].delete, 'DELETE');
    console.log('[PASS] HTTP methods correctly assigned');
}

// ---- Test 4: tags from path prefix ----
{
    assert.deepStrictEqual(pathToTags('/api/patients/123'), ['patients']);
    assert.deepStrictEqual(pathToTags('/api/admin/users'), ['admin']);
    assert.deepStrictEqual(pathToTags('/api/health'), ['health']);
    assert.deepStrictEqual(pathToTags('/api/foo/bar/baz'), ['foo']);
    assert.deepStrictEqual(pathToTags('/something'), ['misc']);
    console.log('[PASS] Tags derived from first /api/ segment');
}

// ---- Test 5: OpenAPI metadata ----
{
    const spec = generateOpenApi(SAMPLE);
    assert.strictEqual(spec.openapi, '3.0.3');
    assert.ok(spec.info.title);
    assert.ok(spec.info.version);
    assert.ok(spec.servers.length >= 1);
    assert.ok(spec.components.securitySchemes.sessionCookie);
    assert.ok(spec.components.securitySchemes.apiToken);
    console.log('[PASS] OpenAPI metadata + security schemes present');
}

// ---- Test 6: responses ----
{
    const spec = generateOpenApi(SAMPLE);
    const op = spec.paths['/api/health'].get;
    assert.ok(op.responses['200']);
    assert.ok(op.responses['401']);
    assert.ok(op.responses['403']);
    assert.ok(op.responses['500']);
    console.log('[PASS] Standard responses attached');
}

// ---- Test 7: security default ----
{
    const spec = generateOpenApi(SAMPLE);
    assert.ok(Array.isArray(spec.security));
    assert.deepStrictEqual(spec.security[0].sessionCookie, []);
    console.log('[PASS] Default security: sessionCookie');
}

// ---- Test 8: custom title/version ----
{
    const spec = generateOpenApi(SAMPLE, { title: 'My Hospital', version: '2.5.0' });
    assert.strictEqual(spec.info.title, 'My Hospital');
    assert.strictEqual(spec.info.version, '2.5.0');
    console.log('[PASS] Custom title/version respected');
}

// ---- Test 9: Swagger HTML ----
{
    const html = generateSwaggerHtml({ title: 'Test API' });
    assert.ok(html.includes('<title>Test API</title>'));
    assert.ok(html.includes('swagger-ui-bundle.js'));
    assert.ok(html.includes("url: '/openapi.json'"));
    console.log('[PASS] Swagger HTML well-formed');
}

// ---- Test 10: empty source ----
{
    const spec = generateOpenApi('// no routes');
    assert.deepStrictEqual(spec.paths, {});
    console.log('[PASS] Empty source -> empty paths');
}

// ---- Test 11: PATCH method ----
{
    const spec = generateOpenApi("app.patch('/api/patients/:id', (req, res) => {});");
    assert.ok(spec.paths['/api/patients/{id}'].patch, 'PATCH supported');
    console.log('[PASS] PATCH method supported');
}

// ---- Test 12: deduplication (same path + method registered multiple times) ----
{
    const src = `
app.get('/api/x', (req, res) => {});
app.get('/api/x', (req, res) => {});  // would be a duplicate in real Express
`;
    const spec = generateOpenApi(src);
    // Spec just keeps the last one — that's OK; the generator mirrors route defs
    assert.ok(spec.paths['/api/x']);
    console.log('[PASS] Multiple route defs handled (last-wins)');
}

console.log('\n=== ALL openapi_generator tests PASS ===');
