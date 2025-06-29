export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://web-production-07ed64.up.railway.app';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_URL}/auth/login`,
    REGISTER: `${API_URL}/auth/register`,
    PROFILE_UPDATE: `${API_URL}/auth/profile/update`,
  },
  USER: {
    ME: `${API_URL}/users/me`,
    UPLOAD_PHOTO: `${API_URL}/upload-profile-picture`,
  },
};

export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Origin': 'https://sip-gray.vercel.app'
}; 
