# Stub routers for unfinished endpoints — replace with full implementations.
from . import router_health, router_orders, router_ai  # noqa: F401

# Placeholder modules to satisfy main.py imports during scaffolding.
from types import ModuleType
import sys


def _stub(name: str) -> ModuleType:
    mod = ModuleType(name)
    from fastapi import APIRouter
    mod.router = APIRouter()
    sys.modules[f"{__name__}.{name}"] = mod
    return mod


router_ecg = _stub("router_ecg")
router_echo = _stub("router_echo")
router_cath = _stub("router_cath")
router_devices = _stub("router_devices")
router_hf = _stub("router_hf")
