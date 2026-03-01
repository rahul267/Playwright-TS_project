import { test, expect } from '@playwright/test';
import { JsonCRUDUtility } from '../core/utilities/JsonUtility';
import { TestDataLoader } from '../testdata/TestDataLoader';

test.describe('JsonCRUDUtility - JSON CRUD', () => {
  let sampleJson: any;

  test.beforeEach(() => {
    sampleJson = TestDataLoader.loadJson('complex-testdata.json');
   
  });

  test('should create a new property', async () => {
    const result = JsonCRUDUtility.create(sampleJson, ['countries', 0, 'lobs', 0, 'tier'], 'Gold');
    console.log('After create:', JSON.stringify(sampleJson.countries[0].lobs[0], null, 2));
    expect(result.success).toBe(true);
    expect(sampleJson.countries[0].lobs[0].tier).toBe('Gold');
  });

  test('should add a new product under USA Commercial LOB', async () => {
    const newProduct = { id: 'P-2003', name: 'TEST' };
    const result = JsonCRUDUtility.create(sampleJson, ['countries', 0, 'lobs', 1, 'products', 2], newProduct);
    console.log('After product create:', JSON.stringify(sampleJson.countries[0].lobs[1].products, null, 2));
    expect(result.success).toBe(true);
    expect(sampleJson.countries[0].lobs[1].products[2]).toEqual(newProduct);
  });

  test('should read an existing property', async () => {
    const result = JsonCRUDUtility.read(sampleJson, ['countries', 0, 'lobs', 0, 'products', 0, 'name']);
    console.log('Read productName:', result.value);
    expect(result.success).toBe(true);
    expect(result.value).toBe('PolicyPro');
  });

  test('should update an existing property', async () => {
    const result = JsonCRUDUtility.update(sampleJson, ['countries', 0, 'lobs', 1, 'products', 0, 'name'], 'BizShield X');
    console.log('After update:', JSON.stringify(sampleJson.countries[0].lobs[1].products[0], null, 2));
    expect(result.success).toBe(true);
    expect(sampleJson.countries[0].lobs[1].products[0].name).toBe('BizShield X');
  });

  test('should delete a property', async () => {
    const result = JsonCRUDUtility.delete(sampleJson, ['countries', 1, 'name']);
    console.log('After delete:', JSON.stringify(sampleJson.countries[1], null, 2));
    expect(result.success).toBe(true);
    expect(sampleJson.countries[1].name).toBeUndefined();
  });

  test('should return error for non-existent path', async () => {
    const result = JsonCRUDUtility.read(sampleJson, ['doesNotExist']);
    console.log('Read error:', result.error);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

//Edge cases
  test('should create missing nested objects for deep path', async () => {
    const result = JsonCRUDUtility.create(sampleJson, ['countries', 0, 'lobs', 0, 'metadata', 'owner'], 'team-a');
    console.log('After deep create:', JSON.stringify(sampleJson.countries[0].lobs[0], null, 2));
    expect(result.success).toBe(true);
    expect(sampleJson.countries[0].lobs[0].metadata.owner).toBe('team-a');
  });

  test('should return error for array index out of bounds', async () => {
    const result = JsonCRUDUtility.read(sampleJson, ['countries', 0, 'lobs', 0, 'products', 99, 'name']);
    console.log('Out of bounds read error:', result.error);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Array index 99 not found');
  });

  test('should return error when updating non-existent path', async () => {
    const result = JsonCRUDUtility.update(sampleJson, ['countries', 0, 'lobs', 0, 'products', 99, 'name'], 'Nope');
    console.log('Update non-existent path result:', result.error);
    expect(result.success).toBe(false);
    expect(result.error).toContain('Array index 99 not found');
  });

  test('should delete array element by index and shift items', async () => {
    const result = JsonCRUDUtility.delete(sampleJson, ['countries', 0, 'lobs', 0, 'products', 0]);
    console.log('After array delete:', JSON.stringify(sampleJson.countries[0].lobs[0].products, null, 2));
    expect(result.success).toBe(true);
    expect(sampleJson.countries[0].lobs[0].products[0].id).toBe('P-1002');
  });


  //Negative scenarios
  test('should return error when deleting non-existent key', async () => {
    const result = JsonCRUDUtility.delete(sampleJson, ['countries', 0, 'nonExistentKey']);
    console.log('Delete non-existent key error:', result.error);
    expect(result.success).toBe(false);
    expect(result.error).toContain('does not exist');
  });

  test('should return error for empty path', async () => {
    const result = JsonCRUDUtility.read(sampleJson, []);
    console.log('Empty path error:', result.error);
    expect(result.success).toBe(false);
    expect(result.error).toBe('Path cannot be empty');
  });

  test('should return descriptive error for nested missing key', async () => {
    const result = JsonCRUDUtility.read(sampleJson, ['countries', 0, 'invalidLOB', 'products']);
    console.log('Nested missing key error:', result.error);
    expect(result.success).toBe(false);
    expect(result.error).toContain("Key 'invalidLOB' not found");
  });
});
