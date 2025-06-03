const API_URL = "http://localhost:8000";

export async function registerUser(userData) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Error al registrar");
  }

  return res.json();
}

export async function loginUser(loginData) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(loginData),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.detail || "Error al iniciar sesión");
  }

  return res.json(); // { access_token, token_type }
} 