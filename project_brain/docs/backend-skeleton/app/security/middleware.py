"""Request-id + audit middleware. Hash-chained tamper-evident audit log."""

from __future__ import annotations

import hashlib
import json
import time
import uuid

import structlog
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

logger = structlog.get_logger(__name__)

_LAST_HASH = "0" * 64


class RequestIdMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        rid = request.headers.get("X-Request-Id") or str(uuid.uuid4())
        request.state.request_id = rid
        response: Response = await call_next(request)
        response.headers["X-Request-Id"] = rid
        return response


class AuditMiddleware(BaseHTTPMiddleware):
    """Logs mutating HTTP calls to audit chain."""

    AUDIT_METHODS = {"POST", "PATCH", "PUT", "DELETE"}

    async def dispatch(self, request: Request, call_next):
        if request.method not in self.AUDIT_METHODS:
            return await call_next(request)

        started = time.time()
        response = await call_next(request)
        elapsed_ms = int((time.time() - started) * 1000)

        try:
            user = getattr(request.state, "user", {})
            event = {
                "ts": time.time(),
                "request_id": getattr(request.state, "request_id", None),
                "actor": user.get("sub") or "anonymous",
                "actor_role": (user.get("realm_access", {}).get("roles") or [None])[0],
                "method": request.method,
                "path": request.url.path,
                "status": response.status_code,
                "elapsed_ms": elapsed_ms,
            }
            global _LAST_HASH
            payload = f"{_LAST_HASH}:{json.dumps(event, sort_keys=True)}"
            new_hash = hashlib.sha256(payload.encode()).hexdigest()
            event["prev_hash"] = _LAST_HASH
            event["this_hash"] = new_hash
            _LAST_HASH = new_hash
            # In production: persist event to it_audit_logs (async batch).
            logger.info("audit", **event)
        except Exception as e:  # noqa: BLE001
            logger.warning("audit_log_failed", error=str(e))

        return response
