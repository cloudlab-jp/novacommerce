import { httpClient } from '@/lib/http-client';
import type { User } from '@/types/auth';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
}

export interface UpdateProfilePayload {
  name?: string;
  email?: string;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

// El backend, al autenticar, setea las cookies HttpOnly de access/refresh
// token en la respuesta (Set-Cookie) y devuelve solo el `user` en el body.
export const authApi = {
  login: (payload: LoginPayload) =>
    httpClient.post<User>('/auth/login', payload).then((res) => res.data),

  register: (payload: RegisterPayload) =>
    httpClient.post<User>('/auth/register', payload).then((res) => res.data),

  logout: () => httpClient.post('/auth/logout'),

  me: () => httpClient.get<User>('/auth/me').then((res) => res.data),

  updateMe: (payload: UpdateProfilePayload) =>
    httpClient.patch<User>('/auth/me', payload).then((res) => res.data),

  changePassword: (payload: ChangePasswordPayload) =>
    httpClient.post('/auth/change-password', payload),
};
