import fs from 'fs-extra';
import _ from 'lodash';
import { ZodSchema } from 'zod';
import Ajv, { Schema } from 'ajv';
import jp from 'jsonpath';
import deepmerge from 'deepmerge';
import { FrameworkException } from "../../exceptions/Exceptions";

const ajv = new Ajv(); // Initialized outside the class once for performance

export class JsonUtility {
  
  // ==========================================
  // --- EXISTING CORE METHODS ---
  // ==========================================

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

  // ==========================================
  // --- EXISTING FILE I/O & CRUD METHODS ---
  // ==========================================

  /**
   * READ: Reads a JSON file from the disk and parses it into the specified type <T>.
   */
  readJsonFromFile<T>(filePath: string): T {
    try {
      return fs.readJsonSync(filePath) as T;
    } catch (error) {
      throw new FrameworkException(`Error reading JSON file at ${filePath}`, error);
    }
  }

  /**
   * CREATE / OVERWRITE: Writes data to a JSON file. Creates directories if they don't exist.
   */
  writeJsonToFile(filePath: string, data: unknown, pretty = true): void {
    try {
      const options = pretty ? { spaces: 2 } : {};
      fs.outputJsonSync(filePath, data, options);
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
      const data = this.readJsonFromFile<any>(filePath);
      _.set(data, nodePath, newValue);
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
      const data = this.readJsonFromFile<any>(filePath);
      _.unset(data, nodePath);
      this.writeJsonToFile(filePath, data);
    } catch (error) {
      throw new FrameworkException(`Failed to delete JSON value at path '${nodePath}' in ${filePath}`, error);
    }
  }

  // ==========================================
  // --- NEW: SCHEMA VALIDATION METHODS ---
  // ==========================================

  /**
   * Validates a JSON object using Zod.
   * Returns strongly-typed parsed data if successful.
   */
  validateWithZod<T>(data: unknown, schema: ZodSchema<T>): T {
    try {
      return schema.parse(data);
    } catch (error) {
      throw new FrameworkException("Zod Schema Validation Failed", error);
    }
  }

  /**
   * Validates a JSON object using Ajv.
   * Returns true if valid, throws FrameworkException with missing fields/types if invalid.
   */
  validateWithAjv(data: any, schema: Schema): boolean {
    try {
      const validate = ajv.compile(schema);
      const isValid = validate(data);
      if (!isValid) {
        throw new Error(ajv.errorsText(validate.errors));
      }
      return isValid;
    } catch (error) {
      throw new FrameworkException("Ajv Schema Validation Failed", error);
    }
  }

  // ==========================================
  // --- NEW: DATA EXTRACTION METHODS ---
  // ==========================================

  /**
   * Safely extracts a value from a nested JSON object using Lodash.
   * Returns the defaultValue if the path is not found or is undefined.
   */
  extractWithLodash(data: any, path: string, defaultValue?: any): any {
    try {
      return _.get(data, path, defaultValue);
    } catch (error) {
      throw new FrameworkException(`Failed to extract data at path '${path}' using Lodash`, error);
    }
  }

  /**
   * Queries a complex JSON object using JSONPath syntax.
   * Returns an array of matches.
   */
  extractWithJsonPath(data: any, jsonPathQuery: string): any[] {
    try {
      return jp.query(data, jsonPathQuery);
    } catch (error) {
      throw new FrameworkException(`Failed to extract data using JSONPath query '${jsonPathQuery}'`, error);
    }
  }

  // ==========================================
  // --- NEW: DATA MERGING METHODS ---
  // ==========================================

  /**
   * Deep merges two JSON objects using deepmerge.
   * Ideal for combining default test data with specific overrides without mutating originals.
   */
  mergeWithDeepmerge<T>(baseData: Partial<T>, overrideData: Partial<T>): T {
    try {
      return deepmerge(baseData, overrideData) as T;
    } catch (error) {
      throw new FrameworkException("Failed to merge JSON objects using deepmerge", error);
    }
  }

  /**
   * Deep merges two JSON objects using Lodash.
   * Creates a new object to prevent mutating the original targetData.
   */
  mergeWithLodash(targetData: any, sourceData: any): any {
    try {
      return _.merge({}, targetData, sourceData); 
    } catch (error) {
      throw new FrameworkException("Failed to merge JSON objects using Lodash", error);
    }
  }
}