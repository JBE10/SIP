export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sip-backend-production.up.railway.app';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_URL}/auth/login`,
    REGISTER: `${API_URL}/auth/register`,
  },
  USER: {
    ME: `${API_URL}/users/me`,
    UPLOAD_PHOTO: `${API_URL}/users/upload-photo`,
  },
}; 