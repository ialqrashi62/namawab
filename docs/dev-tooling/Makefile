SHELL := /bin/bash
COMPOSE := docker compose -f docker-compose.dev.yml

.DEFAULT_GOAL := help

# ─────────────────────────────────────────────────────────
help:
	@echo "NamaMedical — Make targets"
	@echo "  make up                   start dev stack"
	@echo "  make down                 stop dev stack"
	@echo "  make logs S=<svc>         tail service logs"
	@echo "  make ps                   list running services"
	@echo "  make seed                 load seed data into MSSQL"
	@echo "  make migrate              run all migrations"
	@echo "  make rag-ingest           ingest guideline corpora to Qdrant"
	@echo "  make test                 run all tests"
	@echo "  make lint                 run all linters"
	@echo "  make fmt                  auto-format codebase"
	@echo "  make e2e                  run Playwright e2e"
	@echo "  make build                build all docker images"
	@echo "  make smoke                smoke test running stack"
	@echo "  make clean                wipe volumes (destructive)"

# ─────────────────────────────────────────────────────────
up:
	$(COMPOSE) up -d
	@echo "Stack up. Portal: http://localhost:8080  AI: http://localhost:8000  Grafana: http://localhost:3000"

down:
	$(COMPOSE) down

logs:
	$(COMPOSE) logs -f $(S)

ps:
	$(COMPOSE) ps

# ─────────────────────────────────────────────────────────
seed:
	@for f in seeders/*_seed.sql; do \
	  echo "→ $$f"; \
	  $(COMPOSE) exec -T mssql /opt/mssql-tools/bin/sqlcmd \
	    -S localhost -U sa -P '[REDACTED_SECRET_VALUE]' -d master -i /seeders/$$(basename $$f); \
	done

migrate:
	@for d in migrations/*; do \
	  for f in $$d/*.sql; do \
	    echo "→ $$f"; \
	    $(COMPOSE) exec -T mssql /opt/mssql-tools/bin/sqlcmd \
	      -S localhost -U sa -P '[REDACTED_SECRET_VALUE]' -d master -i /seeders/../$$f; \
	  done; \
	done

rag-ingest:
	python services/ai-orchestrator/rag/ingest.py --src ./guidelines --collections all

# ─────────────────────────────────────────────────────────
test:
	pytest -q
	cd web && npm test -- --watchAll=false

lint:
	ruff check .
	mypy services/ orchestration/ --ignore-missing-imports
	cd web && npm run lint

fmt:
	ruff format .
	cd web && npm run format

e2e:
	cd web && npx playwright test

build:
	$(COMPOSE) build

smoke:
	bash scripts/smoke.sh http://localhost:8000

clean:
	$(COMPOSE) down -v
	@echo "Volumes wiped."
