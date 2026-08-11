# filepath: 02_MODULES/DEP-030/29_test_integration.py
# Integration tests for Pediatric_Nephrology (DEP-030)

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from unittest.mock import patch

from main import app
from db import get_db, Base
from auth.jwt_handler import create_test_token


SQLALCHEMY_TEST_URL = "postgresql://test:test@localhost:5432/nama_test"

engine = create_engine(SQLALCHEMY_TEST_URL)
TestingSessionLocal = sessionmaker(bind=engine)


@pytest.fixture
def db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            db.close()
    app.dependency_overrides[get_db] = override_get_db
    return TestClient(app)


@pytest.fixture
def auth_headers():
    token = create_test_token(user_id=1, tenant_id=1, roles=["pedsNeph_specialist"])
    return {"Authorization": f"Bearer {token}", "x-tenant-id": "1"}


class TestPedsnephAPI:
    def test_list_requires_tenant(self, client):
        res = client.get("/api/pedsNeph/list")
        assert res.status_code == 400  # Missing tenant header

    def test_list_with_tenant(self, client, auth_headers):
        res = client.get("/api/pedsNeph/list", headers=auth_headers)
        assert res.status_code == 200
        assert "items" in res.json() or isinstance(res.json(), list)

    def test_create_requires_role(self, client, db):
        token = create_test_token(user_id=1, tenant_id=1, roles=["nurse"])
        headers = {"Authorization": f"Bearer {token}", "x-tenant-id": "1"}
        res = client.post("/api/pedsNeph/", json={"patient_id": 1}, headers=headers)
        assert res.status_code == 403  # Forbidden

    def test_create_success(self, client, auth_headers, db):
        db.execute("INSERT INTO patients(tenant_id, mrn, name) VALUES (1, 'MRN001', 'Test')")
        res = client.post("/api/pedsNeph/", json={"patient_id": 1, "chief_complaint": "Test"}, headers=auth_headers)
        assert res.status_code == 201
        assert res.json()["patient_id"] == 1

    def test_ai_diagnose(self, client, auth_headers):
        with patch("rag_pipeline.build_diagnosis_agent") as mock:
            mock.return_value.invoke.return_value = {"output": "Possible STEMI"}
            res = client.post("/api/pedsNeph/ai/diagnose", json={"question": "Chest pain"}, headers=auth_headers)
            assert res.status_code == 200