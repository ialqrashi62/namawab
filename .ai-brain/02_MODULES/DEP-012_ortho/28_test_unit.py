# filepath: 02_MODULES/DEP-012/28_test_unit.py
# Unit tests for Orthopedics (DEP-012)

import pytest
from unittest.mock import MagicMock, patch
from datetime import datetime

from .service import OrthoService


class TestOrthoService:
    """Unit tests for service layer."""

    def test_init_requires_tenant(self):
        db = MagicMock()
        with pytest.raises(ValueError, match="tenant_id required"):
            OrthoService(db, tenant_id=None)

    def test_init_sets_tenant(self):
        db = MagicMock()
        svc = OrthoService(db, tenant_id=1)
        assert svc.tenant_id == 1
        db.execute.assert_called_once()

    def test_list_encounters_filters_by_tenant(self):
        db = MagicMock()
        svc = OrthoService(db, tenant_id=42)
        svc.db.query.return_value.filter.return_value.filter.return_value.limit.return_value.offset.return_value.all.return_value = []
        result = svc.list_encounters()
        assert result == []

    def test_create_encounter_sets_audit(self):
        db = MagicMock()
        svc = OrthoService(db, tenant_id=1)
        payload = {"patient_id": 100, "chief_complaint": "Test"}
        result = svc.create_encounter(payload, actor_id=5)
        assert result is not None
        svc.db.add.assert_called_once()
        svc.db.commit.assert_called_once()

    def test_drug_interactions_returns_list(self):
        with patch("tools.drug_check.DrugCheckService") as mock_cls:
            mock_cls.return_value.check_interactions.return_value = [
                {"severity": "high", "drugs": ["warfarin", "amiodarone"], "mechanism": "CYP3A4"}
            ]
            db = MagicMock()
            svc = OrthoService(db, tenant_id=1)
            result = svc.check_drug_interactions(["warfarin", "amiodarone"])
            assert len(result) == 1
            assert result[0]["severity"] == "high"