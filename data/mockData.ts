export interface User {
  id: number
  name: string
  email: string
  description: string
  sports: string
  profile_picture?: string
  age?: number
  location?: string
}

export interface Match {
  id: number;
  userId: number;
  matchedUserId: number;
  status: 'pending' | 'accepted' | 'rejected';
}

export const mockUsers: User[] = [
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan@example.com',
    description: 'Amante del fútbol y buscando partidos casuales',
    sports: 'Fútbol',
    profile_picture: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: 2,
    name: 'María García',
    email: 'maria@example.com',
    description: 'Jugadora de tenis nivel intermedio',
    sports: 'Tenis',
    profile_picture: 'https://randomuser.me/api/portraits/women/1.jpg'
  },
  {
    id: 3,
    name: 'Carlos López',
    email: 'carlos@example.com',
    description: 'Basketball player looking for pickup games',
    sports: 'Basketball',
    profile_picture: 'https://randomuser.me/api/portraits/men/2.jpg'
  }
];

export const mockMatches: Match[] = [
  {
    id: 1,
    userId: 1,
    matchedUserId: 2,
    status: 'accepted'
  },
  {
    id: 2,
    userId: 1,
    matchedUserId: 3,
    status: 'pending'
  }
];

// Función mock para simular login
export const mockLogin = (email: string, password: string): User | null => {
  const user = mockUsers.find(u => u.email === email);
  if (user && password === 'password') {
    return user;
  }
  return null;
};

// Función mock para simular registro
export const mockRegister = (userData: Omit<User, 'id'>): User => {
  const newUser = {
    ...userData,
    id: mockUsers.length + 1
  };
  mockUsers.push(newUser);
  return newUser;
}; 