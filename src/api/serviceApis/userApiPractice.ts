// userApi.ts
import { BaseApiPractice, FilePayloadLite } from '../baseApiPractice';
import type { APIResponse } from '@playwright/test';
import fs from 'node:fs';

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export class UserApiPractice extends BaseApiPractice {
  async getUsers(params?: { page?: number; limit?: number }, headers?: Record<string, string>) {
    return this.get<User[]>('/users', { params, headers });
  }

  async createUser(user: Partial<User>, headers?: Record<string, string>) {
    return this.post<User, Partial<User>>('/users', { data: user, headers });
  }

  async createUserWithForm(form: { name: string; email: string }, headers?: Record<string, string>) {
    return this.post<User>('/users', { form, headers });
  }

  async uploadAvatar(id: number, filePath: string, headers?: Record<string, string>) {
    const filePayload: FilePayloadLite = {
      name: 'avatar',
      mimeType: 'image/png',
      fileName: 'avatar.png',
      buffer: fs.readFileSync(filePath),
    };

    return this.post<APIResponse>(`/users/${id}/avatar`, {
      multipart: { avatar: filePayload, userId: String(id) },
      headers,
    });
  }

  async updateUser(id: number, user: Partial<User>, headers?: Record<string, string>) {
    return this.put<User, Partial<User>>(`/users/${id}`, { data: user, headers });
  }

  async patchUser(id: number, partial: Partial<User>, headers?: Record<string, string>) {
    return this.patch<User, Partial<User>>(`/users/${id}`, { data: partial, headers });
  }

  async deleteUser(id: number, headers?: Record<string, string>) {
    return this.delete(`/users/${id}`, { headers });
  }
}