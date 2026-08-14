import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { prisma } from "@/lib/prisma";
import { signAccessToken } from "@/lib/auth";
import * as siteTextsRoute from "@/app/api/admin/site-texts/route";
import SiteTextsManager from "@/components/dashboard/SiteTextsManager";
import BrandsManager from "@/components/dashboard/BrandsManager";
import { apiFetch } from "@/lib/apiClient";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    siteText: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    brand: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    category: {
      findMany: jest.fn(),
    },
    store: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
    adSlot: {
      findMany: jest.fn(),
    },
    product: {
      findMany: jest.fn(),
      count: jest.fn(),
    },
  },
}));

jest.mock("@/lib/apiClient", () => ({
  apiFetch: jest.fn(),
}));

describe("Admin Panel Test Suite", () => {
  const adminToken = signAccessToken({
    id: "admin-123",
    role: "ADMIN",
    email: "admin@fermer.az",
  });

  const adminUser = {
    id: "admin-123",
    role: "ADMIN",
    email: "admin@fermer.az",
    status: "ACTIVE",
    isBanned: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("1. Site Texts API Route (/api/admin/site-texts)", () => {
    test("GET returns site texts excluding protected keys", async () => {
      prisma.user.findUnique.mockResolvedValueOnce(adminUser);
      prisma.siteText.findMany.mockResolvedValueOnce([
        { id: "st-1", key: "home.hero.title", group: "homepage", valueAz: "Xoş gəldiniz" },
        { id: "st-2", key: "footer.copyright", group: "footer", valueAz: "Copyright" },
      ]);

      const req = new Request("http://localhost/api/admin/site-texts", {
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      const res = await siteTextsRoute.GET(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.siteTexts).toHaveLength(1);
      expect(data.siteTexts[0].key).toBe("home.hero.title");
    });

    test("POST creates new site text", async () => {
      prisma.user.findUnique.mockResolvedValueOnce(adminUser);
      prisma.siteText.findUnique.mockResolvedValueOnce(null);
      prisma.siteText.create.mockResolvedValueOnce({
        id: "st-3",
        key: "test.key",
        group: "general",
        valueAz: "Test Dəyər",
      });

      const req = new Request("http://localhost/api/admin/site-texts", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          key: "test.key",
          group: "general",
          valueAz: "Test Dəyər",
        }),
      });

      const res = await siteTextsRoute.POST(req);
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.success).toBe(true);
      expect(data.siteText.key).toBe("test.key");
    });
  });

  describe("2. SiteTextsManager & BrandsManager UI Components", () => {
    test("SiteTextsManager renders <ToastContainer /> JSX properly and displays texts", async () => {
      apiFetch.mockResolvedValue({
        siteTexts: [{ id: "st-10", key: "nav.home", group: "navigation", valueAz: "Ana Səhifə" }],
      });

      render(<SiteTextsManager />);

      await waitFor(() => {
        expect(screen.getByText("Məzmun İdarəsi")).toBeInTheDocument();
        expect(screen.getByText("nav.home")).toBeInTheDocument();
      });
    });

    test("BrandsManager handles error and success toasts via toast(msg, type) without throwing error", async () => {
      apiFetch.mockImplementation((url, opts) => {
        if (url === "/api/brands?withProducts=true&all=true") {
          return Promise.resolve({
            brands: [{ id: "b-1", name: "Syngenta", country: "İsveçrə", isActive: true }],
          });
        }
        if (url === "/api/brands" && opts?.method === "POST") {
          return Promise.resolve({ brand: { id: "b-2", name: "Bayer" } });
        }
        return Promise.resolve({});
      });

      render(<BrandsManager />);

      await waitFor(() => {
        expect(screen.getByText("Brendlər")).toBeInTheDocument();
        expect(screen.getByText("Syngenta")).toBeInTheDocument();
      });

      const addBtn = screen.getByRole("button", { name: /Yeni Brend/i });
      fireEvent.click(addBtn);

      const nameInput = screen.getByPlaceholderText("Məs: Syngenta");
      fireEvent.change(nameInput, { target: { value: "Bayer" } });

      const submitBtn = screen.getByRole("button", { name: /Əlavə Et/i });
      fireEvent.click(submitBtn);

      await waitFor(() => {
        expect(apiFetch).toHaveBeenCalledWith("/api/brands", expect.objectContaining({ method: "POST" }));
      });
    });
  });
});
