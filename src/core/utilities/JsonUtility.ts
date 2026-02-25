import * as fs from 'node:fs';
import * as path from 'node:path';
import { FrameworkException } from "../../exceptions/Exceptions";

export class JsonUtility {
  
  // --- Existing Core Methods ---

  parse<T>(text: string): T {
    try {
      return JSON.parse(text) as T;
    } catch (error) {
      throw new FrameworkException("Invalid JSON", error);
    }
  }

  stringify(value: unknown, pretty = false): string {
    try {
      return JSON.stringify(value, null, pretty ? 2 : 0);
    } catch (error) {
      throw new FrameworkException("Failed to stringify JSON object", error);
    }
  }

  // --- New File I/O & CRUD Methods ---

  /**
   * READ: Reads a JSON file from the disk and parses it into the specified type <T>.
   */
  readJsonFromFile<T>(filePath: string): T {
    try {
      const absolutePath = path.resolve(filePath);
      if (!fs.existsSync(absolutePath)) {
        throw new Error(`File not found at: ${absolutePath}`);
      }
      const rawData = fs.readFileSync(absolutePath, 'utf-8');
      return this.parse<T>(rawData); // Reusing your parse method
    } catch (error) {
      throw new FrameworkException(`Error reading JSON file at ${filePath}`, error);
    }
  }

  /**
   * CREATE / OVERWRITE: Writes data to a JSON file. Creates directories if they don't exist.
   */
  writeJsonToFile(filePath: string, data: unknown, pretty = true): void {
    try {
      const absolutePath = path.resolve(filePath);
      const dir = path.dirname(absolutePath);
      
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      const jsonString = this.stringify(data, pretty); // Reusing your stringify method
      fs.writeFileSync(absolutePath, jsonString, 'utf-8');
    } catch (error) {
      throw new FrameworkException(`Error writing JSON file to ${filePath}`, error);
    }
  }

  /**
   * UPDATE: Updates a specific node in a complex JSON file using dot notation.
   * Example nodePath: "environment.qa.url"
   */
  updateValueInFile(filePath: string, nodePath: string, newValue: unknown): void {
    try {
      // Read the existing file
      const data = this.readJsonFromFile<Record<string, any>>(filePath);
      const keys = nodePath.split('.');
      let current = data;

      // Traverse the JSON tree
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        // If the node doesn't exist or isn't an object, create it
        if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
          current[key] = {}; 
        }
        current = current[key];
      }

      // Set the new value at the final key
      current[keys[keys.length - 1]] = newValue;
      
      // Write the updated object back to the file
      this.writeJsonToFile(filePath, data);
    } catch (error) {
      throw new FrameworkException(`Failed to update JSON value at path '${nodePath}' in ${filePath}`, error);
    }
  }

  /**
   * DELETE: Removes a specific node from the JSON file using dot notation.
   */
  deleteValueFromFile(filePath: string, nodePath: string): void {
    try {
      const data = this.readJsonFromFile<Record<string, any>>(filePath);
      const keys = nodePath.split('.');
      let current = data;

      // Traverse to find the parent of the node to delete
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
          return; // Path doesn't exist, exit gracefully
        }
        current = current[key];
      }

      // Delete the final key
      const finalKey = keys[keys.length - 1];
      if (current && finalKey in current) {
        delete current[finalKey];
        this.writeJsonToFile(filePath, data);
      }
    } catch (error) {
      throw new FrameworkException(`Failed to delete JSON value at path '${nodePath}' in ${filePath}`, error);
    }
  }
}