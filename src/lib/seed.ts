// ============================================================
// src/lib/seed.ts
// Run: npm run db:seed
//
// IMAGES: The `images` field stores JSON arrays of URLs.
// For production, upload photos to Azure Blob Storage and
// replace the Unsplash URLs below with your Azure URLs, e.g.:
// "https://storagerealestateapp3000.blob.core.windows.net/imoveis/properties/foto1.jpg"
// ============================================================

import { db } from "./db";
import { users, properties, bookings, favorites } from "./db/schema";
import bcrypt from "bcryptjs";

// ── Free demo images (Unsplash — replace with Azure URLs) ───
const IMGS = {
  apt1: [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80",
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&q=80",
  ],
  apt2: [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
  ],
  villa: [
    "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  ],
  house: [
    "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80",
    "https://images.unsplash.com/photo-1572120360610-d971b9d7767c?w=800&q=80",
  ],
  studio: [
    "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800&q=80",
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800&q=80",
  ],
  penthouse: [
    "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=800&q=80",
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    "https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=800&q=80",
  ],
  land: [
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80",
  ],
  commercial: [
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
    "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80",
  ],
};

async function seed() {
  console.log("🌱 Seeding database…\n");

  // ── 1. Users ────────────────────────────────────────────
  console.log("👤 Creating users…");
  const pw = await bcrypt.hash("password123", 12);

  const [admin, owner1, owner2, tenant1, tenant2] = await db
    .insert(users)
    .values([
      { name: "Admin Sistema",    email: "admin@imovelo.ao",  password: pw, role: "admin",  phone: "+244 923 000 000" },
      { name: "João Carvalho",    email: "joao@imovelo.ao",   password: pw, role: "owner",  phone: "+244 923 111 222" },
      { name: "Ana Fernandes",    email: "ana@imovelo.ao",    password: pw, role: "owner",  phone: "+244 923 333 444" },
      { name: "Miguel Santos",    email: "miguel@imovelo.ao", password: pw, role: "tenant", phone: "+244 923 555 666" },
      { name: "Sofia Andrade",    email: "sofia@imovelo.ao",  password: pw, role: "tenant", phone: "+244 923 777 888" },
      { name: "Carlos Mendes",    email: "carlos@imovelo.ao", password: pw, role: "owner",  phone: "+244 923 999 000" },
      { name: "Maria Conceição",  email: "maria@imovelo.ao",  password: pw, role: "tenant", phone: "+244 923 444 555" },
    ])
    .returning();

  console.log(`  ✅ ${7} users created`);

  // ── 2. Properties ────────────────────────────────────────
  console.log("🏠 Creating properties…");

  const propertyData = [
    // ── Luanda – Miramar ──
    {
      title: "Apartamento T3 Luxo em Miramar",
      titleEn: "Luxury 3-Bedroom Apartment in Miramar",
      description: "Luxuoso apartamento T3 com vista panorâmica para a Baía de Luanda. Acabamentos de alta qualidade, cozinha equipada, 2 varandas e ar condicionado em todos os quartos. Condomínio fechado com segurança 24h, piscina e ginásio.",
      descriptionEn: "Luxurious 3-bedroom apartment with panoramic views of Luanda Bay. High-quality finishes, fully equipped kitchen, 2 balconies and air conditioning in all rooms. Gated condominium with 24h security, pool and gym.",
      type: "apartment" as const, listingType: "rent" as const,
      price: "350000", priceUnit: "month" as const,
      area: 145, bedrooms: 3, bathrooms: 2, parkingSpots: 2,
      floor: 8, totalFloors: 14, yearBuilt: 2019,
      furnished: true, petFriendly: false, hasPool: true, hasGarden: false, hasGym: true, hasSecurity: true, hasElevator: true,
      images: JSON.stringify(IMGS.apt1),
      address: "Av. 4 de Fevereiro, 45", city: "Luanda", province: "Luanda", country: "Angola",
      latitude: "-8.8150", longitude: "13.2300",
      ownerId: owner1.id, viewCount: 247, bookingCount: 12,
    },
    // ── Luanda – Talatona ──
    {
      title: "Villa T5 com Piscina no Talatona",
      titleEn: "5-Bedroom Villa with Pool in Talatona",
      description: "Deslumbrante villa T5 no exclusivo bairro do Talatona. 5 suítes, cozinha gourmet, escritório, garagem para 4 carros, jardim tropical e piscina privada. Sistema de segurança com câmeras e porteiro 24h.",
      descriptionEn: "Stunning 5-bedroom villa in the exclusive Talatona neighborhood. 5 en-suite bedrooms, gourmet kitchen, office, 4-car garage, tropical garden and private pool.",
      type: "villa" as const, listingType: "sale" as const,
      price: "95000000", priceUnit: "total" as const,
      area: 480, bedrooms: 5, bathrooms: 5, parkingSpots: 4,
      yearBuilt: 2021,
      furnished: true, petFriendly: true, hasPool: true, hasGarden: true, hasGym: false, hasSecurity: true, hasElevator: false,
      images: JSON.stringify(IMGS.villa),
      address: "Talatona, Rua B, 22", city: "Luanda", province: "Luanda", country: "Angola",
      latitude: "-8.9000", longitude: "13.1800",
      ownerId: owner1.id, viewCount: 189, bookingCount: 5,
    },
    // ── Luanda – Centro ──
    {
      title: "Studio Moderno no Centro de Luanda",
      titleEn: "Modern Studio in Luanda City Center",
      description: "Estúdio completamente renovado e equipado no coração de Luanda. Ideal para profissionais e executivos. Próximo dos principais bancos, restaurantes e transportes públicos. Internet de fibra incluída.",
      descriptionEn: "Fully renovated and equipped studio in the heart of Luanda. Ideal for professionals and executives. Close to main banks, restaurants and public transport.",
      type: "studio" as const, listingType: "rent" as const,
      price: "95000", priceUnit: "month" as const,
      area: 48, bedrooms: 0, bathrooms: 1, parkingSpots: 0,
      floor: 3, totalFloors: 10, yearBuilt: 2018,
      furnished: true, petFriendly: false, hasPool: false, hasGarden: false, hasGym: false, hasSecurity: true, hasElevator: true,
      images: JSON.stringify(IMGS.studio),
      address: "Av. Comandante Valodia, 128", city: "Luanda", province: "Luanda", country: "Angola",
      latitude: "-8.8150", longitude: "13.2350",
      ownerId: owner2.id, viewCount: 312, bookingCount: 28,
    },
    // ── Luanda – Kilamba ──
    {
      title: "Apartamento T2 no Kilamba",
      titleEn: "2-Bedroom Apartment in Kilamba",
      description: "Apartamento T2 bem conservado na Nova Cidade do Kilamba. Condomínio com segurança, parques infantis e áreas verdes. Excelente oportunidade para jovens famílias. Próximo de escolas e supermercados.",
      descriptionEn: "Well-maintained 2-bedroom apartment in Nova Cidade do Kilamba. Condominium with security, playgrounds and green areas.",
      type: "apartment" as const, listingType: "rent" as const,
      price: "180000", priceUnit: "month" as const,
      area: 98, bedrooms: 2, bathrooms: 2, parkingSpots: 1,
      floor: 5, totalFloors: 8, yearBuilt: 2015,
      furnished: false, petFriendly: true, hasPool: false, hasGarden: true, hasGym: false, hasSecurity: true, hasElevator: true,
      images: JSON.stringify(IMGS.apt2),
      address: "Kilamba, Sector A, Bloco 12", city: "Luanda", province: "Luanda", country: "Angola",
      latitude: "-8.8700", longitude: "13.2100",
      ownerId: owner2.id, viewCount: 156, bookingCount: 9,
    },
    // ── Luanda – Miramar Penthouse ──
    {
      title: "Penthouse T4 com Vista Mar",
      titleEn: "4-Bedroom Penthouse with Sea View",
      description: "Exclusiva penthouse com 4 suítes e terraço privado de 80m² com vista 360° para a Baía de Luanda. Acabamentos de luxo, cozinha com ilha, piscina privada no terraço e 3 lugares de estacionamento cobertos.",
      descriptionEn: "Exclusive penthouse with 4 suites and 80m² private terrace with 360° view of Luanda Bay. Luxury finishes, island kitchen, private rooftop pool.",
      type: "penthouse" as const, listingType: "rent" as const,
      price: "1200000", priceUnit: "month" as const,
      area: 320, bedrooms: 4, bathrooms: 4, parkingSpots: 3,
      floor: 22, totalFloors: 22, yearBuilt: 2022,
      furnished: true, petFriendly: false, hasPool: true, hasGarden: false, hasGym: true, hasSecurity: true, hasElevator: true,
      images: JSON.stringify(IMGS.penthouse),
      address: "Av. 4 de Fevereiro, 7", city: "Luanda", province: "Luanda", country: "Angola",
      latitude: "-8.8600", longitude: "13.2500",
      ownerId: owner2.id, viewCount: 421, bookingCount: 8,
    },
    // ── Luanda – Maianga T1 ──
    {
      title: "Apartamento T1 no Maianga",
      titleEn: "1-Bedroom Apartment in Maianga",
      description: "Apartamento T1 moderno e funcional no bairro do Maianga. Totalmente renovado com materiais de qualidade. Ideal para solteiros ou casal. Bem servido de transportes e comércio.",
      descriptionEn: "Modern and functional 1-bedroom apartment in Maianga. Completely renovated with quality materials. Ideal for singles or couples.",
      type: "apartment" as const, listingType: "rent" as const,
      price: "120000", priceUnit: "month" as const,
      area: 65, bedrooms: 1, bathrooms: 1, parkingSpots: 1,
      floor: 2, totalFloors: 6, yearBuilt: 2016,
      furnished: true, petFriendly: false, hasPool: false, hasGarden: false, hasGym: false, hasSecurity: false, hasElevator: false,
      images: JSON.stringify(IMGS.apt1),
      address: "R. Amilcar Cabral, 55", city: "Luanda", province: "Luanda", country: "Angola",
      latitude: "-8.8250", longitude: "13.2450",
      ownerId: owner1.id, viewCount: 203, bookingCount: 18,
    },
    // ── Luanda – Venda T4 ──
    {
      title: "Moradia T4 Independente no Talatona",
      titleEn: "4-Bedroom Detached House in Talatona",
      description: "Moradia independente T4 em condomínio fechado de luxo no Talatona. Dois andares, sala dupla, quintal com churrasqueira, garagem dupla e escritório. Acabamentos europeus, energia solar instalada.",
      descriptionEn: "4-bedroom detached house in a luxury gated condominium in Talatona. Two floors, double living room, barbecue yard, double garage and office.",
      type: "house" as const, listingType: "sale" as const,
      price: "45000000", priceUnit: "total" as const,
      area: 280, bedrooms: 4, bathrooms: 3, parkingSpots: 2,
      yearBuilt: 2020,
      furnished: false, petFriendly: true, hasPool: false, hasGarden: true, hasGym: false, hasSecurity: true, hasElevator: false,
      images: JSON.stringify(IMGS.house),
      address: "Talatona, Rua C, 8", city: "Luanda", province: "Luanda", country: "Angola",
      latitude: "-8.9100", longitude: "13.1900",
      ownerId: owner1.id, viewCount: 134, bookingCount: 4,
    },
    // ── Benguela ──
    {
      title: "Moradia T4 em Benguela",
      titleEn: "4-Bedroom House in Benguela",
      description: "Espaçosa moradia T4 em localização privilegiada em Benguela. Jardim amplo, garagem dupla e varanda panorâmica com vista para o mar. Próximo da praia e do centro comercial.",
      descriptionEn: "Spacious 4-bedroom house in prime location in Benguela. Large garden, double garage and panoramic balcony with sea view.",
      type: "house" as const, listingType: "sale" as const,
      price: "32000000", priceUnit: "total" as const,
      area: 280, bedrooms: 4, bathrooms: 3, parkingSpots: 2,
      yearBuilt: 2017,
      furnished: false, petFriendly: true, hasPool: false, hasGarden: true, hasGym: false, hasSecurity: false, hasElevator: false,
      images: JSON.stringify(IMGS.house),
      address: "Av. Norton de Matos, 89", city: "Benguela", province: "Benguela", country: "Angola",
      latitude: "-12.5767", longitude: "13.4080",
      ownerId: owner1.id, viewCount: 98, bookingCount: 3,
    },
    // ── Huambo ──
    {
      title: "Terreno Comercial em Huambo",
      titleEn: "Commercial Land in Huambo",
      description: "Terreno com 2000m² em zona comercial privilegiada de Huambo. Ideal para construção de empreendimento comercial, industrial ou residencial. Documentação em ordem, acesso à estrada principal.",
      descriptionEn: "2000m² plot in a prime commercial area of Huambo. Ideal for commercial, industrial or residential development. Full documentation, main road access.",
      type: "land" as const, listingType: "sale" as const,
      price: "15000000", priceUnit: "total" as const,
      area: 2000, bedrooms: 0, bathrooms: 0, parkingSpots: 0,
      furnished: false, petFriendly: false, hasPool: false, hasGarden: false, hasGym: false, hasSecurity: false, hasElevator: false,
      images: JSON.stringify(IMGS.land),
      address: "R. do Comércio, 34", city: "Huambo", province: "Huambo", country: "Angola",
      latitude: "-11.2027", longitude: "17.8739",
      ownerId: owner2.id, viewCount: 67, bookingCount: 2,
    },
    // ── Luanda – Espaço Comercial ──
    {
      title: "Espaço Comercial no Bairro Azul",
      titleEn: "Commercial Space in Bairro Azul",
      description: "Excelente espaço comercial de 350m² no Bairro Azul, zona de alto tráfego. Planta aberta, 3 casas de banho, armazém e 5 lugares de estacionamento privativos. Ideal para escritório, clínica ou loja.",
      descriptionEn: "Excellent 350m² commercial space in Bairro Azul, high-traffic area. Open plan, 3 bathrooms, storage and 5 private parking spaces.",
      type: "commercial" as const, listingType: "rent" as const,
      price: "450000", priceUnit: "month" as const,
      area: 350, bedrooms: 0, bathrooms: 3, parkingSpots: 5,
      floor: 1, totalFloors: 5, yearBuilt: 2014,
      furnished: false, petFriendly: false, hasPool: false, hasGarden: false, hasGym: false, hasSecurity: true, hasElevator: true,
      images: JSON.stringify(IMGS.commercial),
      address: "Bairro Azul, Rua Principal, 12", city: "Luanda", province: "Luanda", country: "Angola",
      latitude: "-8.8368", longitude: "13.2343",
      ownerId: owner2.id, viewCount: 89, bookingCount: 1,
    },
    // ── Luanda – Luanda Sul T3 ──
    {
      title: "Apartamento T3 em Luanda Sul",
      titleEn: "3-Bedroom Apartment in Luanda Sul",
      description: "Apartamento T3 em condomínio moderno em Luanda Sul. Piscina comunitária, playground para crianças e segurança 24h. Fácil acesso à via expressa e ao aeroporto internacional.",
      descriptionEn: "3-bedroom apartment in a modern condominium in Luanda Sul. Community pool, children's playground and 24h security.",
      type: "apartment" as const, listingType: "rent" as const,
      price: "250000", priceUnit: "month" as const,
      area: 120, bedrooms: 3, bathrooms: 2, parkingSpots: 1,
      floor: 4, totalFloors: 10, yearBuilt: 2018,
      furnished: false, petFriendly: false, hasPool: true, hasGarden: false, hasGym: false, hasSecurity: true, hasElevator: true,
      images: JSON.stringify(IMGS.apt2),
      address: "Luanda Sul, Bloco 5", city: "Luanda", province: "Luanda", country: "Angola",
      latitude: "-8.9200", longitude: "13.2000",
      ownerId: owner1.id, viewCount: 175, bookingCount: 6,
    },
    // ── Namibe ──
    {
      title: "Moradia T3 Frente ao Mar no Namibe",
      titleEn: "3-Bedroom Beachfront House in Namibe",
      description: "Encantadora moradia T3 a 50 metros da praia no Namibe. Jardim privado, terraço com churrasqueira e vista directa para o oceano. Ideal para férias ou residência permanente. Zona tranquila e segura.",
      descriptionEn: "Charming 3-bedroom house 50 meters from the beach in Namibe. Private garden, barbecue terrace and direct ocean view.",
      type: "house" as const, listingType: "sale" as const,
      price: "18000000", priceUnit: "total" as const,
      area: 160, bedrooms: 3, bathrooms: 2, parkingSpots: 2,
      yearBuilt: 2012,
      furnished: true, petFriendly: true, hasPool: false, hasGarden: true, hasGym: false, hasSecurity: false, hasElevator: false,
      images: JSON.stringify(IMGS.house),
      address: "Praia do Namibe, Lote 7", city: "Namibe", province: "Namibe", country: "Angola",
      latitude: "-15.1961", longitude: "12.1522",
      ownerId: owner2.id, viewCount: 142, bookingCount: 7,
    },
  ];

  const createdProperties = await db.insert(properties).values(
    propertyData.map(p => ({ ...p, status: "active" as const }))
  ).returning();

  console.log(`  ✅ ${createdProperties.length} properties created`);

  // ── 3. Bookings ──────────────────────────────────────────
  console.log("📅 Creating bookings…");

  await db.insert(bookings).values([
    {
      propertyId: createdProperties[0].id,
      tenantId: tenant1.id, ownerId: owner1.id,
      startDate: new Date("2025-02-01"), endDate: new Date("2025-02-28"),
      status: "approved", totalPrice: "350000", nights: 27,
      message: "Olá, tenho interesse no apartamento para o mês de Fevereiro. Sou profissional com contrato de trabalho.",
    },
    {
      propertyId: createdProperties[2].id,
      tenantId: tenant1.id, ownerId: owner2.id,
      startDate: new Date("2025-03-01"), endDate: new Date("2025-03-15"),
      status: "pending", totalPrice: "47500", nights: 15,
      message: "Interesse no estúdio por 2 semanas para uma missão de trabalho.",
    },
    {
      propertyId: createdProperties[0].id,
      tenantId: tenant2.id, ownerId: owner1.id,
      startDate: new Date("2025-01-15"), endDate: new Date("2025-01-31"),
      status: "completed", totalPrice: "185000", nights: 16,
    },
    {
      propertyId: createdProperties[3].id,
      tenantId: tenant2.id, ownerId: owner2.id,
      startDate: new Date("2025-04-01"), endDate: new Date("2025-04-30"),
      status: "pending", totalPrice: "180000", nights: 29,
      message: "Gostaria de arrendar para a minha família. Somos 4 pessoas.",
    },
    {
      propertyId: createdProperties[10].id,
      tenantId: tenant1.id, ownerId: owner1.id,
      startDate: new Date("2025-05-01"), endDate: new Date("2025-05-31"),
      status: "approved", totalPrice: "250000", nights: 30,
    },
  ]);

  console.log("  ✅ 5 bookings created");

  // ── 4. Favorites ─────────────────────────────────────────
  console.log("❤️  Creating favorites…");

  await db.insert(favorites).values([
    { userId: tenant1.id, propertyId: createdProperties[0].id },
    { userId: tenant1.id, propertyId: createdProperties[4].id },
    { userId: tenant1.id, propertyId: createdProperties[7].id },
    { userId: tenant2.id, propertyId: createdProperties[1].id },
    { userId: tenant2.id, propertyId: createdProperties[3].id },
    { userId: tenant2.id, propertyId: createdProperties[11].id },
  ]);

  console.log("  ✅ 6 favorites created");

  // ── Summary ──────────────────────────────────────────────
  console.log(`
╔══════════════════════════════════════════════╗
║  ✅  Seed concluído com sucesso!              ║
╠══════════════════════════════════════════════╣
║  👤  7 utilizadores                          ║
║  🏠  ${createdProperties.length} imóveis                        ║
║  📅  5 reservas                              ║
║  ❤️   6 favoritos                             ║
╠══════════════════════════════════════════════╣
║  Contas de demo:                             ║
║  admin@imovelo.ao   → admin     │ password123║
║  joao@imovelo.ao    → owner     │ password123║
║  ana@imovelo.ao     → owner     │ password123║
║  miguel@imovelo.ao  → tenant    │ password123║
║  sofia@imovelo.ao   → tenant    │ password123║
╚══════════════════════════════════════════════╝
  `);

  process.exit(0);
}

seed().catch((e) => {
  console.error("❌ Seed error:", e);
  process.exit(1);
});
