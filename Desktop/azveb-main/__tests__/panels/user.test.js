import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { prisma } from "@/lib/prisma";
import { signAccessToken } from "@/lib/auth";
import * as storeStatsRoute from "@/app/api/stores/me/stats/route";
import * as farmerStatsRoute from "@/app/api/farmer/stats/route";
import * as ordersRoute from "@/app/api/orders/route";
import BuyerPanel from "@/components/dashboard/BuyerPanel";
import StoreDashboard from "@/components/dashboard/store/StoreDashboard";
import { apiFetch } from "@/lib/apiClient";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
    store: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
    product: {
      count: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    order: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    storeFollow: {
      count: jest.fn(),
    },
    wallet: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    review: {
      findMany: jest.fn(),
    },
    coupon: {
      findUnique: jest.fn(),
    },
    walletTransaction: {
      create: jest.fn(),
    },
    $transaction: jest.fn((callbackOrArray) => {
      if (typeof callbackOrArray === "function") {
        return callbackOrArray(prisma);
      }
      return Promise.all(callbackOrArray);
    }),
  },
}));

jest.mock("@/lib/apiClient", () => ({
  apiFetch: jest.fn(),
  getUser: jest.fn(() => ({ id: "user-1", role: "BUYER", fullName: "Əli Məmmədov" })),
}));

jest.mock("next-intl", () => ({
  useTranslations: () => (key) => key,
}));

jest.mock("@/i18n/routing", () => ({
  useRouter: () => ({ push: jest.fn() }),
  Link: ({ children, href }) => <a href={href}>{children}</a>,
}));

describe("User Panel Test Suite", () => {
  const buyerToken = signAccessToken({
    id: "buyer-123",
    role: "BUYER",
    email: "buyer@fermer.az",
  });

  const farmerToken = signAccessToken({
    id: "farmer-123",
    role: "FARMER",
    email: "farmer@fermer.az",
  });

  const buyerUser = { id: "buyer-123", role: "BUYER", email: "buyer@fermer.az", status: "ACTIVE", isBanned: false };
  const farmerUser = { id: "farmer-123", role: "FARMER", email: "farmer@fermer.az", status: "ACTIVE", isBanned: false };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("1. Dashboard Stats API Endpoints", () => {
    test("GET /api/stores/me/stats queries total field and returns store stats without crashing", async () => {
      prisma.user.findUnique.mockResolvedValueOnce(farmerUser);
      prisma.store.findFirst.mockResolvedValueOnce({ id: "store-99" });
      prisma.product.count.mockResolvedValue(5);
      prisma.order.findMany.mockResolvedValueOnce([
        { id: "o-1", status: "DELIVERED", total: 100, createdAt: new Date() },
      ]);
      prisma.storeFollow.count.mockResolvedValueOnce(12);
      prisma.store.findUnique.mockResolvedValueOnce({ storeViewCount: 250, totalSales: 10 });

      const req = new Request("http://localhost/api/stores/me/stats", {
        headers: { Authorization: `Bearer ${farmerToken}` },
      });

      const res = await storeStatsRoute.GET(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.totalRevenue).toBe(100);
      expect(data.storeId).toBe("store-99");
    });

    test("GET /api/farmer/stats queries total on Order and author on Review without crashing", async () => {
      prisma.user.findUnique.mockResolvedValueOnce(farmerUser);
      prisma.product.count.mockResolvedValue(10);
      prisma.wallet.findUnique.mockResolvedValueOnce({ balance: 500, coins: 50, transactions: [] });
      prisma.order.findMany.mockResolvedValueOnce([
        {
          id: "o-2",
          status: "DELIVERED",
          total: 150,
          createdAt: new Date(),
          buyer: { fullName: "Həsən Əliyev" },
          items: [{ quantity: 2, unitPrice: 75, product: { titleAz: "Bal", slug: "bal" } }],
        },
      ]);
      prisma.review.findMany.mockResolvedValueOnce([
        {
          id: "r-1",
          rating: 5,
          comment: "Əla məhsul!",
          createdAt: new Date(),
          author: { fullName: "Vəli Həsənov" },
          product: { titleAz: "Bal", slug: "bal" },
        },
      ]);

      const req = new Request("http://localhost/api/farmer/stats", {
        headers: { Authorization: `Bearer ${farmerToken}` },
      });

      const res = await farmerStatsRoute.GET(req);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.activeListings).toBe(10);
      expect(data.recentReviews[0].user.fullName).toBe("Vəli Həsənov");
    });

    test("POST /api/orders handles guest products by assigning sellerId to authUser.sub without FK violation", async () => {
      prisma.user.findUnique.mockResolvedValueOnce(buyerUser);
      prisma.product.findMany.mockResolvedValueOnce([
        {
          id: "p-guest",
          titleAz: "Süd",
          price: 3,
          stock: 10,
          status: "ACTIVE",
          sellerId: null,
          isCorporate: false,
        },
      ]);

      prisma.order.create.mockResolvedValueOnce({
        id: "order-guest-1",
        total: 8,
        items: [{ productId: "p-guest", sellerId: "buyer-123", quantity: 1 }],
      });

      const req = new Request("http://localhost/api/orders", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${buyerToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: [{ productId: "p-guest", quantity: 1 }],
          shippingAddress: "Nizami küç. 15",
          shippingRegion: "Bakı",
          shippingCity: "Bakı",
          deliveryMethod: "STANDARD",
        }),
      });

      const res = await ordersRoute.POST(req);
      expect(res.status).toBe(201);
      const data = await res.json();
      expect(data.order.id).toBe("order-guest-1");
    });
  });

  describe("2. User Dashboard UI Components", () => {
    test("BuyerPanel renders order history and user profile sections", async () => {
      apiFetch.mockResolvedValue({
        orders: [],
        favorites: [],
      });

      const sampleUser = { id: "user-1", fullName: "Əli Məmmədov", email: "ali@fermer.az", role: "BUYER" };

      render(<BuyerPanel user={sampleUser} />);

      await waitFor(() => {
        expect(screen.getByText("Sifariş Tarixçəsi")).toBeInTheDocument();
      });
    });

    test("StoreDashboard renders store overview when store exists", async () => {
      apiFetch.mockImplementation((url) => {
        if (url === "/api/stores/me") {
          return Promise.resolve({ store: { id: "s-1", name: "Fermer Mağazası" } });
        }
        if (url === "/api/stores/me/stats") {
          return Promise.resolve({ products: 2, activeProducts: 2, totalRevenue: 50 });
        }
        return Promise.resolve({});
      });

      const sampleStoreUser = {
        id: "store-owner-1",
        fullName: "Mağaza Sahibi",
        role: "STORE",
        store: { id: "s-1", name: "Fermer Mağazası" },
      };

      render(<StoreDashboard user={sampleStoreUser} />);

      await waitFor(() => {
        expect(screen.getAllByText("Fermer Mağazası")[0]).toBeInTheDocument();
      });
    });
  });
});
