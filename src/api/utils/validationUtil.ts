import { APIResponse } from '@playwright/test';
import Ajv from "ajv";

export function validateStatus(response: APIResponse, expectedStatus: number) {
  if (response.status() !== expectedStatus) {
    throw new Error(`Expected status ${expectedStatus}, got ${response.status()}`);
  }
}

export async function validateJsonSchema(response: APIResponse, schema: object) {
   
  //const Ajv = (await import('ajv')).default;
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const data = await response.json();
  if (!validate(data)) {
    throw new Error(`Schema validation failed: ${JSON.stringify(validate.errors)}`);
  }
}