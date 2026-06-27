# Backend Skeleton — `cardio-api`

> Production-grade FastAPI service template for any NamaMedical department.
> Copy to `services/cardio-api/`, change `dept_key`, register routers.

## Layout
```
app/
├── main.py                # FastAPI entrypoint, middleware, routes
├── settings.py            # 12-factor config
├── api/                   # HTTP routers
│   ├── router_health.py
│   ├── router_orders.py
│   └── router_ai.py
├── db/
│   ├── session.py         # async SQLAlchemy engine + session
│   └── models.py          # ORM models
├── schemas/cardio.py      # Pydantic request/response
├── services/
│   ├── repository.py      # data access
│   └── risk_calculators.py# HEART/CHA2DS2/HAS-BLED/GRACE/DOAC
├── security/
│   ├── auth.py            # OIDC RS256 JWT validation
│   └── middleware.py      # Request-id + hash-chained audit log
└── events/publisher.py    # Kafka idempotent producer

tests/
├── test_risk_calculators.py  # 100% coverage on calculators
└── test_orders_api.py        # API integration test
```

## Run locally
```bash
make up                              # docker-compose stack
uvicorn app.main:app --reload        # API
pytest -q                            # tests
```

## Conventions
- All datetime fields stored as `DATETIMEOFFSET`.
- All primary keys are UUIDs.
- Mutating endpoints accept `Idempotency-Key` and publish events.
- AI co-pilot returns advisory only; never autonomous.

## Wiring AI co-pilot
- See `docs/orchestration/langgraph_base.py` for `DeptOrchestrator`.
- Inject into `router_ai.py` ask() instead of the stub.

## Production checklist
- [ ] Bind real OIDC issuer + audience
- [ ] Configure Vault for secrets
- [ ] Enable mTLS service-mesh
- [ ] Wire audit log persistence (currently logs only)
- [ ] Rate limit middleware (Redis token bucket)
- [ ] Background tasks for slow operations (ECG inference)
- [ ] Set Prometheus alert thresholds (see `observability/`)
