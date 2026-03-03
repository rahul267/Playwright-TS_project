export function authHeader(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}