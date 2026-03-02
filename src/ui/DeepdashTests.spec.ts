import { test, expect } from '@playwright/test';
import lodash from 'lodash';
import deepdash from 'deepdash';
import { TestDataLoader } from '../testdata/TestDataLoader';

// Extend lodash with deepdash's methods
const _ = deepdash(lodash);

//Lodash handles CRUD (get, set, unset, filter), and Deepdash adds deep search (eachDeep).
test.describe('Deepdash - JSON Operations', () => {
  let sampleJson: any;

  test.beforeEach(() => {
    sampleJson = TestDataLoader.loadJson('complex-testdata.json');
  });

  //Get: Retrieve a value by path
  test('should read a nested value using lodash get', async () => {
    const name = _.get(sampleJson, 'countries[0].name');
    expect(name).toBe('USA');
  });

  //Set: Create or update a value by path
  test('should create a new nested value using lodash set', async () => {
    _.set(sampleJson, 'countries[0].lobs[0].tier', 'Gold');
    expect(sampleJson.countries[0].lobs[0].tier).toBe('Gold');
  });
  
  test('should update an existing value using lodash set', async () => {
    _.set(sampleJson, 'countries[0].lobs[1].products[0].name', 'BizShield X');
    expect(sampleJson.countries[0].lobs[1].products[0].name).toBe('BizShield X');
  });

  //unset: Delete a value by path
  test('should delete a property using lodash unset', async () => {
    const removed = _.unset(sampleJson, 'countries[1].name');
    expect(removed).toBe(true);
    expect(sampleJson.countries[1].name).toBeUndefined();
  });

  //eachDeep: Deep search through all levels of the JSON structure
  test('should deep search for all product ids using eachDeep', async () => {
    const ids: string[] = [];
    _.eachDeep(sampleJson, (value: any, key: any) => {
      if (key === 'id' && typeof value === 'string') {
        ids.push(value);
      }
    });
    expect(ids.length).toBeGreaterThan(0);
    expect(ids).toContain('P-1001');
  });

  //filter: Filter array elements by criteria
  test('should filter products by name using lodash filter', async () => {
    const products = _.get(sampleJson, 'countries[0].lobs[0].products', []);
    const filtered = _.filter(products, (item: any) => item.name.includes('Pro'));
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered[0].name).toContain('Pro');
  });

  //has: Check if a nested key exists
  test('should check if a nested key exists using lodash has', async () => {
    const hasKey = _.has(sampleJson, 'countries[0].lobs[1].products');
    expect(hasKey).toBe(true);
  });

  //findDeep: Find first occurrence matching criteria in nested structure
  test('should validate a value exists using deepdash findDeep', async () => {
    const hasValue = _.findDeep(sampleJson, (value: any) => value === 'India');
    expect(hasValue).toBeDefined();
  });


  test('should validate a key-value pair exists using deepdash findDeep', async () => {
    const result = _.findDeep(sampleJson, (value: any, key: any) => key === 'id' && value === 'P-1001');
    expect(result).toBeDefined();
  });

  test('should return default value for missing path using lodash get', async () => {
    const value = _.get(sampleJson, 'countries[99].name', 'UNKNOWN');
    expect(value).toBe('UNKNOWN');
  });

  test('should return false when deleting non-existent path using lodash unset', async () => {
    const removed = _.unset(sampleJson, 'countries[1].nonExistentKey');
    expect(removed).toBe(false);
  });

  test('should create nested arrays when setting out-of-range index', async () => {
    _.set(sampleJson, 'countries[0].lobs[0].products[5].name', 'NewProd');
    expect(sampleJson.countries[0].lobs[0].products[5].name).toBe('NewProd');
  });

  test('should return undefined when deep search has no match', async () => {
    const result = _.findDeep(sampleJson, (value: any) => value === 'DoesNotExist');
    expect(result).toBeUndefined();
  });
});
