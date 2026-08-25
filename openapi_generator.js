/**
 * openapi_generator.js — Wave 33
 *
 * Scans server.js for `app.METHOD('/api/...', ...)` route definitions
 * and emits an OpenAPI 3.0.3 spec + a Swagger UI page.
 *
 * Design choices (defense-in-depth, zero behavior change):
 *  - READ-ONLY scanner: regex against source text, never `require()` or `eval()` the file.
 *  - Path params: `:id` -> `{id}` (Express -> OpenAPI).
 *  - Security schemes: sessionCookie + bearer (MFA endpoints use Bearer X-API-Token).
 *  - Tag auto-assignment from URL prefix (e.g. /api/patients/* -> "patients").
 *  - Generated spec is STATIC (file output) so the route can serve it without re-scanning.
 */

'use strict';

const fs = require('fs');
const path = require('path');

const ROUTE_RE = /app\.(get|post|put|patch|delete)\(\s*['"]([^'"]+)['"]/g;

const HTTP_METHOD_TO_OP = {
    get: 'get', post: 'post', put: 'put', patch: 'patch', delete: 'delete',
};

function pathToOpenApi(p) {
    return p.replace(/:([a-zA-Z_][a-zA-Z0-9_]*)/g, '{$1}');
}

function pathToTags(p) {
    const m = p.match(/^\/api\/([^\/]+)/);
    return m ? [m[1]] : ['misc'];
}

/**
 * Generate an OpenAPI 3.0.3 spec from a server.js source file.
 *
 * @param {string} source - the server.js contents
 * @param {object} [opts]
 * @param {string} [opts.title='NamaMedical ERP']
 * @param {string} [opts.version='1.0.0']
 * @returns {object} OpenAPI spec
 */
function generateOpenApi(source, opts = {}) {
    const title = opts.title || 'NamaMedical ERP';
    const version = opts.version || '1.0.0';
    const description = opts.description || 'Multi-tenant hospital ERP — generated from server.js route declarations.';

    const spec = {
        openapi: '3.0.3',
        info: { title, version, description },
        servers: [
            { url: 'http://localhost:3000', description: 'Local dev' },
            { url: 'https://jumanasoft.com', description: 'Production' },
        ],
        components: {
            securitySchemes: {
                sessionCookie: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'connect.sid',
                    description: 'Express session cookie. Authenticate via /api/auth/login.',
                },
                apiToken: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    description: 'Optional API token for server-to-server integrations.',
                },
            },
            responses: {
                Unauthorized: {
                    description: 'Missing or invalid session',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                },
                Forbidden: {
                    description: 'RBAC / tenant scope rejected',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                },
                ServerError: {
                    description: 'Unexpected server error',
                    content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
                },
            },
            schemas: {
                Error: {
                    type: 'object',
                    properties: { error: { type: 'string' } },
                    required: ['error'],
                },
                HealthResponse: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', enum: ['UP', 'DOWN'] },
                        db: { type: 'string', enum: ['up', 'down'] },
                        redis: { type: 'string', enum: ['up', 'down'] },
                        uptimeSec: { type: 'number' },
                    },
                    required: ['status'],
                },
            },
        },
        security: [{ sessionCookie: [] }],
        paths: {},
    };

    let match;
    ROUTE_RE.lastIndex = 0;
    while ((match = ROUTE_RE.exec(source)) !== null) {
        const method = match[1].toLowerCase();
        const rawPath = match[2];
        if (!rawPath.startsWith('/api/')) continue;

        const op = HTTP_METHOD_TO_OP[method];
        const path = pathToOpenApi(rawPath);
        if (!spec.paths[path]) spec.paths[path] = {};
        spec.paths[path][op] = {
            tags: pathToTags(rawPath),
            summary: `${method.toUpperCase()} ${rawPath}`,
            description: `Auto-generated from server.js route declaration.`,
            responses: {
                '200': { description: 'Success' },
                '401': { $ref: '#/components/responses/Unauthorized' },
                '403': { $ref: '#/components/responses/Forbidden' },
                '500': { $ref: '#/components/responses/ServerError' },
            },
            security: [{ sessionCookie: [] }],
        };
    }

    return spec;
}

/**
 * Generate Swagger UI HTML page that loads the spec from `/openapi.json`.
 */
function generateSwaggerHtml(opts = {}) {
    const title = opts.title || 'NamaMedical API';
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui.css">
<style>
  body { margin: 0; padding: 0; }
  .topbar { display: none; }
</style>
</head>
<body>
<div id="swagger-ui"></div>
<script src="https://cdn.jsdelivr.net/npm/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
<script>
  window.onload = () => {
    SwaggerUIBundle({
      url: '/openapi.json',
      dom_id: '#swagger-ui',
      deepLinking: true,
      presets: [SwaggerUIBundle.presets.apis],
      layout: 'BaseLayout',
    });
  };
</script>
</body>
</html>`;
}

module.exports = { generateOpenApi, generateSwaggerHtml, pathToOpenApi, pathToTags };

// CLI usage: `node openapi_generator.js <server.js> [out.json]`
if (require.main === module) {
    const [, , serverPath, outPath] = process.argv;
    if (!serverPath) {
        console.error('Usage: node openapi_generator.js <server.js> [out.json]');
        process.exit(1);
    }
    const source = fs.readFileSync(serverPath, 'utf8');
    const spec = generateOpenApi(source);
    const out = outPath || path.join(path.dirname(serverPath), 'openapi.generated.json');
    fs.writeFileSync(out, JSON.stringify(spec, null, 2));
    console.log(`[openapi] wrote ${Object.keys(spec.paths).length} paths to ${out}`);
}
