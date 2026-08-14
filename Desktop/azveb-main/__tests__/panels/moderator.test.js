import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { prisma } from "@/lib/prisma";
import { signAccessToken } from "@/lib/auth";
import * as productSingleRoute from "@/app/api/products/[id]/route";
import ModeratorPanel from "@/components/dashboard/ModeratorPanel";
import { apiFetch } from "@/lib/apiClient";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn().mockResolvedValue({ id: "seller-5", email: "seller@fermer.az" }),
    },
    product: {
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    productImage: {
      deleteMany: jest.fn(),
      createMany: jest.fn(),
    },
    orderItem: {
      deleteMany: jest.fn(),
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
}));

describe("Moderator Panel Test Suite", () => {
  const moderatorToken = signAccessToken({
    id: "mod-123",
    role: "MODERATOR",
    email: "mod@fermer.az",
  });

  const moderatorUser = {
    id: "mod-123",
    role: "MODERATOR",
    email: "mod@fermer.az",
    status: "ACTIVE",
    isBanned: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("1. Moderator API Product Review Action (/api/products/[id])", () => {
    test("PATCH approves product status to ACTIVE", async () => {
      prisma.user.findUnique.mockResolvedValueOnce(moderatorUser);
      prisma.product.findFirst.mockResolvedValueOnce({
        id: "prod-100",
        titleAz: "Alma Suyu",
        status: "PENDING_REVIEW",
        sellerId: "seller-5",
      });
      prisma.product.update.mockResolvedValueOnce({
        id: "prod-100",
        titleAz: "Alma Suyu",
        status: "ACTIVE",
      });

      const req = new Request("http://localhost/api/products/prod-100", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${moderatorToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "ACTIVE" }),
      });

      const params = Promise.resolve({ id: "prod-100" });
      const res = await productSingleRoute.PATCH(req, { params });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.product.status).toBe("ACTIVE");
    });

    test("PATCH rejects product with rejectionReason recorded", async () => {
      prisma.user.findUnique.mockResolvedValueOnce(moderatorUser);
      prisma.product.findFirst.mockResolvedValueOnce({
        id: "prod-101",
        titleAz: "Qeyri-qanuni Dərman",
        status: "PENDING_REVIEW",
        sellerId: "seller-5",
      });
      prisma.product.update.mockResolvedValueOnce({
        id: "prod-101",
        titleAz: "Qeyri-qanuni Dərman",
        status: "REJECTED",
        rejectionReason: "Sənədlər əskikdir",
      });

      const req = new Request("http://localhost/api/products/prod-101", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${moderatorToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "REJECTED",
          rejectionReason: "Sənədlər əskikdir",
        }),
      });

      const params = Promise.resolve({ id: "prod-101" });
      const res = await productSingleRoute.PATCH(req, { params });
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.product.status).toBe("REJECTED");
      expect(prisma.product.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: "REJECTED",
            rejectionReason: "Sənədlər əskikdir",
          }),
        })
      );
    });
  });

  describe("2. ModeratorPanel UI Component", () => {
    test("fetches pending products with pageSize=50 parameter", async () => {
      apiFetch.mockResolvedValueOnce({
        products: [
          {
            id: "prod-200",
            titleAz: "Qızıl Əhmədi Alması",
            price: 2.5,
            stock: 100,
            status: "PENDING_REVIEW",
            createdAt: new Date().toISOString(),
          },
        ],
      });

      render(<ModeratorPanel />);

      await waitFor(() => {
        expect(screen.getByText("Moderator Paneli")).toBeInTheDocument();
        expect(screen.getByText("Qızıl Əhmədi Alması")).toBeInTheDocument();
      });

      expect(apiFetch).toHaveBeenCalledWith("/api/products?status=PENDING_REVIEW&pageSize=50");
    });

    test("transmits rejectionReason payload when moderator rejects a product", async () => {
      apiFetch.mockImplementation((url, opts) => {
        if (url === "/api/products?status=PENDING_REVIEW&pageSize=50") {
          return Promise.resolve({
            products: [
              {
                id: "prod-300",
                titleAz: "Köhnə Gübrə",
                price: 15,
                stock: 20,
                status: "PENDING_REVIEW",
                createdAt: new Date().toISOString(),
              },
            ],
          });
        }
        if (url === "/api/products/prod-300" && opts?.method === "PATCH") {
          return Promise.resolve({ product: { id: "prod-300", status: "REJECTED" } });
        }
        return Promise.resolve({});
      });

      render(<ModeratorPanel />);

      await waitFor(() => {
        expect(screen.getByText("Köhnə Gübrə")).toBeInTheDocument();
      });

      const reasonInput = screen.getByPlaceholderText(/Rədd səbəbi/i);
      fireEvent.change(reasonInput, { target: { value: "İstifadə müddəti bitib" } });

      const rejectBtn = screen.getByRole("button", { name: /Rədd et/i });
      fireEvent.click(rejectBtn);

      await waitFor(() => {
        expect(apiFetch).toHaveBeenCalledWith(
          "/api/products/prod-300",
          expect.objectContaining({
            method: "PATCH",
            body: JSON.stringify({
              status: "REJECTED",
              rejectionReason: "İstifadə müddəti bitib",
            }),
          })
        );
      });
    });
  });
});
