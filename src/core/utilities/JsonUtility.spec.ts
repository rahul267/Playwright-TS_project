import * as fs from 'node:fs';
import * as path from 'node:path';
import { test, expect } from '@playwright/test';
import { JsonUtility } from './JsonUtility';

test.describe('JsonUtility Unit Tests', () => {
  const jsonUtility = new JsonUtility();
  // Create a temporary directory for file operations to avoid polluting the project root
  const tempDir = path.join(process.cwd(), 'temp-unit-tests');
  const testFilePath = path.join(tempDir, 'test-data.json');

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
    const data = { key: "value", number: 42 };
    jsonUtility.writeJsonToFile(testFilePath, data);
    
    const readData = jsonUtility.readJsonFromFile<{ key: string; number: number }>(testFilePath);
    expect(readData).toEqual(data);
  });

  test('should update a nested value in the file', () => {
    const initialData = { settings: { theme: "dark", notifications: true } };
    jsonUtility.writeJsonToFile(testFilePath, initialData);

    jsonUtility.updateValueInFile(testFilePath, "settings.theme", "light");

    const updatedData = jsonUtility.readJsonFromFile<typeof initialData>(testFilePath);
    expect(updatedData.settings.theme).toBe("light");
    expect(updatedData.settings.notifications).toBe(true);
  });

  test('should delete a value from the file', () => {
    const initialData = { settings: { theme: "dark", notifications: true } };
    jsonUtility.writeJsonToFile(testFilePath, initialData);

    jsonUtility.deleteValueFromFile(testFilePath, "settings.notifications");

    const updatedData = jsonUtility.readJsonFromFile<any>(testFilePath);
    expect(updatedData.settings.notifications).toBeUndefined();
    expect(updatedData.settings.theme).toBe("dark");
  });

  test('should handle complex JSON structures with nested objects and arrays', () => {
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
});