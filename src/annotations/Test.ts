const testMetadata = new Map<string, TestMetadata>();

export interface TestMetadata {
  id?: string;
  tags?: string[];
  owner?: string;
  severity?: "low" | "medium" | "high" | "critical";
}

export function Test(metadata: TestMetadata = {}): MethodDecorator {
  return ((...args: unknown[]) => {
    const possibleContext = args[1] as { name?: string } | undefined;

    if (possibleContext?.name) {
      testMetadata.set(String(possibleContext.name), metadata);
      return args[0];
    }

    const propertyKey = args[1] as string | symbol | undefined;
    if (propertyKey !== undefined) {
      testMetadata.set(String(propertyKey), metadata);
    }

    return undefined;
  }) as MethodDecorator;
}

export function getTestMetadata(testName: string): TestMetadata | undefined {
  return testMetadata.get(testName);
}
