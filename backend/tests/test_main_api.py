"""
Automated Test — FastAPI App & Endpoints (backend/test_main_api.py)
Tests root endpoint, OpenAPI schema generation, CORS headers, and app setup.
"""

import os
import sys
from fastapi.testclient import TestClient

# Ensure backend directory is in python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.main_api import app

client = TestClient(app)


def test_root_endpoint() -> None:
    """Validate that the root GET / endpoint returns 200 OK and expected welcome payload."""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the Crown Atlas API"}


def test_openapi_schema() -> None:
    """Validate OpenAPI schema generation, verifying API title and version."""
    response = client.get("/openapi.json")
    assert response.status_code == 200
    json_data = response.json()
    assert json_data["info"]["title"] == "Crown Atlas API"
    assert json_data["info"]["version"] == "1.0.0"


def test_favicon_endpoint() -> None:
    """Validate that GET /favicon.ico responds with a 204 No Content status."""
    response = client.get("/favicon.ico")
    assert response.status_code == 204


def test_cors_headers() -> None:
    """Validate CORS headers for permitted frontend origin (http://localhost:3000)."""
    response = client.get("/", headers={"Origin": "http://localhost:3000"})
    assert response.status_code == 200
    assert (
        response.headers.get("access-control-allow-origin") == "http://localhost:3000"
    )


if __name__ == "__main__":
    test_root_endpoint()
    test_openapi_schema()
    test_favicon_endpoint()
    test_cors_headers()
    print(">>> ALL BACKEND API TESTS PASSED SUCCESSFULLY! <<<")
