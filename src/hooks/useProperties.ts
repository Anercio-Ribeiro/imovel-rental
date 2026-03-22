"use client";
// ============================================================
// src/hooks/useProperties.ts — React Query hooks for properties
// ============================================================
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { propertiesApi, bookingsApi, favoritesApi, statsApi, adminApi } from "@/lib/api";
import type { PropertyFilters } from "@/types";

// ── Query Keys ────────────────────────────────────────────────
export const queryKeys = {
  properties: {
    all: ["properties"] as const,
    list: (filters: PropertyFilters) => ["properties", "list", filters] as const,
    detail: (id: string) => ["properties", "detail", id] as const,
    owner: (page: number) => ["properties", "owner", page] as const,
    nearby: (id: string) => ["properties", "nearby", id] as const,
  },
  bookings: {
    my: ["bookings", "my"] as const,
    owner: ["bookings", "owner"] as const,
  },
  favorites: {
    my: ["favorites", "my"] as const,
  },
  stats: {
    owner: ["stats", "owner"] as const,
    admin: ["stats", "admin"] as const,
  },
  admin: {
    users: (page: number) => ["admin", "users", page] as const,
    properties: (page: number) => ["admin", "properties", page] as const,
    bookings: (page: number) => ["admin", "bookings", page] as const,
  },
};

// ── Property Hooks ────────────────────────────────────────────
export function useProperties(filters: PropertyFilters = {}) {
  return useQuery({
    queryKey: queryKeys.properties.list(filters),
    queryFn: () => propertiesApi.list(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes
    placeholderData: (prev) => prev,
  });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: queryKeys.properties.detail(id),
    queryFn: () => propertiesApi.getById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useOwnerProperties(page = 1) {
  return useQuery({
    queryKey: queryKeys.properties.owner(page),
    queryFn: () => propertiesApi.getOwnerProperties(page),
    staleTime: 1000 * 60,
  });
}

export function useNearbyPlaces(propertyId: string) {
  return useQuery({
    queryKey: queryKeys.properties.nearby(propertyId),
    queryFn: () => propertiesApi.getNearby(propertyId),
    enabled: !!propertyId,
    staleTime: 1000 * 60 * 60, // 1 hour (nearby places don't change)
  });
}

export function useCreateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: propertiesApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.properties.all });
    },
  });
}

export function useUpdateProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Parameters<typeof propertiesApi.update>[1] }) =>
      propertiesApi.update(id, data),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.properties.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.properties.all });
    },
  });
}

export function useDeleteProperty() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: propertiesApi.delete,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.properties.all });
    },
  });
}

export function useTogglePropertyStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "active" | "inactive" }) =>
      propertiesApi.toggleStatus(id, status),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: queryKeys.properties.detail(id) });
      qc.invalidateQueries({ queryKey: queryKeys.properties.all });
    },
  });
}

// ── Booking Hooks ─────────────────────────────────────────────
export function useMyBookings() {
  return useQuery({
    queryKey: queryKeys.bookings.my,
    queryFn: bookingsApi.getMyBookings,
    staleTime: 1000 * 30,
  });
}

export function useOwnerBookings() {
  return useQuery({
    queryKey: queryKeys.bookings.owner,
    queryFn: bookingsApi.getOwnerBookings,
    staleTime: 1000 * 30,
  });
}

export function useCreateBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: bookingsApi.create,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.bookings.my });
    },
  });
}

export function useUpdateBookingStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "approved" | "rejected" | "cancelled" }) =>
      bookingsApi.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.bookings.owner });
      qc.invalidateQueries({ queryKey: queryKeys.bookings.my });
    },
  });
}

// ── Favorites Hooks ───────────────────────────────────────────
export function useMyFavorites() {
  return useQuery({
    queryKey: queryKeys.favorites.my,
    queryFn: favoritesApi.getMyFavorites,
    staleTime: 1000 * 60,
  });
}

export function useToggleFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: favoritesApi.toggle,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.favorites.my });
      // Also refresh property lists so isFavorited updates
      qc.invalidateQueries({ queryKey: queryKeys.properties.all });
    },
  });
}

export function useRemoveFavorite() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: favoritesApi.remove,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.favorites.my });
    },
  });
}

// ── Stats Hooks ───────────────────────────────────────────────
export function useOwnerStats() {
  return useQuery({
    queryKey: queryKeys.stats.owner,
    queryFn: statsApi.ownerStats,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: queryKeys.stats.admin,
    queryFn: statsApi.adminStats,
    staleTime: 1000 * 60 * 5,
  });
}

// ── Admin Hooks ───────────────────────────────────────────────
export function useAdminUsers(page = 1) {
  return useQuery({
    queryKey: queryKeys.admin.users(page),
    queryFn: () => adminApi.getUsers(page),
    staleTime: 1000 * 60,
  });
}

export function useAdminProperties(page = 1) {
  return useQuery({
    queryKey: queryKeys.admin.properties(page),
    queryFn: () => adminApi.getProperties(page),
    staleTime: 1000 * 60,
  });
}

export function useAdminBookings(page = 1) {
  return useQuery({
    queryKey: queryKeys.admin.bookings(page),
    queryFn: () => adminApi.getBookings(page),
    staleTime: 1000 * 60,
  });
}
