import { describe, it, expect, vi, beforeEach } from "vitest";
import { POST } from "./route";
import { NextRequest } from "next/server";

// Mock the dependencies
vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("@/lib/stellar", () => ({
  createTestnetAccount: vi.fn(),
}));

vi.mock("@/lib/db", () => ({
  db: {
    user: {
      update: vi.fn(),
    },
  },
}));

vi.mock("@/lib/api-response", () => ({
  successResponse: (data: unknown, status?: number) => ({
    json: () => ({ success: true, data }),
    status: status || 200,
  }),
  errorResponse: (message: string, status: number) => ({
    json: () => ({ success: false, error: message }),
    status,
  }),
  unauthorizedResponse: () => ({
    json: () => ({ success: false, error: "Unauthorized" }),
    status: 401,
  }),
}));

import { getCurrentUser } from "@/lib/auth";
import { createTestnetAccount } from "@/lib/stellar";
import { db } from "@/lib/db";

const mockGetCurrentUser = vi.mocked(getCurrentUser);
const mockCreateTestnetAccount = vi.mocked(createTestnetAccount);
const mockUserUpdate = vi.mocked(db.user.update);

// Helper to create a valid user object
function createMockUser(overrides: Record<string, unknown> = {}) {
  return {
    id: "user-1",
    email: "test@example.com",
    passwordHash: "hashed-password",
    stellarPublicKey: null,
    kycStatus: "pending" as const,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe("POST /api/stellar/account", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when user is not authenticated", async () => {
    mockGetCurrentUser.mockResolvedValue(null);

    const request = new NextRequest("http://localhost:3000/api/stellar/account", {
      method: "POST",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toEqual({ success: false, error: "Unauthorized" });
  });

  it("returns 409 when user already has a stellarPublicKey", async () => {
    const mockPublicKey = "G" + "A".repeat(55);
    mockGetCurrentUser.mockResolvedValue(createMockUser({ stellarPublicKey: mockPublicKey }));

    const request = new NextRequest("http://localhost:3000/api/stellar/account", {
      method: "POST",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data).toEqual({ success: false, error: "User already has a Stellar account" });
    expect(mockCreateTestnetAccount).not.toHaveBeenCalled();
  });

  it("creates a Stellar account and updates user record when user has no stellarPublicKey", async () => {
    const mockPublicKey = "G" + "A".repeat(55);
    const mockSecretKey = "S" + "A".repeat(55);

    mockGetCurrentUser.mockResolvedValue(createMockUser({ stellarPublicKey: null }));

    mockCreateTestnetAccount.mockResolvedValue({
      publicKey: mockPublicKey,
      secretKey: mockSecretKey,
    });

    mockUserUpdate.mockResolvedValue(createMockUser({ stellarPublicKey: mockPublicKey }));

    const request = new NextRequest("http://localhost:3000/api/stellar/account", {
      method: "POST",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(mockCreateTestnetAccount).toHaveBeenCalled();
    expect(mockUserUpdate).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: { stellarPublicKey: mockPublicKey },
    });
    expect(response.status).toBe(200);
    expect(data).toEqual({
      success: true,
      data: {
        publicKey: mockPublicKey,
        message: "Account generated. Secret key was logged server-side (dev only).",
      },
    });
  });

  it("returns 500 when createTestnetAccount fails", async () => {
    mockGetCurrentUser.mockResolvedValue(createMockUser({ stellarPublicKey: null }));

    mockCreateTestnetAccount.mockRejectedValue(new Error("Friendbot error"));

    const request = new NextRequest("http://localhost:3000/api/stellar/account", {
      method: "POST",
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toEqual({ success: false, error: "Failed to create Stellar account" });
  });
});