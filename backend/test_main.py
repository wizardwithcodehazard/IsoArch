import pytest
from fastapi.testclient import TestClient
from main import app, get_mock_mto
from models import MTOResult

client = TestClient(app)

def test_health_check():
    """Test that the liveness check endpoint works."""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_mock_fallback_endpoint():
    """Test that uploading a file with no keys returns the Mock MTO payload gracefully."""
    # We send a dummy image byte payload
    files = {"file": ("test.png", b"dummy_bytes", "image/png")}
    response = client.post("/api/extract", files=files)
    
    assert response.status_code == 200
    json_data = response.json()
    
    # Verify that the structure matches MTOResult schema
    assert "drawing_meta" in json_data
    assert "items" in json_data
    assert "summary" in json_data
    
    # Check that it contains mock indicators
    assert json_data["drawing_meta"]["drawing_no"] == "ISO-1501-01"
    assert len(json_data["items"]) > 0
    assert json_data["items"][0]["remarks"] == "Mock fallback"

def test_schema_validation():
    """Test that MTOResult schema behaves correctly under validation rules."""
    valid_payload = get_mock_mto()
    
    # Should validate without throwing any error
    result = MTOResult(**valid_payload)
    assert result.drawing_meta.drawing_no == "ISO-1501-01"
    assert len(result.items) == 2
    
    # Try invalid payload missing required category field
    invalid_payload = get_mock_mto()
    del invalid_payload["items"][0]["category"]
    
    from pydantic import ValidationError
    with pytest.raises(ValidationError):
        MTOResult(**invalid_payload)
