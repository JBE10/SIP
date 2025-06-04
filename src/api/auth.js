import { mockAuth, mockUser } from '../data/mockUser';

const API_URL = "http://localhost:8000";

export async function registerUser(userData) {
  // Simular registro exitoso
  return {
    user: mockUser,
    token: mockAuth.token
  };
}

export async function loginUser(loginData) {
  // Simular login exitoso
  return {
    access_token: mockAuth.token,
    token_type: "bearer"
  };
}

export async function getCurrentUser() {
  // Simular obtener usuario actual
  return mockUser;
} 