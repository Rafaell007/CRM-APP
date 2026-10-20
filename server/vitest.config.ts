import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["src/**/*.test.ts"],
    env: {
      JWT_SECRET: "test-secret",
      MONGODB_URI: "mongodb://not-used-in-tests",
      NODE_ENV: "test",
    },
    // The first run downloads a MongoDB binary for mongodb-memory-server
    hookTimeout: 120_000,
  },
});
