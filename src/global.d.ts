declare global {
  // Test-only clock hook used by the requirement tests.
  // Production falls back to the real current date.
  var __TEST_NOW__: string | undefined;
}

export {};
