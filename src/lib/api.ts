// ============================================================
// src/lib/api.ts — Typed API client for React Query hooks
// ============================================================
import type {
  Property,
  PropertyFilters,
  PaginatedResponse,
  Booking,
  Favorite,
  OwnerStats,
  AdminStats,
  NearbyPlace,
} from "@/types";
import { buildQueryString } from "./utils";

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.message || "Request failed");
  }
  return res.json() as Promise<T>;
}

// ── Properties ────────────────────────────────────────────────
export const propertiesApi = {
  list: (filters: PropertyFilters = {}) =>
    fetchJSON<PaginatedResponse<Property>>(
      `/api/properties?${buildQueryString(filters as Record<string, unknown>)}`
    ),

  getById: (id: string) =>
    fetchJSON<Property>(`/api/properties/${id}`),

  create: (data: Partial<Property>) =>
    fetchJSON<Property>("/api/properties", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Property>) =>
    fetchJSON<Property>(`/api/properties/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    fetchJSON<{ success: boolean }>(`/api/properties/${id}`, {
      method: "DELETE",
    }),

  toggleStatus: (id: string, status: "active" | "inactive") =>
    fetchJSON<Property>(`/api/properties/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  getNearby: (id: string) =>
    fetchJSON<NearbyPlace[]>(`/api/properties/${id}/nearby`),

  getOwnerProperties: (page = 1) =>
    fetchJSON<PaginatedResponse<Property>>(
      `/api/properties/owner?page=${page}&pageSize=8`
    ),
};

// ── Bookings ──────────────────────────────────────────────────
export const bookingsApi = {
  create: (data: {
    propertyId: string;
    startDate: string;
    endDate: string;
    message?: string;
  }) =>
    fetchJSON<Booking>("/api/bookings", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getMyBookings: () => fetchJSON<Booking[]>("/api/bookings/my"),

  getOwnerBookings: () => fetchJSON<Booking[]>("/api/bookings/owner"),

  updateStatus: (id: string, status: "approved" | "rejected" | "cancelled") =>
    fetchJSON<Booking>(`/api/bookings/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};

// ── Favorites ─────────────────────────────────────────────────
export const favoritesApi = {
  getMyFavorites: () => fetchJSON<Favorite[]>("/api/favorites"),

  toggle: (propertyId: string) =>
    fetchJSON<{ favorited: boolean }>("/api/favorites", {
      method: "POST",
      body: JSON.stringify({ propertyId }),
    }),

  remove: (propertyId: string) =>
    fetchJSON<{ success: boolean }>(`/api/favorites/${propertyId}`, {
      method: "DELETE",
    }),
};

// ── Stats ─────────────────────────────────────────────────────
export const statsApi = {
  ownerStats: () => fetchJSON<OwnerStats>("/api/stats/owner"),
  adminStats: () => fetchJSON<AdminStats>("/api/stats/admin"),
};

// ── Admin ─────────────────────────────────────────────────────
export const adminApi = {
  getUsers: (page = 1) =>
    fetchJSON<PaginatedResponse<import("@/types").User>>(
      `/api/admin/users?page=${page}&pageSize=20`
    ),
  getProperties: (page = 1) =>
    fetchJSON<PaginatedResponse<Property>>(
      `/api/admin/properties?page=${page}&pageSize=20`
    ),
  getBookings: (page = 1) =>
    fetchJSON<PaginatedResponse<Booking>>(
      `/api/admin/bookings?page=${page}&pageSize=20`
    ),
  updateUser: (id: string, data: Partial<import("@/types").User>) =>
    fetchJSON<import("@/types").User>(`/api/admin/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
};

// ── Auth ──────────────────────────────────────────────────────
export const authApi = {
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    role: "tenant" | "owner";
  }) =>
    fetchJSON<{ success: boolean; message: string }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
