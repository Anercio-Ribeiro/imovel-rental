// ============================================================
// src/lib/db/schema.ts — Drizzle ORM schema for Neon PostgreSQL
// ============================================================
import {
  pgTable,
  text,
  varchar,
  integer,
  decimal,
  boolean,
  timestamp,
  uuid,
  pgEnum,
  real,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ── Enums ────────────────────────────────────────────────────
export const userRoleEnum = pgEnum("user_role", ["tenant", "owner", "admin"]);
export const propertyTypeEnum = pgEnum("property_type", [
  "apartment", "house", "villa", "studio", "penthouse", "land", "commercial",
]);
export const propertyStatusEnum = pgEnum("property_status", [
  "active", "inactive", "pending", "sold", "rented",
]);
export const listingTypeEnum = pgEnum("listing_type", ["rent", "sale"]);
export const bookingStatusEnum = pgEnum("booking_status", [
  "pending", "approved", "rejected", "cancelled", "completed",
]);
export const priceUnitEnum = pgEnum("price_unit", ["month", "total"]);

// ── Users ────────────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password"),
  phone: varchar("phone", { length: 30 }),
  avatar: text("avatar"),
  role: userRoleEnum("role").notNull().default("tenant"),
  emailVerified: timestamp("email_verified"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// ── Properties ───────────────────────────────────────────────
export const properties = pgTable(
  "properties",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // i18n fields
    title: varchar("title", { length: 255 }).notNull(),
    titleEn: varchar("title_en", { length: 255 }).notNull(),
    description: text("description").notNull(),
    descriptionEn: text("description_en").notNull(),
    // Classification
    type: propertyTypeEnum("type").notNull(),
    listingType: listingTypeEnum("listing_type").notNull(),
    status: propertyStatusEnum("status").notNull().default("active"),
    // Pricing
    price: decimal("price", { precision: 12, scale: 2 }).notNull(),
    priceUnit: priceUnitEnum("price_unit").notNull().default("month"),
    // Details
    area: real("area").notNull(),
    bedrooms: integer("bedrooms").notNull().default(0),
    bathrooms: integer("bathrooms").notNull().default(0),
    parkingSpots: integer("parking_spots").notNull().default(0),
    floor: integer("floor"),
    totalFloors: integer("total_floors"),
    yearBuilt: integer("year_built"),
    // Amenities
    furnished: boolean("furnished").notNull().default(false),
    petFriendly: boolean("pet_friendly").notNull().default(false),
    hasPool: boolean("has_pool").notNull().default(false),
    hasGarden: boolean("has_garden").notNull().default(false),
    hasGym: boolean("has_gym").notNull().default(false),
    hasSecurity: boolean("has_security").notNull().default(false),
    hasElevator: boolean("has_elevator").notNull().default(false),
    // Images (array stored as JSON text)
    images: text("images").notNull().default("[]"),
    // Location
    address: varchar("address", { length: 500 }).notNull(),
    city: varchar("city", { length: 100 }).notNull(),
    province: varchar("province", { length: 100 }).notNull(),
    country: varchar("country", { length: 100 }).notNull().default("Angola"),
    zipCode: varchar("zip_code", { length: 20 }),
    latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(),
    longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(),
    // Owner
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    // Stats
    viewCount: integer("view_count").notNull().default(0),
    bookingCount: integer("booking_count").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    cityIdx: index("properties_city_idx").on(t.city),
    ownerIdx: index("properties_owner_idx").on(t.ownerId),
    statusIdx: index("properties_status_idx").on(t.status),
    typeIdx: index("properties_type_idx").on(t.type),
    listingTypeIdx: index("properties_listing_type_idx").on(t.listingType),
  })
);

// ── Bookings ─────────────────────────────────────────────────
export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    propertyId: uuid("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    tenantId: uuid("tenant_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    ownerId: uuid("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date").notNull(),
    status: bookingStatusEnum("status").notNull().default("pending"),
    message: text("message"),
    totalPrice: decimal("total_price", { precision: 12, scale: 2 }).notNull(),
    nights: integer("nights"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (t) => ({
    propertyIdx: index("bookings_property_idx").on(t.propertyId),
    tenantIdx: index("bookings_tenant_idx").on(t.tenantId),
    ownerIdx: index("bookings_owner_idx").on(t.ownerId),
    statusIdx: index("bookings_status_idx").on(t.status),
  })
);

// ── Favorites ────────────────────────────────────────────────
export const favorites = pgTable(
  "favorites",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    propertyId: uuid("property_id")
      .notNull()
      .references(() => properties.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (t) => ({
    userPropertyIdx: index("favorites_user_property_idx").on(t.userId, t.propertyId),
  })
);

// ── Property Views ────────────────────────────────────────────
export const propertyViews = pgTable("property_views", {
  id: uuid("id").primaryKey().defaultRandom(),
  propertyId: uuid("property_id")
    .notNull()
    .references(() => properties.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  viewedAt: timestamp("viewed_at").notNull().defaultNow(),
});

// ── Relations ─────────────────────────────────────────────────
export const usersRelations = relations(users, ({ many }) => ({
  properties: many(properties),
  bookingsAsTenant: many(bookings, { relationName: "tenantBookings" }),
  bookingsAsOwner: many(bookings, { relationName: "ownerBookings" }),
  favorites: many(favorites),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  owner: one(users, { fields: [properties.ownerId], references: [users.id] }),
  bookings: many(bookings),
  favorites: many(favorites),
  views: many(propertyViews),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  property: one(properties, { fields: [bookings.propertyId], references: [properties.id] }),
  tenant: one(users, { fields: [bookings.tenantId], references: [users.id], relationName: "tenantBookings" }),
  owner: one(users, { fields: [bookings.ownerId], references: [users.id], relationName: "ownerBookings" }),
}));

export const favoritesRelations = relations(favorites, ({ one }) => ({
  user: one(users, { fields: [favorites.userId], references: [users.id] }),
  property: one(properties, { fields: [favorites.propertyId], references: [properties.id] }),
}));

// ── Hero Slides (dynamic hero content for homepage) ──────────
export const heroSlides = pgTable("hero_slides", {
  id:          uuid("id").primaryKey().defaultRandom(),
  title:       text("title"),
  subtitle:    text("subtitle"),
  imageUrl:    text("image_url"),
  buttonLabel: text("button_label"),
  buttonUrl:   text("button_url"),
  // Which elements are visible
  showTitle:   boolean("show_title").notNull().default(true),
  showSubtitle:boolean("show_subtitle").notNull().default(true),
  showButton:  boolean("show_button").notNull().default(true),
  showImage:   boolean("show_image").notNull().default(true),
  active:      boolean("active").notNull().default(true),
  order:       integer("order").notNull().default(0),
  createdAt:   timestamp("created_at").notNull().defaultNow(),
  updatedAt:   timestamp("updated_at").notNull().defaultNow(),
});
export type HeroSlide = typeof heroSlides.$inferSelect;

// ── Type exports ──────────────────────────────────────────────
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Property = typeof properties.$inferSelect;
export type NewProperty = typeof properties.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type Favorite = typeof favorites.$inferSelect;
