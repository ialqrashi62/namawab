#!/usr/bin/env node
// Wave 3C: Generate OpenAPI 3.0 spec for all 59 dept endpoints
'use strict';
const fs = require('fs');
const path = require('path');

const STAGING_DIR = '.ai-brain/05_ENGINES';
const stubs = fs.readdirSync(STAGING_DIR).filter(f => f.endsWith('_engine.js'));
const depts = stubs.map(f => f.replace('_engine.js', ''));

// Add legacy departments
const ALL_DEPTS = [
    'family_medicine', 'geriatrics', 'dental', 'ophthalmology', 'ent',
    'sports_medicine', 'neurology', 'orthopedics', 'surgery',
    ...depts
];

function buildSpec() {
    const paths = {};

    // Per-dept endpoints
    for (const dept of ALL_DEPTS) {
        paths[`/api/${dept}/health`] = {
            get: {
                tags: ['health', dept],
                summary: `Health check for ${dept} department`,
                responses: {
                    200: {
                        description: 'Department is healthy',
                        content: {
                            'application/json': {
                                schema: {
                                    type: 'object',
                                    properties: {
                                        ok: { type: 'boolean' },
                                        dept: { type: 'string' },
                                        version: { type: 'string' }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        paths[`/api/${dept}/patients`] = {
            get: {
                tags: ['patients', dept],
                summary: `List patients for ${dept}`,
                parameters: [
                    { name: 'limit', in: 'query', schema: { type: 'integer', default: 50, maximum: 200 } },
                    { name: 'offset', in: 'query', schema: { type: 'integer', default: 0 } }
                ],
                security: [{ cookieAuth: [] }, { bearerAuth: [] }],
                responses: {
                    200: { description: 'List of patients' },
                    401: { description: 'Unauthenticated' }
                }
            }
        };
        paths[`/api/${dept}/assessments/{engine}`] = {
            post: {
                tags: ['assessments', dept],
                summary: `Run ${dept} assessment engine`,
                parameters: [
                    { name: 'engine', in: 'path', required: true, schema: { type: 'string' } }
                ],
                security: [{ cookieAuth: [] }, { bearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { type: 'object', additionalProperties: true }
                        }
                    }
                },
                responses: {
                    201: { description: 'Assessment result', content: { 'application/json': { schema: { type: 'object', additionalProperties: true } } } },
                    400: { description: 'Validation error' },
                    401: { description: 'Unauthenticated' }
                }
            }
        };
    }

    // AI Co-Pilot endpoints
    paths['/api/ai/health'] = {
        get: {
            tags: ['ai', 'health'],
            summary: 'AI Co-Pilot health',
            responses: {
                200: {
                    description: 'AI services status',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    ok: { type: 'boolean' },
                                    version: { type: 'string' },
                                    services: {
                                        type: 'object',
                                        properties: {
                                            co_pilot: { type: 'boolean' },
                                            vector_store: { type: 'boolean' },
                                            embedder: { type: 'boolean' }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    paths['/api/ai/co-pilot/ask'] = {
        post: {
            tags: ['ai'],
            summary: 'Ask AI Co-Pilot a clinical question',
            security: [{ cookieAuth: [] }, { bearerAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['query'],
                            properties: {
                                query: { type: 'string', minLength: 3, maxLength: 2000 },
                                locale: { type: 'string', enum: ['ar', 'en', 'fr', 'ur'], default: 'ar' },
                                doc_kind: { type: 'string', enum: ['guideline', 'drug', 'protocol', 'scale', 'calculator'] }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'AI answer with citations' },
                400: { description: 'Invalid query' },
                401: { description: 'Unauthenticated' }
            }
        }
    };
    paths['/api/ai/documents/ingest'] = {
        post: {
            tags: ['ai', 'admin'],
            summary: 'Ingest clinical document into vector store',
            security: [{ cookieAuth: [] }],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['doc_id', 'doc_kind', 'content'],
                            properties: {
                                doc_id: { type: 'string' },
                                doc_kind: { type: 'string' },
                                content: { type: 'string' },
                                metadata: { type: 'object' }
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: 'Document ingested' },
                400: { description: 'Missing fields' }
            }
        }
    };

    return {
        openapi: '3.0.3',
        info: {
            title: 'NamaMedical Hospital Platform API',
            version: '1.0.0',
            description: 'Multi-tenant hospital management platform with 59 clinical departments plus AI Co-Pilot. Live at jumanasoft.com.',
            contact: { name: 'NamaMedical', url: 'https://jumanasoft.com' }
        },
        servers: [
            { url: 'https://jumanasoft.com', description: 'Production' },
            { url: 'http://localhost:3000', description: 'Local development' }
        ],
        tags: [
            { name: 'health', description: 'Department health endpoints' },
            { name: 'ai', description: 'AI Co-Pilot endpoints' },
            ...ALL_DEPTS.slice(0, 20).map(d => ({ name: d, description: `${d} department` }))
        ],
        components: {
            securitySchemes: {
                cookieAuth: { type: 'apiKey', in: 'cookie', name: 'nama.sid' },
                bearerAuth: { type: 'http', scheme: 'bearer' }
            },
            schemas: {
                HealthResponse: {
                    type: 'object',
                    properties: { ok: { type: 'boolean' }, dept: { type: 'string' }, version: { type: 'string' } }
                },
                AssessmentResult: {
                    type: 'object',
                    properties: {
                        score: { type: 'number' },
                        risk: { type: 'string' },
                        recommendation: { type: 'string' },
                        components: { type: 'object' },
                        cite: { type: 'string' },
                        version: { type: 'string' }
                    }
                }
            }
        },
        paths
    };
}

const spec = buildSpec();
const outPath = 'namaweb/public/openapi.json';
fs.writeFileSync(outPath, JSON.stringify(spec, null, 2));
const yamlPath = 'namaweb/public/openapi.yaml';
// Simple YAML stringify (just dotpath notation)
// Falling back to JSON for now
console.log(`Generated OpenAPI spec: ${outPath}`);
console.log(`Total paths: ${Object.keys(spec.paths).length}`);
console.log(`Total tags: ${spec.tags.length}`);
console.log(`Total depts: ${ALL_DEPTS.length}`);

// Also save to project docs
fs.writeFileSync('docs/openapi.json', JSON.stringify(spec, null, 2));
console.log(`Also saved to docs/openapi.json`);
