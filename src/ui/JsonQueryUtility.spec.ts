import { test, expect } from '@playwright/test';
import { JsonQueryUtility } from '../core/utilities/JsonUtility';
import { TestDataLoader } from '../testdata/TestDataLoader';

test.describe('JsonQueryUtility - Deep Search & Filtering', () => {
  let sampleJson: any;

  test.beforeEach(() => {
    sampleJson = TestDataLoader.loadJson('complex-testdata.json');
  });

  // Deep search by key name
  test('should find all occurrences of a key in nested structure', async () => {
    const results = JsonQueryUtility.findByKey(sampleJson, 'name');
    console.log('Found "name" keys:', JSON.stringify(results, null, 2));
    
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.value === 'USA')).toBe(true);
    expect(results.some(r => r.value === 'PolicyPro')).toBe(true);
  });

  test('should find all product IDs in the structure', async () => {
    const results = JsonQueryUtility.findByKey(sampleJson, 'id');
    console.log('Found product IDs:', JSON.stringify(results, null, 2));
    
    expect(results.length).toBeGreaterThan(0);
    expect(results.some(r => r.value === 'P-1001')).toBe(true);
    expect(results.every(r => typeof r.value === 'string')).toBe(true);
  });

  test('should return empty array for non-existent key', async () => {
    const results = JsonQueryUtility.findByKey(sampleJson, 'nonExistentKey');
    console.log('Non-existent key results:', results);
    
    expect(results.length).toBe(0);
  });

  // Find by value predicate
  test('should find all products with specific ID pattern', async () => {
    const results = JsonQueryUtility.findByValue(
      sampleJson, 
      (value: any) => typeof value === 'object' && value?.id && value.id.startsWith('P-1')
    );
    console.log('Products with P-1 prefix:', JSON.stringify(results, null, 2));
    expect(results.every(r => r.value.id.startsWith('P-1'))).toBe(true);
  });

  test('should find all string values containing "Commercial"', async () => {
    const results = JsonQueryUtility.findByValue(
      sampleJson,
      (value: any) => typeof value === 'string' && value.includes('Commercial')
    );
    console.log('Values containing "Commercial":', JSON.stringify(results, null, 2));
    
    expect(results.length).toBeGreaterThan(0);
  });

  // Filter array elements
  test('should filter products by name pattern', async () => {
    const result = JsonQueryUtility.filterArray(
      sampleJson,
      ['countries', 0, 'lobs', 0, 'products'],
      (product: any) => product.name.includes('Pro')
    );
    console.log('Filtered products:', JSON.stringify(result.result, null, 2));
    
    expect(result.success).toBe(true);
    expect(result.result?.length).toBeGreaterThan(0);
    expect(result.result?.every(p => p.name.includes('Pro'))).toBe(true);
  });

  test('should filter products by ID range', async () => {
    const result = JsonQueryUtility.filterArray(
      sampleJson,
      ['countries', 0, 'lobs', 1, 'products'],
      (product: any) => product.id >= 'P-2001' && product.id <= 'P-2010'
    );
    console.log('Products in ID range:', JSON.stringify(result.result, null, 2));
    
    expect(result.success).toBe(true);
    expect(result.result?.length).toBeGreaterThan(0);
  });

  test('should return error when filtering non-array path', async () => {
    const result = JsonQueryUtility.filterArray(
      sampleJson,
      ['countries', 0, 'name'],
      (item: any) => true
    );
    console.log('Filter non-array error:', result.error);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('not an array');
  });

  test('should return error when filtering non-existent path', async () => {
    const result = JsonQueryUtility.filterArray(
      sampleJson,
      ['countries', 0, 'invalidPath'],
      (item: any) => true
    );
    console.log('Filter invalid path error:', result.error);
    
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  // Find first matching object
  test('should find first product with specific ID', async () => {
    const result = JsonQueryUtility.findFirst(
      sampleJson,
      (value: any) => typeof value === 'object' && value?.id === 'P-2001'
    );
    console.log('First product with P-2001:', JSON.stringify(result.value, null, 2));
    
    expect(result.success).toBe(true);
    expect(result.value?.id).toBe('P-2001');
    expect(result.value?.name).toBe('BizShield');
    expect(result.path).toBeDefined();
  });

  test('should find first LOB named "Retail"', async () => {
    const result = JsonQueryUtility.findFirst(
      sampleJson,
      (value: any) => typeof value === 'object' && value?.name === 'Retail'
    );
    console.log('First Retail LOB:', JSON.stringify(result, null, 2));
    
    expect(result.success).toBe(true);
    expect(result.value?.name).toBe('Retail');
  });

  test('should return error when no match found', async () => {
    const result = JsonQueryUtility.findFirst(
      sampleJson,
      (value: any) => typeof value === 'object' && value?.id === 'DOES-NOT-EXIST'
    );
    console.log('No match error:', result.error);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('No matching object found');
  });

  // Exists check
  test('should check if specific country exists', async () => {
    const exists = JsonQueryUtility.exists(
      sampleJson,
      (value: any) => value === 'India'
    );
    console.log('India exists:', exists);
    
    expect(exists).toBe(true);
  });

  test('should check if product with specific ID exists', async () => {
    const exists = JsonQueryUtility.exists(
      sampleJson,
      (value: any) => typeof value === 'object' && value?.id === 'P-3001'
    );
    console.log('Product P-3001 exists:', exists);
    
    expect(exists).toBe(true);
  });

  test('should return false for non-existent value', async () => {
    const exists = JsonQueryUtility.exists(
      sampleJson,
      (value: any) => value === 'NonExistentCountry'
    );
    console.log('Non-existent country exists:', exists);
    
    expect(exists).toBe(false);
  });

  // Count occurrences
  test('should count all product objects', async () => {
    const count = JsonQueryUtility.count(
      sampleJson,
      (value: any) => typeof value === 'object' && value?.id && value?.name && value.id.startsWith('P-')
    );
    console.log('Total products count:', count);
    
    expect(count).toBeGreaterThan(0);
  });

  test('should count LOBs in structure', async () => {
    const count = JsonQueryUtility.count(
      sampleJson,
      (value: any) => typeof value === 'object' && value?.name && value?.products && Array.isArray(value.products)
    );
    console.log('Total LOBs count:', count);
    
    expect(count).toBe(3); // USA has Retail + Commercial, India has SMB
  });

  test('should count countries', async () => {
    const count = JsonQueryUtility.count(
      sampleJson,
      (value: any) => typeof value === 'object' && value?.name && value?.lobs && Array.isArray(value.lobs)
    );
    console.log('Total countries count:', count);
    
    expect(count).toBe(2); // USA and India
  });

  // Complex queries
  test('should find all products across all countries and LOBs', async () => {
    const allProducts = JsonQueryUtility.findByValue(
      sampleJson,
      (value: any) => typeof value === 'object' && 
                      value !== null && 
                      'id' in value && 
                      'name' in value && 
                      typeof value.id === 'string' && 
                      value.id.startsWith('P-')
    );
    console.log('All products found:', allProducts.length);
    console.log('Product details:', JSON.stringify(allProducts, null, 2));
    
    expect(allProducts.length).toBeGreaterThan(0);
  });

  test('should find all arrays in the structure', async () => {
    const arrays = JsonQueryUtility.findByValue(
      sampleJson,
      (value: any) => Array.isArray(value)
    );
    console.log('All arrays found:', arrays.length);
    console.log('Array paths:', arrays.map(a => a.path));
    
    expect(arrays.length).toBeGreaterThan(0);
  });
});
