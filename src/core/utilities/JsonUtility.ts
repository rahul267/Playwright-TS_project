import { FrameworkException } from "../../exceptions/Exceptions";

export class JsonUtility {
  parse<T>(text: string): T {
    try {
      return JSON.parse(text) as T;
    } catch (error) {
      throw new FrameworkException("Invalid JSON", error);
    }
  }

  stringify(value: unknown, pretty = false): string {
    return JSON.stringify(value, null, pretty ? 2 : 0);
  }
}
