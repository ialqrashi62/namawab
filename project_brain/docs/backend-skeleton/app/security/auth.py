"""JWT auth via OIDC (RS256)."""

from __future__ import annotations

import time

import httpx
from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt

from ..settings import settings

_jwks_cache: dict[str, list] = {"keys": [], "fetched_at": 0}
_JWKS_TTL = 3600

bearer = HTTPBearer(auto_error=False)


async def _jwks() -> list[dict]:
    if time.time() - _jwks_cache["fetched_at"] < _JWKS_TTL and _jwks_cache["keys"]:
        return _jwks_cache["keys"]
    async with httpx.AsyncClient(timeout=5) as c:
        resp = await c.get(settings.jwks_url)
        resp.raise_for_status()
        _jwks_cache["keys"] = resp.json().get("keys", [])
        _jwks_cache["fetched_at"] = time.time()
    return _jwks_cache["keys"]


async def current_user(
    request: Request,
    creds: HTTPAuthorizationCredentials | None = Depends(bearer),
) -> dict:
    if creds is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Missing token")
    token = creds.credentials
    try:
        unverified = jwt.get_unverified_header(token)
        kid = unverified.get("kid")
        keys = await _jwks()
        key = next((k for k in keys if k.get("kid") == kid), None)
        if key is None:
            raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Unknown signing key")
        payload = jwt.decode(
            token, key,
            algorithms=["RS256"],
            audience=settings.oidc_audience,
            issuer=settings.oidc_issuer,
        )
    except JWTError as e:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, f"Invalid token: {e}") from e

    request.state.user = payload
    return payload


def require_scope(*needed: str):
    async def checker(user: dict = Depends(current_user)) -> dict:
        scopes = set((user.get("scope") or "").split())
        if not set(needed).issubset(scopes):
            raise HTTPException(
                status.HTTP_403_FORBIDDEN,
                f"Missing scope(s): {', '.join(set(needed) - scopes)}",
            )
        return user
    return checker


def require_role(*roles: str):
    async def checker(user: dict = Depends(current_user)) -> dict:
        user_roles = set(user.get("realm_access", {}).get("roles", []))
        if not set(roles).intersection(user_roles):
            raise HTTPException(
                status.HTTP_403_FORBIDDEN,
                f"Required role(s): {', '.join(roles)}",
            )
        return user
    return checker
