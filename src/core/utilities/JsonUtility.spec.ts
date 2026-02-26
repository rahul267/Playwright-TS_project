import * as fs from 'node:fs';
import * as path from 'node:path';
import { test, expect } from '@playwright/test';
import { z } from 'zod';
import { JsonUtility } from './JsonUtility';

test.describe('JsonUtility Unit Tests', () => {
  test.describe.configure({ mode: 'serial' });
  const jsonUtility = new JsonUtility();
  // Create a temporary directory for file operations to avoid polluting the project root
  const tempDir = path.join(process.cwd(), 'temp-unit-tests');

  test.beforeAll(() => {
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
  });

  test.afterAll(() => {
    // Cleanup: Remove the temporary directory after tests finish
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  });

  // ==========================================
  // --- EXISTING TESTS ---
  // ==========================================

  test('should parse valid JSON string correctly', () => {
    const jsonString = '{"name": "Playwright", "awesome": true}';
    const result = jsonUtility.parse<{ name: string; awesome: boolean }>(jsonString);
    expect(result.name).toBe("Playwright");
    expect(result.awesome).toBe(true);
  });

  test('should stringify object correctly', () => {
    const obj = { id: 123, type: "test" };
    const result = jsonUtility.stringify(obj, true);
    // Note: The utility uses pretty print by default or based on arg, checking structure
    expect(result).toContain('"id": 123');
    expect(result).toContain('"type": "test"');
  });

  test('should write to file and read from file', () => {
    const testFilePath = path.join(tempDir, 'test-data-rw.json');
    const data = { key: "value", number: 42 };
    jsonUtility.writeJsonToFile(testFilePath, data);
    
    const readData = jsonUtility.readJsonFromFile<{ key: string; number: number }>(testFilePath);
    expect(readData).toEqual(data);
  });

  test('should update a nested value in the file', () => {
    const testFilePath = path.join(tempDir, 'test-data-update.json');
    const initialData = { settings: { theme: "dark", notifications: true } };
    jsonUtility.writeJsonToFile(testFilePath, initialData);

    jsonUtility.updateValueInFile(testFilePath, "settings.theme", "light");

    const updatedData = jsonUtility.readJsonFromFile<typeof initialData>(testFilePath);
    expect(updatedData.settings.theme).toBe("light");
    expect(updatedData.settings.notifications).toBe(true);
  });

  test('should delete a value from the file', () => {
    const testFilePath = path.join(tempDir, 'test-data-delete.json');
    const initialData = { settings: { theme: "dark", notifications: true } };
    jsonUtility.writeJsonToFile(testFilePath, initialData);

    jsonUtility.deleteValueFromFile(testFilePath, "settings.notifications");

    const updatedData = jsonUtility.readJsonFromFile<any>(testFilePath);
    expect(updatedData.settings.notifications).toBeUndefined();
    expect(updatedData.settings.theme).toBe("dark");
  });

  test('should handle complex JSON structures with nested objects and arrays', () => {
    const testFilePath = path.join(tempDir, 'test-data-complex.json');
    const complexData = {
      projectName: "SuperApp",
      version: 1.0,
      features: ["auth", "dashboard", "settings"],
      metadata: {
        created: "2023-01-01",
        author: {
          name: "DevTeam",
          id: 99
        }
      },
      configs: [
        { env: "dev", debug: true },
        { env: "prod", debug: false }
      ]
    };

    jsonUtility.writeJsonToFile(testFilePath, complexData);

    // Verify read of deep properties
    const readData = jsonUtility.readJsonFromFile<typeof complexData>(testFilePath);
    expect(readData.metadata.author.name).toBe("DevTeam");
    expect(readData.features).toContain("dashboard");
    expect(readData.configs[1].env).toBe("prod");

    // Verify update on deeply nested path
    jsonUtility.updateValueInFile(testFilePath, "metadata.author.name", "QA-Team");
    
    // Verify update that creates new nested structure
    jsonUtility.updateValueInFile(testFilePath, "metadata.deployment.status", "active");

    const updatedData = jsonUtility.readJsonFromFile<any>(testFilePath);
    expect(updatedData.metadata.author.name).toBe("QA-Team");
    expect(updatedData.metadata.deployment.status).toBe("active");
    // Ensure other parts remain untouched
    expect(updatedData.features.length).toBe(3);
  });

  test('should handle deeply nested arrays of objects from complex test data', () => {
    const testFilePath = path.join(tempDir, 'test-data-complex-arrays.json');
    const complexArrayData = {
      countries: [
        {
          name: "USA",
          lobs: [
            {
              name: "Retail",
              products: [
                { id: "P-1001", name: "PolicyPro" },
                { id: "P-1002", name: "ClaimTrack" }
              ]
            }
          ]
        }
      ]
    };

    jsonUtility.writeJsonToFile(testFilePath, complexArrayData);

    // Verify reading a deeply nested property
    const readData = jsonUtility.readJsonFromFile<typeof complexArrayData>(testFilePath);
    expect(readData.countries[0].lobs[0].products[1].name).toBe("ClaimTrack");

    // Verify updating a property inside a nested array
    jsonUtility.updateValueInFile(testFilePath, "countries.0.lobs.0.products.1.name", "ClaimTrack V2");

    const updatedData = jsonUtility.readJsonFromFile<typeof complexArrayData>(testFilePath);
    expect(updatedData.countries[0].lobs[0].products[1].name).toBe("ClaimTrack V2");
  });

  // ==========================================
  // --- NEW TESTS: SCHEMA VALIDATION ---
  // ==========================================

  test('should validate JSON successfully using Zod', () => {
    const UserSchema = z.object({
      id: z.number(),
      name: z.string(),
    });
    const validData = { id: 1, name: "Alice" };
    
    const result = jsonUtility.validateWithZod(validData, UserSchema);
    expect(result).toEqual(validData);
  });

  test('should throw error when Zod validation fails', () => {
    const UserSchema = z.object({ id: z.number() });
    const invalidData = { id: "not-a-number" };
    
    expect(() => jsonUtility.validateWithZod(invalidData, UserSchema)).toThrow();
  });

  test('should validate JSON successfully using Ajv', () => {
    const schema = {
      type: "object",
      properties: { foo: { type: "string" } },
      required: ["foo"]
    };
    const validData = { foo: "bar" };
    
    const isValid = jsonUtility.validateWithAjv(validData, schema);
    expect(isValid).toBe(true);
  });

  test('should throw error when Ajv validation fails', () => {
    const schema = {
      type: "object",
      properties: { foo: { type: "string" } },
      required: ["foo"]
    };
    const invalidData = { foo: 123 }; // Should be a string
    
    expect(() => jsonUtility.validateWithAjv(invalidData, schema)).toThrow();
  });

  // ==========================================
  // --- NEW TESTS: DATA EXTRACTION ---
  // ==========================================

  test('should safely extract nested data using Lodash', () => {
    const data = { user: { profile: { email: "test@test.com" } } };
    
    const email = jsonUtility.extractWithLodash(data, 'user.profile.email');
    expect(email).toBe("test@test.com");

    const missing = jsonUtility.extractWithLodash(data, 'user.profile.age', 25);
    expect(missing).toBe(25); // Defaults to 25
  });

  test('should extract data using JSONPath syntax', () => {
    const data = {
      store: {
        book: [
          { category: "reference", author: "Nigel Rees", title: "Sayings of the Century", price: 8.95 },
          { category: "fiction", author: "Evelyn Waugh", title: "Sword of Honour", price: 12.99 }
        ]
      }
    };
    
    // Extract all authors
    const authors = jsonUtility.extractWithJsonPath(data, '$..author');
    expect(authors).toEqual(["Nigel Rees", "Evelyn Waugh"]);
  });

  // ==========================================
  // --- NEW TESTS: DATA MERGING ---
  // ==========================================

  test('should deeply merge two objects using deepmerge', () => {
    const defaultData = { timeout: 5000, headers: { accept: "application/json" } };
    const overrideData = { headers: { authorization: "Bearer token" } };
    
    const result = jsonUtility.mergeWithDeepmerge(defaultData, overrideData as any);
    
    expect(result.timeout).toBe(5000);
    expect(result.headers.accept).toBe("application/json");
    expect((result.headers as any).authorization).toBe("Bearer token");
  });

  test('should deeply merge two objects using Lodash without mutating target', () => {
    const targetData = { id: 1, config: { retries: 2 } };
    const sourceData = { config: { timeout: 1000 } };
    
    const result = jsonUtility.mergeWithLodash(targetData, sourceData);
    
    // Result should have properties from both
    expect(result.id).toBe(1);
    expect(result.config.retries).toBe(2);
    expect(result.config.timeout).toBe(1000);
    
    // Original target should NOT be mutated to include the timeout
    expect(targetData.config).not.toHaveProperty('timeout');
  });
});