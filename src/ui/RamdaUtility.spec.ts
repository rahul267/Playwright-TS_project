import { test, expect } from '@playwright/test';
import * as R from 'ramda';
import { TestDataLoader } from '../testdata/TestDataLoader';

// Ramda is a functional programming library optimized for immutable data transformations.
// It provides path-based operations without mutating the original data.
test.describe('Ramda - JSON Operations', () => {
  let sampleJson: any;

  test.beforeEach(() => {
    sampleJson = TestDataLoader.loadJson('complex-testdata.json');
  });

  test('should read a nested value using ramda path', async () => {
    const name = R.path(['countries', 0, 'name'], sampleJson);
    expect(name).toBe('USA');
  });

  test('should create a new nested value using ramda assocPath', async () => {
    const updated = R.assocPath(['countries', 0, 'lobs', 0, 'tier'], 'Gold', sampleJson);
    expect(R.path(['countries', 0, 'lobs', 0, 'tier'], updated)).toBe('Gold');
    // Original is unchanged (immutable)
    expect(R.path(['countries', 0, 'lobs', 0, 'tier'], sampleJson)).toBeUndefined();
  });

  test('should update an existing value using ramda assocPath', async () => {
    const updated = R.assocPath(
      ['countries', 0, 'lobs', 1, 'products', 0, 'name'],
      'BizShield X',
      sampleJson
    );
    expect(R.path(['countries', 0, 'lobs', 1, 'products', 0, 'name'], updated)).toBe('BizShield X');
    // Original remains unchanged
    expect(R.path(['countries', 0, 'lobs', 1, 'products', 0, 'name'], sampleJson)).toBe('BizShield');
  });

  test('should delete a property using ramda dissocPath', async () => {
    const updated = R.dissocPath(['countries', 1, 'name'], sampleJson);
    expect(R.path(['countries', 1, 'name'], updated)).toBeUndefined();
    // Original unchanged
    expect(R.path(['countries', 1, 'name'], sampleJson)).toBe('India');
  });

  test('should check if a nested key exists using ramda has and path', async () => {
    const exists = R.has('lobs', R.path(['countries', 0], sampleJson));
    expect(exists).toBe(true);
  });

  test('should filter products by name using ramda filter', async () => {
    const products = R.path(['countries', 0, 'lobs', 0, 'products'], sampleJson);
    const filtered = R.filter((product: any) => product.name.includes('Pro'), products);
    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered[0].name).toContain('Pro');
  });

  test('should find first product matching condition using ramda find', async () => {
    const products = R.path(['countries', 0, 'lobs', 0, 'products'], sampleJson);
    const found = R.find((product: any) => product.id === 'P-1001', products);
    expect(found).toBeDefined();
    expect(found?.name).toBe('PolicyPro');
  });

  test('should map and transform product names using ramda map', async () => {
    const products = R.path(['countries', 0, 'lobs', 0, 'products'], sampleJson);
    const transformed = R.map((product: any) => ({ ...product, name: product.name.toUpperCase() }), products);
    expect(transformed[0].name).toBe('POLICYPRO');
    // Original unchanged
    expect(products[0].name).toBe('PolicyPro');
  });

  test('should deep merge objects using ramda mergeDeepRight', async () => {
    const newData = { countries: [{ lobs: [{ tier: 'Platinum' }] }] };
    const merged = R.mergeDeepRight(sampleJson, newData);
    expect(R.path(['countries', 0, 'lobs', 0, 'tier'], merged)).toBe('Platinum');
    console.log('Merged JSON:', JSON.stringify(merged, null, 2));
    console.log('Original JSON remains unchanged:', JSON.stringify(sampleJson, null, 2));
  });

  test('should extract specific fields using ramda pick', async () => {
    const country = R.path(['countries', 0], sampleJson);
    const picked = R.pick(['name', 'lobs'], country);
    expect(picked.name).toBe('USA');
    expect(picked.lobs).toBeDefined();
    expect(Object.keys(picked)).toEqual(['name', 'lobs']);
  });

  test('should return default value for missing path using ramda pathOr', async () => {
    const value = R.pathOr('UNKNOWN', ['countries', 99, 'name'], sampleJson);
    expect(value).toBe('UNKNOWN');
  });

  test('should count items using ramda length and filter', async () => {
    const products = R.path(['countries', 0, 'lobs'], sampleJson);
    const count = R.length(products);
    expect(count).toBe(2); // USA has 2 LOBs: Retail and Commercial
  });

  test('should check if any value matches using ramda any', async () => {
    const products = R.path(['countries', 0, 'lobs', 0, 'products'], sampleJson);
    const anyProProd = R.any((product: any) => product.name.includes('Pro'), products);
    expect(anyProProd).toBe(true);
  });

  test('should check if all values match condition using ramda all', async () => {
    const products = R.path(['countries', 0, 'lobs', 0, 'products'], sampleJson);
    const allHaveId = R.all((product: any) => R.has('id', product), products);
    expect(allHaveId).toBe(true);
  });

  test('should group objects by property using ramda groupBy', async () => {
    // Get all products from all countries/lobs
    const allProducts: any[] = [];
    R.forEach((country: any) => {
      R.forEach((lob: any) => {
        R.forEach((product: any) => {
          allProducts.push(product);
        }, lob.products);
      }, country.lobs);
    }, sampleJson.countries);
    
    const grouped = R.groupBy((p: any) => p.id.charAt(2), allProducts);
    console.log('Products grouped by ID prefix:', grouped);
    expect(Object.keys(grouped).length).toBeGreaterThan(0);
  });

  test('should sort products by ID using ramda sortBy', async () => {
    const products = R.path(['countries', 0, 'lobs', 0, 'products'], sampleJson);
    const sorted = R.sortBy((p: any) => p.id, products);
    expect(sorted[0].id).toBe('P-1001');
    expect(sorted[1].id).toBe('P-1002');
  });

  test('should compose multiple operations using ramda pipe', async () => {
    const result = R.pipe(
      R.pathOr([], ['countries', 0, 'lobs', 0, 'products']),
      R.filter((p: any) => p.id.startsWith('P-1')),
      R.map((p: any) => p.name),
      R.head
    )(sampleJson);
    
    expect(result).toBe('PolicyPro');
  });

  test('should apply conditional transformation using ramda when', async () => {
    const product = R.path(['countries', 0, 'lobs', 0, 'products', 0], sampleJson);
    const updated = R.when(
      (p: any) => p.id === 'P-1001',
      R.assoc('status', 'ACTIVE'),
      product
    );
    expect(updated.status).toBe('ACTIVE');
  });
});
