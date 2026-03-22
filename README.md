# 🏠 Imovelo — Plataforma de Imóveis

> Sistema completo de anúncios para venda e arrendamento de imóveis. Desenvolvido com Next.js 15, Shadcn, TanStack Query, Drizzle ORM e Neon PostgreSQL.

---

## ✨ Funcionalidades

### Público (sem login)
- Listagem de imóveis paginada (8 por página)
- Vista em grelha, lista e **mapa interactivo** (Leaflet + OpenStreetMap)
- **Pesquisa avançada** — localização, tipologia, preço, quartos
- Detalhe do imóvel com galeria de fotos, mapa, proprietário
- **Locais de interesse num raio de 5km** (escola, hospital, supermercado, praia, etc.)
- Multi-idioma: **Português** e **Inglês**

### Inquilino (tenant)
- Fazer pedidos de reserva com datas e mensagem
- Ver estado das reservas (pendente / aprovado / rejeitado / cancelado)
- Cancelar reserva própria
- Adicionar / remover imóveis dos **favoritos**
- Dashboard pessoal com estatísticas

### Proprietário (owner)
- Publicar, editar, activar/desactivar e eliminar imóveis
- Formulário multi-step com fotos, localização, comodidades
- Aprovar ou rejeitar pedidos de reserva
- **Dashboard com estatísticas**: visualizações, reservas, receita mensal
- Gráficos de barras e linhas por mês (Recharts)
- Lista de imóveis mais vistos e mais requisitados

### Administrador (admin)
- Painel completo com todas as reservas, utilizadores e imóveis
- Ver e gerir todos os utilizadores da plataforma
- Activar / desactivar / eliminar qualquer imóvel
- Aprovar ou rejeitar qualquer reserva

---

## 🛠️ Stack Tecnológico

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | Shadcn + Tailwind CSS |
| Auth | NextAuth v5 (credentials + Google) |
| Database | Neon PostgreSQL (serverless) |
| ORM | Drizzle ORM |
| Data fetching | TanStack React Query v5 |
| Mapas | Leaflet + React-Leaflet (OpenStreetMap, gratuito) |
| Locais próximos | Overpass API (OpenStreetMap, gratuito) |
| Gráficos | Recharts |
| Animações | Framer Motion |
| Toasts | Sonner |
| Imagens | Azure Blob Storage (`@azure/storage-blob`) |
| i18n | Context customizado (pt/en) |

---

## 🚀 Setup e Instalação

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.local .env.local
# Edite .env.local com as suas credenciais
```

Variáveis obrigatórias:
```env
DATABASE_URL="postgresql://..."   # Neon connection string
AUTH_SECRET="..."                 # openssl rand -hex 32
```

### 3. Criar e migrar a base de dados (Neon)

1. Crie uma conta em [neon.tech](https://neon.tech)
2. Crie um novo projecto e copie a connection string
3. Execute:

```bash
# Aplicar o schema à base de dados
npm run db:push

