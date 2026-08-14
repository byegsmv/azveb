import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { prisma } from "@/lib/prisma";
import { signAccessToken } from "@/lib/auth";
import * as userModulesRoute from "@/app/api/admin/user-modules/route";
import * as userModuleSingleRoute from "@/app/api/admin/users/[id]/modules/route";
import * as aiSettingsRoute from "@/app/api/admin/ai-settings/route";
import * as studioRoute from "@/app/api/admin/studio/route";
import ModuleToggleSystem from "@/components/admin/ModuleToggleSystem";
import NoCodeAdminStudio from "@/components/dashboard/NoCodeAdminStudio";
import { apiFetch } from "@/lib/apiClient";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    userModule: {
      findMany: jest.fn(),
      upsert: jest.fn(),
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    setting: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      upsert: jest.fn(),
      create: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

jest.mock("@/lib/apiClient", () => ({
  apiFetch: jest.fn(),
}));

describe("Super Admin Panel Test Suite", () => {
  const superAdminToken = signAccessToken({
    id: "superadmin-123",
    role: "SUPER_ADMIN",
    email: "superadmin@fermer.az",
  });

  const superAdminUser = {
    id: "superadmin-123",
    role: "SUPER_ADMIN",
    email: "superadmin@fermer.az",
    status: "ACTIVE",
    isBanned: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("1. User Modules API Routes (/api/admin/user-modules)", () => {
    test("GET returns 403 for non-SUPER_ADMIN users", async () => {
      const buyerToken = signAccessToken({ id: "buyer-1", role: "BUYER", email: "buyer@fermer.az" });
      prisma.user.findUnique.mockResolvedValueOnce({ role: "BUYER", email: "buyer@fermer.az", status: "ACTIVE" });

      const req = new Request("http://localhost/api/admin/user-modules", {
        headers: { Authorization: `Bearer ${buyerToken}` },
      });
      const res = await userModulesRoute.GET(req);
      expect(res.status).toBe(403);
    });

    test("GET returns all user modules for SUPER_ADMIN", async () => {
      prisma.user.findUnique.mockResolvedValueOnce(superAdminUser);
      prisma.userModule.findMany.mockResolvedValueOnce([
        { id: "um-1", module: "CAMPAIGNS", userId: "user-1", createdAt: new Date() },
        { id: "um-2", module: "AD_SLOTS", userId: "user-1", createdAt: new Date() },
      ]);

      const req = new Request("http://localhost/api/admin/user-modules", {
        headers: { Authorization: `Bearer ${superAdminToken}` },
      });
      const res = await userModulesRoute.GET(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(2);
    });

    test("POST bulk updates user modules when userId and uppercase enum modules are provided", async () => {
      prisma.user.findUnique.mockResolvedValueOnce(superAdminUser);
      prisma.userModule.upsert.mockResolvedValue({ id: "um-1" });

      const req = new Request("http://localhost/api/admin/user-modules", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${superAdminToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: "target-user-1",
          modules: [
            { module: "CAMPAIGNS", enabled: true },
            { module: "AD_SLOTS", enabled: false },
          ],
        }),
      });

      const res = await userModulesRoute.POST(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(prisma.userModule.upsert).toHaveBeenCalledWith({
        where: { userId_module: { userId: "target-user-1", module: "CAMPAIGNS" } },
        create: { userId: "target-user-1", module: "CAMPAIGNS", grantedBy: "superadmin-123" },
        update: { grantedBy: "superadmin-123" },
      });
    });
  });

  describe("2. Single User Module Upsert (/api/admin/users/[id]/modules)", () => {
    test("POST includes mandatory grantedBy field in Prisma upsert create block", async () => {
      prisma.user.findUnique.mockResolvedValueOnce(superAdminUser);
      prisma.userModule.upsert.mockResolvedValueOnce({ id: "um-3", userId: "u-456", module: "WALLET", grantedBy: "superadmin-123" });

      const req = new Request("http://localhost/api/admin/users/u-456/modules", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${superAdminToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ module: "WALLET" }),
      });

      const params = Promise.resolve({ id: "u-456" });
      const res = await userModuleSingleRoute.POST(req, { params });
      expect(res.status).toBe(200);
      expect(prisma.userModule.upsert).toHaveBeenCalledWith({
        where: { userId_module: { userId: "u-456", module: "WALLET" } },
        create: { userId: "u-456", module: "WALLET", grantedBy: "superadmin-123" },
        update: { grantedBy: "superadmin-123" },
      });
    });
  });

  describe("3. AI Settings Route (/api/admin/ai-settings)", () => {
    test("GET returns providers and modules list", async () => {
      prisma.user.findUnique.mockResolvedValueOnce(superAdminUser);
      prisma.setting.findMany.mockResolvedValueOnce([
        { key: "geminiApiKey", value: "AIzaSyTestKey12345", category: "ai" },
      ]);

      const req = new Request("http://localhost/api/admin/ai-settings", {
        headers: { Authorization: `Bearer ${superAdminToken}` },
      });
      const res = await aiSettingsRoute.GET(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.providers).toBeDefined();
      expect(data.hasActiveKey).toBe(true);
    });

    test("PUT updates AI provider key", async () => {
      prisma.user.findUnique.mockResolvedValueOnce(superAdminUser);
      prisma.setting.upsert.mockResolvedValueOnce({ id: "set-1" });

      const req = new Request("http://localhost/api/admin/ai-settings", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${superAdminToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          providerKey: "geminiApiKey",
          apiKey: "AIzaSyNewValidKey9999",
        }),
      });

      const res = await aiSettingsRoute.PUT(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.success).toBe(true);
    });
  });

  describe("4. ModuleToggleSystem & NoCodeAdminStudio UI Components", () => {
    test("ModuleToggleSystem loads module state and triggers save with userId and valid enums", async () => {
      apiFetch.mockImplementation((url, opts) => {
        if (url === "/api/users/me") return Promise.resolve({ id: "superadmin-123", role: "SUPER_ADMIN" });
        if (url === "/api/admin/user-modules") {
          if (opts?.method === "POST") return Promise.resolve({ success: true });
          return Promise.resolve([
            { id: "um-1", module: "CAMPAIGNS", userId: "superadmin-123" },
          ]);
        }
        return Promise.resolve({});
      });

      render(<ModuleToggleSystem />);

      await waitFor(() => {
        expect(screen.getByText("Modul Yönetimi")).toBeInTheDocument();
      });

      const saveBtn = screen.getByRole("button", { name: /Saxla/i });
      fireEvent.click(saveBtn);

      await waitFor(() => {
        expect(apiFetch).toHaveBeenCalledWith(
          "/api/admin/user-modules",
          expect.objectContaining({
            method: "POST",
            body: expect.stringContaining('"userId":"superadmin-123"'),
          })
        );
      });
    });

    test("NoCodeAdminStudio renders icon components and supports settings save", async () => {
      apiFetch.mockImplementation((url, opts) => {
        if (url === "/api/admin/studio") {
          if (opts?.method === "POST") return Promise.resolve({ config: { siteName: "FermerMarket Test" } });
          return Promise.resolve({ config: { siteName: "FermerMarket", currency: "AZN" } });
        }
        return Promise.resolve({});
      });

      render(<NoCodeAdminStudio />);

      await waitFor(() => {
        expect(screen.getByText("No-Code Admin Studio")).toBeInTheDocument();
        expect(screen.getAllByText("Ümumi ayarlar")[0]).toBeInTheDocument();
      });

      const saveBtn = screen.getByRole("button", { name: /Yadda saxla/i });
      fireEvent.click(saveBtn);

      await waitFor(() => {
        expect(apiFetch).toHaveBeenCalledWith(
          "/api/admin/studio",
          expect.objectContaining({ method: "POST" })
        );
      });
    });
  });
});
