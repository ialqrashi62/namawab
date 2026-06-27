# Performance Test Suite (k6)

| File | Scenario | Targets |
|------|----------|---------|
| `k6_smoke.js` | Light health check | 5 VU / 1 min |
| `k6_orders_load.js` | Cardio orders create+list | 100 VU / 9 min |
| `k6_ed_board_sse.js` | ED Live Board sustained connections | 200 VU / 10 min |
| `k6_ai_copilot.js` | AI co-pilot realistic mix | 10 RPS / 9 min |

## Run
```bash
k6 run --env BASE=https://staging-api.nama.local --env TOKEN=$STAGING_TOKEN k6_smoke.js
```

## CI integration
- Smoke test runs on every PR.
- Load tests run nightly against staging.
- Prod-like load tests pre-release.

## SLO mapping
| Path | p95 target |
|------|-----------|
| Patient search | 200 ms |
| Order create | 400 ms |
| Order list | 200 ms |
| AI co-pilot | 5 s |
| ED board SSE | 1 s push latency |

## Reporting
- Output to InfluxDB + Grafana dashboard `nama-perf`
- Failed thresholds fail the CI job
- Trend tracking: regression alert if p95 worsens by > 25%
