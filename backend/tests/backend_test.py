"""
Backend tests for Moukis tech.
Focus: verify Mongo id serialization emits 'id' (not '_id') and full admin CRUD
flows for /api/contact and /api/blog still work end-to-end.
"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ["REACT_APP_BACKEND_URL"].rstrip("/") if os.environ.get("REACT_APP_BACKEND_URL") else None
if not BASE_URL:
    # Fall back to reading frontend/.env (tests run inside container)
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")
                break

ADMIN_EMAIL = "rewllasy@gmail.com"
ADMIN_PASSWORD = "MoukisTech2025!"


# ---------------- Fixtures ----------------
@pytest.fixture(scope="session")
def api():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="session")
def token(api):
    r = api.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, f"login failed: {r.status_code} {r.text}"
    return r.json()["access_token"]


@pytest.fixture(scope="session")
def auth(api, token):
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json", "Authorization": f"Bearer {token}"})
    return s


# ---------------- Auth ----------------
class TestAuth:
    def test_login_success(self, api):
        r = api.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        data = r.json()
        assert "access_token" in data and data["access_token"]
        assert data["user"]["email"] == ADMIN_EMAIL

    def test_login_bad_creds(self, api):
        r = api.post(f"{BASE_URL}/api/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_me_requires_auth(self, api):
        r = api.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 401

    def test_me_with_token(self, auth):
        r = auth.get(f"{BASE_URL}/api/auth/me")
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL


# ---------------- Blog: id serialization + CRUD ----------------
class TestBlogSerialization:
    def test_list_blog_emits_id_not_underscore_id(self, api):
        r = api.get(f"{BASE_URL}/api/blog")
        assert r.status_code == 200
        posts = r.json()
        assert len(posts) >= 1
        for p in posts:
            assert "id" in p, f"missing 'id' in {p.keys()}"
            assert "_id" not in p, f"'_id' should not be present, got keys {list(p.keys())}"
            assert isinstance(p["id"], str) and len(p["id"]) == 24

    def test_get_blog_by_slug_emits_id(self, api):
        # get first slug from list
        posts = api.get(f"{BASE_URL}/api/blog").json()
        slug = posts[0]["slug"]
        r = api.get(f"{BASE_URL}/api/blog/{slug}")
        assert r.status_code == 200
        data = r.json()
        assert "id" in data and "_id" not in data

    def test_get_blog_unknown_slug_404(self, api):
        r = api.get(f"{BASE_URL}/api/blog/does-not-exist-xyz")
        assert r.status_code == 404


class TestBlogCRUD:
    def test_create_edit_delete_blog(self, auth):
        # CREATE
        unique = uuid.uuid4().hex[:8]
        payload = {
            "title": f"TEST_Post_{unique}",
            "excerpt": "Un résumé",
            "content": "Contenu de test suffisamment long.",
            "cover_image": "https://example.com/x.jpg",
            "tags": ["test", "auto"],
            "published": True,
        }
        r = auth.post(f"{BASE_URL}/api/blog", json=payload)
        assert r.status_code == 201, r.text
        created = r.json()
        assert "id" in created and "_id" not in created
        assert created["title"] == payload["title"]
        assert isinstance(created["id"], str) and len(created["id"]) == 24
        post_id = created["id"]
        slug = created["slug"]

        # Verify persistence via GET by slug
        g = auth.get(f"{BASE_URL}/api/blog/{slug}")
        assert g.status_code == 200
        assert g.json()["id"] == post_id

        # UPDATE (PUT with full body)
        new_title = f"TEST_Post_{unique}_edited"
        upd_payload = {**payload, "title": new_title}
        r = auth.put(f"{BASE_URL}/api/blog/{post_id}", json=upd_payload)
        assert r.status_code == 200, r.text
        updated = r.json()
        assert updated["title"] == new_title
        assert updated["id"] == post_id
        assert "_id" not in updated

        # Verify persistence
        new_slug = updated["slug"]
        g = auth.get(f"{BASE_URL}/api/blog/{new_slug}")
        assert g.status_code == 200
        assert g.json()["title"] == new_title

        # DELETE
        r = auth.delete(f"{BASE_URL}/api/blog/{post_id}")
        assert r.status_code == 200
        assert r.json().get("success") is True

        # Verify removed
        r = auth.get(f"{BASE_URL}/api/blog/{new_slug}")
        assert r.status_code == 404

    def test_delete_blog_requires_auth(self, api):
        r = api.delete(f"{BASE_URL}/api/blog/507f1f77bcf86cd799439011")
        assert r.status_code == 401


# ---------------- Contact: id serialization + CRUD ----------------
class TestContactSerialization:
    def test_public_create_and_list_emits_id(self, api, auth):
        payload = {
            "name": "TEST_Alice",
            "email": "TEST_alice@example.com",
            "phone": "+33612345678",
            "service": "SSD",
            "message": "Message de test suffisamment long.",
        }
        r = api.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 201
        assert "id" in r.json()

        # List (auth)
        r = auth.get(f"{BASE_URL}/api/contact")
        assert r.status_code == 200
        contacts = r.json()
        assert len(contacts) >= 1
        for c in contacts:
            assert "id" in c and "_id" not in c
            assert isinstance(c["id"], str) and len(c["id"]) == 24

    def test_contact_list_requires_auth(self, api):
        r = api.get(f"{BASE_URL}/api/contact")
        assert r.status_code == 401


class TestContactCRUD:
    def test_create_markread_delete_contact(self, api, auth):
        payload = {
            "name": "TEST_Bob",
            "email": "TEST_bob@example.com",
            "phone": "",
            "service": "",
            "message": "Bonjour, contact CRUD test.",
        }
        r = api.post(f"{BASE_URL}/api/contact", json=payload)
        assert r.status_code == 201
        contact_id = r.json()["id"]
        assert isinstance(contact_id, str) and len(contact_id) == 24

        # Verify listed with is_read=false
        contacts = auth.get(f"{BASE_URL}/api/contact").json()
        target = next((c for c in contacts if c["id"] == contact_id), None)
        assert target is not None
        assert target["is_read"] is False

        # Mark as read
        r = auth.patch(f"{BASE_URL}/api/contact/{contact_id}/read")
        assert r.status_code == 200
        assert r.json().get("success") is True

        # Verify persisted
        contacts = auth.get(f"{BASE_URL}/api/contact").json()
        target = next((c for c in contacts if c["id"] == contact_id), None)
        assert target is not None and target["is_read"] is True

        # Delete
        r = auth.delete(f"{BASE_URL}/api/contact/{contact_id}")
        assert r.status_code == 200

        # Verify removed
        contacts = auth.get(f"{BASE_URL}/api/contact").json()
        assert not any(c["id"] == contact_id for c in contacts)

    def test_contact_validation(self, api):
        r = api.post(f"{BASE_URL}/api/contact", json={"name": "A", "email": "not-email", "message": "x"})
        assert r.status_code == 422
