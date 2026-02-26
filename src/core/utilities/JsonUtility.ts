// Independent JSON CRUD Utility for complex JSON operations
export class JsonCRUDUtility {
  // Create: Add a new property or element
  static create(target: any, path: (string|number)[], value: any): { success: boolean; error?: string } {
    if (!path || path.length === 0) {
      return { success: false, error: 'Path cannot be empty' };
    }
    let obj = target;
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (typeof key === "number" && Array.isArray(obj)) {
        if (!obj[key]) obj[key] = {};
        obj = obj[key];
      } else {
        if (!(key in obj)) {
          obj[key] = {};
        }
        obj = obj[key];
      }
    }
    obj[path[path.length - 1]] = value;
    return { success: true };
  }

  // Read: Get a property or element by path
  static read(target: any, path: (string|number)[]): { success: boolean; value?: any; error?: string } {
    if (!path || path.length === 0) {
      return { success: false, error: 'Path cannot be empty' };
    }
    let obj = target;
    for (let i = 0; i < path.length; i++) {
      const key = path[i];
      if (typeof key === "number" && Array.isArray(obj)) {
        if (!obj[key]) {
          return { success: false, error: `Array index ${key} not found at path: ${path.slice(0, i + 1).join('.')}` };
        }
        obj = obj[key];
      } else {
        if (!(key in obj)) {
          return { success: false, error: `Key '${key}' not found at path: ${path.slice(0, i + 1).join('.')}` };
        }
        obj = obj[key];
      }
    }
    return { success: true, value: obj };
  }

  // Update: Update a property or element by path
  static update(target: any, path: (string|number)[], value: any): { success: boolean; error?: string } {
    if (!path || path.length === 0) {
      return { success: false, error: 'Path cannot be empty' };
    }
    let obj = target;
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (typeof key === "number" && Array.isArray(obj)) {
        if (!obj[key]) {
          return { success: false, error: `Array index ${key} not found at path: ${path.slice(0, i + 1).join('.')}` };
        }
        obj = obj[key];
      } else {
        if (!(key in obj)) {
          return { success: false, error: `Key '${key}' not found at path: ${path.slice(0, i + 1).join('.')}` };
        }
        obj = obj[key];
      }
    }
    const lastKey = path[path.length - 1];
    if ((typeof lastKey === "number" && Array.isArray(obj) && obj[lastKey] !== undefined) ||
        (typeof lastKey === "string" && lastKey in obj)) {
      obj[lastKey] = value;
      return { success: true };
    }
    return { success: false, error: `Target key '${lastKey}' does not exist at path: ${path.join('.')}` };
  }

  // Delete: Remove a property or element by path
  static delete(target: any, path: (string|number)[]): { success: boolean; error?: string } {
    if (!path || path.length === 0) {
      return { success: false, error: 'Path cannot be empty' };
    }
    let obj = target;
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (typeof key === "number" && Array.isArray(obj)) {
        if (!obj[key]) {
          return { success: false, error: `Array index ${key} not found at path: ${path.slice(0, i + 1).join('.')}` };
        }
        obj = obj[key];
      } else {
        if (!(key in obj)) {
          return { success: false, error: `Key '${key}' not found at path: ${path.slice(0, i + 1).join('.')}` };
        }
        obj = obj[key];
      }
    }
    const lastKey = path[path.length - 1];
    if ((typeof lastKey === "number" && Array.isArray(obj) && obj[lastKey] !== undefined) ||
        (typeof lastKey === "string" && lastKey in obj)) {
      if (typeof lastKey === "number") {
        obj.splice(lastKey, 1);
      } else {
        delete obj[lastKey];
      }
      return { success: true };
    }
    return { success: false, error: `Target key '${lastKey}' does not exist at path: ${path.join('.')}` };
  }
}


