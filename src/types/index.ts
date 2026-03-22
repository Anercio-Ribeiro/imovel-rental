// ============================================================
// src/types/index.ts — All domain types
// ============================================================

export type Locale = "pt" | "en";

export type UserRole = "tenant" | "owner" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export type PropertyType = "apartment" | "house" | "villa" | "studio" | "penthouse" | "land" | "commercial";
export type PropertyStatus = "active" | "inactive" | "pending" | "sold" | "rented";
export type ListingType = "rent" | "sale";

export interface Property {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  type: PropertyType;
  listingType: ListingType;
  status: PropertyStatus;
  price: number;
  priceUnit: "month" | "total";
  area: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpots: number;
  floor?: number;
  totalFloors?: number;
  yearBuilt?: number;
  furnished: boolean;
  petFriendly: boolean;
  hasPool: boolean;
  hasGarden: boolean;
  hasGym: boolean;
  hasSecurity: boolean;
  hasElevator: boolean;
  images: string[];
  address: string;
  city: string;
  province: string;
  country: string;
  zipCode?: string;
  latitude: number;
  longitude: number;
  ownerId: string;
  owner?: User;
  isFavorited?: boolean;
  viewCount: number;
  bookingCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export type BookingStatus = "pending" | "approved" | "rejected" | "cancelled" | "completed";

export interface Booking {
  id: string;
  propertyId: string;
  property?: Property;
  tenantId: string;
  tenant?: User;
  ownerId: string;
  startDate: Date;
  endDate: Date;
  status: BookingStatus;
  message?: string;
  totalPrice: number;
  nights?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Favorite {
  id: string;
  userId: string;
  propertyId: string;
  property?: Property;
  createdAt: Date;
}

export interface NearbyPlace {
  id: string;
  name: string;
  type: NearbyPlaceType;
  distance: number; // in meters
  latitude: number;
  longitude: number;
  rating?: number;
}

export type NearbyPlaceType =
  | "school"
  | "hospital"
  | "supermarket"
  | "beach"
  | "restaurant"
  | "park"
  | "pharmacy"
  | "bank"
  | "transport"
  | "gym";

// API response shapes
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface PropertyFilters {
  search?: string;
  city?: string;
  type?: PropertyType;
  listingType?: ListingType;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnished?: boolean;
  petFriendly?: boolean;
  page?: number;
  pageSize?: number;
  sortBy?: "price_asc" | "price_desc" | "newest" | "most_viewed";
}

export interface OwnerStats {
  totalProperties: number;
  activeProperties: number;
  totalViews: number;
  totalBookings: number;
  pendingBookings: number;
  approvedBookings: number;
  monthlyRevenue: number;
  topProperties: Property[];
  viewsByMonth: { month: string; views: number }[];
  bookingsByMonth: { month: string; bookings: number }[];
}

export interface AdminStats {
  totalUsers: number;
  totalOwners: number;
  totalTenants: number;
  totalProperties: number;
  totalBookings: number;
  totalRevenue: number;
  newUsersThisMonth: number;
  newPropertiesThisMonth: number;
}
