// Test setup file for Vitest
// This file runs before each test suite

// Set test environment variables
process.env.JWT_SECRET = "test-jwt-secret-for-testing-min-32-chars-long";
process.env.DATABASE_URL = "postgresql://postgres:postgres@localhost:5432/remitx_test";
process.env.STELLAR_NETWORK = "testnet";