// JSON Query Utility for deep search and filtering operations
export class JsonQueryUtility {
  // Deep search: Find all occurrences of a key anywhere in the JSON structure
  static findByKey(target: any, keyName: string): Array<{ path: string; value: any }> {
    const results: Array<{ path: string; value: any }> = [];
    
    const search = (obj: any, currentPath: string[] = []): void => {
      if (obj === null || obj === undefined) return;
      
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          search(item, [...currentPath, String(index)]);
        });
      } else if (typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
          const newPath = [...currentPath, key];
          if (key === keyName) {
            results.push({
              path: newPath.join('.'),
              value: obj[key]
            });
          }
          search(obj[key], newPath);
        });
      }
    };
    
    search(target);
    return results;
  }

  // Find all values matching a condition
  static findByValue(target: any, predicate: (value: any) => boolean): Array<{ path: string; value: any }> {
    const results: Array<{ path: string; value: any }> = [];
    
    const search = (obj: any, currentPath: string[] = []): void => {
      if (obj === null || obj === undefined) return;
      
      if (predicate(obj)) {
        results.push({
          path: currentPath.join('.'),
          value: obj
        });
      }
      
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          search(item, [...currentPath, String(index)]);
        });
      } else if (typeof obj === 'object') {
        Object.keys(obj).forEach(key => {
          search(obj[key], [...currentPath, key]);
        });
      }
    };
    
    search(target);
    return results;
  }

  // Filter array elements based on property values
  static filterArray(target: any, arrayPath: (string|number)[], predicate: (item: any) => boolean): { success: boolean; result?: any[]; error?: string } {
    if (!arrayPath || arrayPath.length === 0) {
      return { success: false, error: 'Path cannot be empty' };
    }
    
    let obj = target;
    for (let i = 0; i < arrayPath.length; i++) {
      const key = arrayPath[i];
      if (typeof key === "number" && Array.isArray(obj)) {
        if (!obj[key]) {
          return { success: false, error: `Array index ${key} not found` };
        }
        obj = obj[key];
      } else {
        if (!(key in obj)) {
          return { success: false, error: `Key '${key}' not found` };
        }
        obj = obj[key];
      }
    }
    
    if (!Array.isArray(obj)) {
      return { success: false, error: 'Target is not an array' };
    }
    
    const filtered = obj.filter(predicate);
    return { success: true, result: filtered };
  }

  // Find first object in nested structure matching criteria
  static findFirst(target: any, predicate: (value: any) => boolean): { success: boolean; path?: string; value?: any; error?: string } {
    let foundPath: string[] | null = null;
    let foundValue: any = null;
    
    const search = (obj: any, currentPath: string[] = []): boolean => {
      if (obj === null || obj === undefined) return false;
      
      if (predicate(obj)) {
        foundPath = currentPath;
        foundValue = obj;
        return true;
      }
      
      if (Array.isArray(obj)) {
        for (let i = 0; i < obj.length; i++) {
          if (search(obj[i], [...currentPath, String(i)])) return true;
        }
      } else if (typeof obj === 'object') {
        for (const key of Object.keys(obj)) {
          if (search(obj[key], [...currentPath, key])) return true;
        }
      }
      
      return false;
    };
    
    if (search(target)) {
      return { success: true, path: foundPath!.join('.'), value: foundValue };
    }
    
    return { success: false, error: 'No matching object found' };
  }

  // Check if any value in the JSON matches a condition
  static exists(target: any, predicate: (value: any) => boolean): boolean {
    const search = (obj: any): boolean => {
      if (obj === null || obj === undefined) return false;
      
      if (predicate(obj)) return true;
      
      if (Array.isArray(obj)) {
        return obj.some(item => search(item));
      } else if (typeof obj === 'object') {
          return Object.values(obj as Record<string, unknown>).some((value: unknown) => search(value));
      }
      
      return false;
    };
    
    return search(target);
  }

  // Count occurrences of values matching a condition
  static count(target: any, predicate: (value: any) => boolean): number {
    let count = 0;
    
    const search = (obj: any): void => {
      if (obj === null || obj === undefined) return;
      
      if (predicate(obj)) count++;
      
      if (Array.isArray(obj)) {
        obj.forEach(item => search(item));
      } else if (typeof obj === 'object') {
          Object.values(obj as Record<string, unknown>).forEach((value: unknown) => search(value));
      }
    };
    
    search(target);
    return count;
  }
}



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

