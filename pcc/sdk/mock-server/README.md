# PCC Mock Server

Lightweight offline mock for SDK testing.

## Run
```bash
node mock-server.js
# Default port: 3299
```

## Use in tests
```bash
# Start mock server in background
node mock-server.js &

# Run SDK tests against mock
PCC_BASE=http://localhost:3299 node ../nodejs/test.js
```

## Endpoints (mock)
- GET /health
- GET /api/v1/pcc-catalog/modules
- GET /api/v1/pcc-catalog/categories
- GET /api/v1/<slug>/list
- POST /api/v1/<slug>/call/<fn>
- POST /api/v1/<slug>/record

Mock returns deterministic structure with random score for testing.
