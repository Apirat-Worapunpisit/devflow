def test_register_success(client):
    response = client.post(
        "/auth/register",
        json={"email": "alice@example.com", "username": "alice", "password": "supersecret123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == "alice@example.com"
    assert data["username"] == "alice"
    assert "password" not in data
    assert "hashed_password" not in data


def test_register_duplicate_email(client):
    payload = {"email": "bob@example.com", "username": "bob", "password": "supersecret123"}
    client.post("/auth/register", json=payload)

    response = client.post("/auth/register", json={**payload, "username": "bob2"})
    assert response.status_code == 400


def test_register_weak_password(client):
    response = client.post(
        "/auth/register",
        json={"email": "carol@example.com", "username": "carol", "password": "short"},
    )
    assert response.status_code == 422


def test_login_success(client):
    client.post(
        "/auth/register",
        json={"email": "dave@example.com", "username": "dave", "password": "supersecret123"},
    )

    response = client.post(
        "/auth/login",
        json={"email": "dave@example.com", "username": "dave", "password": "supersecret123"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_login_wrong_password(client):
    client.post(
        "/auth/register",
        json={"email": "erin@example.com", "username": "erin", "password": "supersecret123"},
    )

    response = client.post(
        "/auth/login",
        json={"email": "erin@example.com", "username": "erin", "password": "wrongpassword"},
    )
    assert response.status_code == 401


def test_login_nonexistent_user(client):
    response = client.post(
        "/auth/login",
        json={"email": "nobody@example.com", "username": "nobody", "password": "supersecret123"},
    )
    assert response.status_code == 401
