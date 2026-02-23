export class CoreUtilities {
  static delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static timestamp(): string {
    return new Date().toISOString();
  }

  static generateId(prefix = "id"): string {
    const random = Math.random().toString(36).slice(2, 10);
    return `${prefix}-${Date.now()}-${random}`;
  }
}
