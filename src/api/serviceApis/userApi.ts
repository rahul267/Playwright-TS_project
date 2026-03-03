import { BaseApi } from '../baseApi';

export class JsonPlaceholderUsersApi extends BaseApi {
  async getUsers(headers?: Record<string, string>) {
    return this.get('/users', headers);
  }

  async createUser(user: object, headers?: Record<string, string>) {
    return this.post('/users', user, headers);
  }

  async updateUser(id: number, user: object, headers?: Record<string, string>) {
    return this.put(`/users/${id}`, user, headers);
  }

  async patchUser(id: number, partial: object, headers?: Record<string, string>) {
    return this.patch(`/users/${id}`, partial, headers);
  }

  async deleteUser(id: number, headers?: Record<string, string>) {
    return this.delete(`/users/${id}`, headers);
  }
}