# Popular com dados de demonstração
npm run db:seed
```

### 4. Iniciar o servidor de desenvolvimento
```bash
npm run dev
```

Acesse: **http://localhost:3000**

---

## 👤 Contas de Demonstração

| Tipo | Email | Password |
|------|-------|----------|
| Admin | admin@imovelo.ao | password123 |
| Proprietário 1 | joao@imovelo.ao | password123 |
| Proprietário 2 | ana@imovelo.ao | password123 |
| Inquilino 1 | miguel@imovelo.ao | password123 |
| Inquilino 2 | sofia@imovelo.ao | password123 |

---

## 📁 Estrutura do Projecto

```
src/
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── [...nextauth]/route.ts    ← NextAuth handler
│   │   │   └── register/route.ts         ← Registo de utilizador
│   │   ├── properties/
│   │   │   ├── route.ts                  ← GET (lista+filtros) / POST (criar)
│   │   │   ├── [id]/route.ts             ← GET / PATCH / DELETE
│   │   │   ├── [id]/nearby/route.ts      ← Locais próximos (Overpass API)
│   │   │   └── owner/route.ts            ← Imóveis do proprietário
│   │   ├── bookings/
│   │   │   ├── route.ts                  ← POST criar reserva
│   │   │   ├── my/route.ts               ← GET reservas do inquilino
│   │   │   ├── owner/route.ts            ← GET reservas do proprietário
│   │   │   └── [id]/route.ts             ← PATCH estado da reserva
│   │   ├── favorites/
│   │   │   ├── route.ts                  ← GET / POST toggle favorito
│   │   │   └── [propertyId]/route.ts     ← DELETE remover favorito
│   │   ├── stats/
│   │   │   ├── owner/route.ts            ← Estatísticas do proprietário
│   │   │   └── admin/route.ts            ← Estatísticas globais
│   │   └── admin/
│   │       └── users/route.ts            ← Gestão de utilizadores
│   │
│   ├── (public)/
│   │   └── properties/
│   │       ├── page.tsx                  ← Lista de imóveis
│   │       └── [id]/page.tsx             ← Detalhe do imóvel
│   │
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   │
│   ├── (dashboard)/
│   │   └── dashboard/
│   │       ├── layout.tsx                ← Layout com sidebar
│   │       ├── page.tsx                  ← Redirect por role
│   │       ├── owner/
│   │       │   ├── properties/page.tsx   ← CRUD de imóveis
│   │       │   ├── add/page.tsx          ← Formulário multi-step
│   │       │   ├── edit/[id]/page.tsx    ← Editar imóvel
│   │       │   └── stats/page.tsx        ← Estatísticas + gráficos
│   │       ├── tenant/
│   │       │   ├── bookings/page.tsx     ← Reservas do inquilino
│   │       │   └── favorites/page.tsx    ← Favoritos
│   │       └── admin/
│   │           ├── users/page.tsx
│   │           ├── properties/page.tsx
│   │           └── bookings/page.tsx
│   │
│   ├── layout.tsx                        ← Root layout + fonts
│   ├── page.tsx                          ← Homepage (Server Component)
│   └── globals.css
│
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx                    ← Navbar responsiva com dropdown
│   │   └── HomeClient.tsx                ← Homepage client component
│   ├── properties/
│   │   ├── PropertyCard.tsx              ← Card de imóvel
│   │   ├── PropertyFilters.tsx           ← Barra de filtros avançados
│   │   ├── PropertyDetailClient.tsx      ← Detalhe completo
│   │   └── BookingModal.tsx              ← Modal de reserva
│   ├── map/
│   │   └── PropertyMap.tsx               ← Mapa Leaflet (SSR-safe)
│   ├── dashboard/
│   │   ├── DashboardSidebar.tsx
│   │   ├── OwnerDashboardOverview.tsx    ← Stats + gráficos + reservas
│   │   ├── TenantDashboardOverview.tsx
│   │   └── AdminDashboardOverview.tsx
│   └── shared/
│       ├── Providers.tsx                 ← QueryClient + Session + i18n
│       ├── Pagination.tsx
│       └── Skeleton.tsx
│
├── hooks/
│   └── useProperties.ts                  ← Todos os hooks React Query
│
├── i18n/
│   ├── pt.ts                             ← Traduções Português
│   ├── en.ts                             ← Traduções Inglês
│   └── index.ts                          ← Context + useI18n hook
│
├── lib/
│   ├── db/
│   │   ├── index.ts                      ← Conexão Neon + Drizzle
│   │   └── schema.ts                     ← Todas as tabelas e relações
│   ├── auth.ts                           ← NextAuth config
│   ├── api.ts                            ← Cliente API tipado
│   ├── utils.ts                          ← cn(), formatters, etc.
│   └── seed.ts                           ← Script de seed
│
├── middleware.ts                         ← Protecção de rotas + RBAC
└── types/index.ts                        ← Todos os tipos TypeScript
```

---

## 🗄️ Schema da Base de Dados

```
users           → id, name, email, password, phone, avatar, role
properties      → id, title, titleEn, description, descriptionEn, type,
                  listingType, status, price, area, bedrooms, bathrooms,
                  images (JSON), latitude, longitude, ownerId, viewCount, ...
bookings        → id, propertyId, tenantId, ownerId, startDate, endDate,
                  status, message, totalPrice, nights
favorites       → id, userId, propertyId
property_views  → id, propertyId, userId, viewedAt
```

---

## 🌐 Variáveis de Ambiente Completas

```env
# Base de dados (Neon)
DATABASE_URL="postgresql://user:pass@host.neon.tech/imovelo?sslmode=require"

# Auth (credentials only)
AUTH_SECRET="gere com: openssl rand -hex 32"
AUTH_URL="http://localhost:3000"

# Azure Blob Storage (upload de imagens)
AZURE_STORAGE_ACCOUNT_NAME=storagerealestateapp3000
AZURE_STORAGE_ACCOUNT_KEY=3DgwJszZa1jhXoLhYAQWSC95C9aycr8MR94ZYjrSZzBrFi4EyngOIC7BF6f9Ks01O4HXL6CbRRAg+AStYSXxrw==
AZURE_STORAGE_CONTAINER_NAME=imoveis

# App
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 📦 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run db:push      # Aplicar schema à Neon DB
npm run db:studio    # Abrir Drizzle Studio (GUI)
npm run db:seed      # Popular com dados de demo
```

---

## 🔒 Segurança e RBAC

| Acção | Sem login | Tenant | Owner | Admin |
|-------|-----------|--------|-------|-------|
| Ver imóveis | ✅ | ✅ | ✅ | ✅ |
| Ver detalhe | ✅ | ✅ | ✅ | ✅ |
| Favoritos | ❌ | ✅ | ❌ | ✅ |
| Fazer reserva | ❌ | ✅ | ❌ | ✅ |
| Publicar imóvel | ❌ | ❌ | ✅ | ✅ |
| Aprovar reserva | ❌ | ❌ | ✅ | ✅ |
| Painel admin | ❌ | ❌ | ❌ | ✅ |
