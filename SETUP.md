# 🚀 Imovelo — Guia de Configuração Completo

## Pré-requisitos

- **Node.js** 18+ e npm 9+
- Conta em [neon.tech](https://neon.tech) (gratuita)
- Conta Azure com Storage Account configurada (ver passo 5)

---

## 1. Instalar dependências

```bash
cd imovelo
npm install
```

---

## 2. Configurar a base de dados (Neon PostgreSQL)

### 2.1 Criar projecto no Neon

1. Acesse [neon.tech](https://neon.tech) e crie uma conta gratuita
2. Clique em **"New Project"**
3. Dê um nome: `imovelo`
4. Escolha a região mais próxima (ex: `eu-west-2` para Europa)
5. Copie a **connection string** que aparece:
   ```
   postgresql://user:pass@ep-xxx.eu-west-2.aws.neon.tech/neondb?sslmode=require
   ```

### 2.2 Configurar variáveis de ambiente

```bash
cp .env.local .env.local
```

Edite `.env.local`:
```env
DATABASE_URL="postgresql://user:pass@ep-xxx.eu-west-2.aws.neon.tech/neondb?sslmode=require"
AUTH_SECRET="gere com: openssl rand -hex 32"
AUTH_URL="http://localhost:3000"
```

### 2.3 Aplicar o schema à base de dados

```bash
npm run db:push
```

Isto cria todas as tabelas automaticamente no Neon.

### 2.4 Popular com dados de demonstração

```bash
npm run db:seed
```

Cria 5 utilizadores e 8 imóveis de exemplo.

---

## 3. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000)

---

## 4. Contas de demonstração

| Papel | Email | Password |
|-------|-------|----------|
| 👑 Admin | admin@imovelo.ao | password123 |
| 🏠 Proprietário 1 | joao@imovelo.ao | password123 |
| 🏠 Proprietária 2 | ana@imovelo.ao | password123 |
| 👤 Inquilino 1 | miguel@imovelo.ao | password123 |
| 👤 Inquilina 2 | sofia@imovelo.ao | password123 |

---

## 5. Configurações opcionais

## 5. Configurar o Azure Blob Storage (upload de imagens)

As credenciais já estão pré-configuradas no `.env.local`. Apenas precisa de garantir que o container existe:

1. Acesse o [Azure Portal](https://portal.azure.com)
2. Abra a Storage Account `storagerealestateapp3000`
3. Vá a **Containers** e crie um container chamado `imoveis`
4. Defina o nível de acesso como **Blob** (leitura pública anónima para blobs)

As imagens são então carregadas automaticamente em `https://storagerealestateapp3000.blob.core.windows.net/imoveis/properties/{userId}/{timestamp}-{filename}`

As variáveis de ambiente já estão configuradas:


> ⚠️ **Segurança**: Em produção, rotacione a chave de acesso no Azure Portal e nunca a exponha publicamente. Use variáveis de ambiente seguras no Vercel/servidor.

---

## 6. Deploy em produção (Vercel)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configurar variáveis de ambiente
vercel env add DATABASE_URL
vercel env add AUTH_SECRET
vercel env add AUTH_URL  # https://seu-dominio.vercel.app
```

---

## 7. Base de dados — Comandos úteis

```bash
# Ver e editar dados visualmente
npm run db:studio

# Recriar schema (APAGA todos os dados)
npx drizzle-kit push --force

# Gerar ficheiros SQL de migração
npx drizzle-kit generate

# Resetar e re-seed
npx drizzle-kit push --force && npm run db:seed
```

---

## 8. Estrutura de pastas resumida

```
src/
├── app/
│   ├── api/              ← 15 rotas de API (Edge Runtime)
│   ├── (public)/         ← Páginas públicas (imóveis, detalhe)
│   ├── (auth)/           ← Login, registo
│   ├── (dashboard)/      ← Dashboard Owner/Tenant/Admin
│   ├── map/              ← Mapa full-screen
│   └── layout.tsx        ← Root layout
├── components/
│   ├── ui/               ← Shadcn UI components
│   ├── layout/           ← Navbar, HomeClient
│   ├── properties/       ← Cards, filtros, detalhe, galeria
│   ├── map/              ← Leaflet maps
│   ├── dashboard/        ← Painéis Owner/Tenant/Admin
│   └── shared/           ← Pagination, Skeleton, etc.
├── hooks/                ← React Query hooks
├── i18n/                 ← Traduções PT/EN
├── lib/
│   ├── db/               ← Schema Drizzle + conexão Neon
│   ├── auth.ts           ← NextAuth v5
│   ├── api.ts            ← Cliente API tipado
│   └── utils.ts          ← Utilitários
└── types/                ← TypeScript types
```

---

## 9. Funcionalidades implementadas

| Funcionalidade | Estado |
|---|---|
| Listagem de imóveis paginada (8/página) | ✅ |
| Vista grelha / lista / mapa | ✅ |
| Pesquisa avançada (localização, tipo, preço, quartos) | ✅ |
| Detalhe com galeria de fotos | ✅ |
| Mapa interactivo (Leaflet + OpenStreetMap) | ✅ |
| Locais próximos num raio de 5km (Overpass API) | ✅ |
| Multi-idioma PT/EN | ✅ |
| Registo e login (email + Google) | ✅ |
| Sistema de papéis (admin/owner/tenant) | ✅ |
| Favoritos (apenas inquilinos) | ✅ |
| Sistema de reservas com aprovação | ✅ |
| Dashboard proprietário + gráficos | ✅ |
| Dashboard inquilino (reservas + favoritos) | ✅ |
| Dashboard admin (utilizadores + imóveis + reservas) | ✅ |
| Formulário multi-step para publicar imóvel | ✅ |
| Editar / desactivar / eliminar imóvel | ✅ |
| Estatísticas (visualizações, reservas, receita) | ✅ |
| Protecção de rotas por papel (middleware) | ✅ |
| Modo escuro (dark theme) | ✅ |
| Responsivo (mobile-first) | ✅ |
