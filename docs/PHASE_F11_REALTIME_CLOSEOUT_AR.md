# F-11 Closeout — Real-time Bus

## Deliverables
| Mode | File |
|---|---|
| F-11.1 | `namaweb/bus/realtime.js` (per-tenant topic + fan-out) |
| F-11.2 | `namaweb/bus/redis_streams.js` (Redis stub adapter) |
| F-11.3 | `namaweb/middleware/ws_tenant.js` (upgrade guard) |
| F-11.4 | smoke test: per-tenant fan-out + ordering + replay + tenant 404 |

## Smoke
```
PASS: 49 / 49
```

## Safety rails
- RAIL-5: cross-tenant publish never reaches foreign subscribers.
- RAIL-11: wsTenantGuard refuses missing or mismatched tenant.
- RAIL-12: messages carry tenant+topic; no PHI in payload signature.
