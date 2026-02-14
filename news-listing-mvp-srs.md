# News Listing System - MVP Software Requirements Specification (SRS)

## 1. Project Overview

### 1.1 Purpose

A lightweight news listing application that allows administrators to publish news articles and users to browse them filtered by date.

### 1.2 Scope

- Public landing page with news listing and date filtering
- Admin panel for content management
- Secure authentication for admin users
- Cloud storage integration for media files

---

## 2. System Architecture

### 2.1 Why Next.js Full-Stack Approach?

**Advantages:**

1. **Unified Codebase:** Single repository for frontend and backend
2. **Type Safety:** End-to-end TypeScript from client to API routes
3. **Developer Experience:** Hot reload, fast refresh, integrated tooling
4. **Performance:** Built-in optimizations (image optimization, code splitting, SSR/SSG)
5. **Deployment:** Zero-config deployment on Vercel
6. **SEO Friendly:** Server-side rendering for better search engine indexing
7. **Reduced Complexity:** No CORS issues, shared utilities and types
8. **Cost Effective:** Single deployment, no separate backend server costs

### 2.2 Technology Stack

**Full-Stack Framework:**

- **Primary Option:** Next.js 16+ (App Router)
  - React-based with built-in API routes
  - Server Components for optimized performance
  - Static generation & Server-side rendering
  - File-based routing
  - Built-in image optimization

**Frontend (Client-Side):**

- **UI Components:** React (Next.js) or Svelte (SvelteKit)
- **Styling:** Tailwind CSS (JIT mode)
- **Date Picker:** react-day-picker (Next.js)
- **Form Management:** React Hook Form (Next.js)
- **Rich Text Editor:** Tiptap or Lexical chose one which is free.

**Backend (Server-Side):**

- **API Routes:** Built-in API routes from Next.js/SvelteKit
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Authentication:** Supabase Auth + NextAuth.js
- **Storage:** Supabase Storage
- **Validation:** Zod

**Deployment:**

- **Platform:** Vercel
- **Database:** Supabase managed PostgreSQL
- **Edge Functions:** For performance-critical operations

### 2.3 Project Structure (Next.js App Router)

```
news-listing-app/
├── app/
│   ├── (public)/
│   │   ├── page.tsx                 # Landing page
│   │   ├── news/[slug]/page.tsx     # News detail page
│   │   └── layout.tsx               # Public layout
│   ├── admin/
│   │   ├── layout.tsx               # Admin layout with auth check
│   │   ├── page.tsx                 # Admin dashboard
│   │   ├── news/
│   │   │   ├── page.tsx             # News list
│   │   │   ├── create/page.tsx      # Create news
│   │   │   └── [id]/edit/page.tsx   # Edit news
│   │   ├── sources/
│   │   │   ├── page.tsx             # Source list
│   │   │   ├── create/page.tsx      # Create source
│   │   │   └── [id]/edit/page.tsx   # Edit source
│   │   └── login/page.tsx           # Admin login
│   ├── api/
│   │   ├── news/
│   │   │   ├── route.ts             # GET all news (public)
│   │   │   └── [slug]/route.ts      # GET single news (public)
│   │   ├── sources/
│   │   │   └── route.ts             # GET all sources (public)
│   │   ├── admin/
│   │   │   ├── news/
│   │   │   │   ├── route.ts         # POST/GET news (admin)
│   │   │   │   └── [id]/route.ts    # PUT/DELETE news (admin)
│   │   │   ├── sources/
│   │   │   │   ├── route.ts         # POST/GET sources (admin)
│   │   │   │   └── [id]/route.ts    # PUT/DELETE sources (admin)
│   │   │   └── upload/route.ts      # POST upload images
│   │   └── auth/
│   │       └── [...nextauth]/route.ts # NextAuth API routes
│   └── layout.tsx                    # Root layout
├── components/
│   ├── ui/                           # Reusable UI components
│   ├── news/
│   │   ├── NewsCard.tsx
│   │   ├── NewsFilter.tsx
│   │   └── NewsList.tsx
│   ├── admin/
│   │   ├── NewsForm.tsx
│   │   ├── SourceForm.tsx
│   │   └── AdminNav.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
├── lib/
│   ├── prisma.ts                     # Prisma client singleton
│   ├── supabase.ts                   # Supabase client
│   ├── auth.ts                       # Auth utilities
│   └── utils.ts                      # Helper functions
├── prisma/
│   ├── schema.prisma                 # Database schema
│   └── migrations/                   # Database migrations
├── public/
│   └── images/                       # Static images
├── styles/
│   └── globals.css                   # Global styles
├── types/
│   └── index.ts                      # TypeScript types
├── middleware.ts                     # Route protection
├── .env.local                        # Environment variables
├── next.config.js                    # Next.js configuration
├── tailwind.config.js                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies
```

### 2.4 Key Dependencies (package.json)

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "@prisma/client": "^5.18.0",
    "@supabase/supabase-js": "^2.45.0",
    "next-auth": "^4.24.0",
    "react-hook-form": "^7.52.0",
    "zod": "^3.23.0",
    "@hookform/resolvers": "^3.9.0",
    "date-fns": "^3.6.0",
    "react-day-picker": "^8.10.0",
    "@tiptap/react": "^2.5.0",
    "@tiptap/starter-kit": "^2.5.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.4.0"
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "@types/node": "^20.14.0",
    "@types/react": "^18.3.0",
    "prisma": "^5.18.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "eslint": "^8.57.0",
    "eslint-config-next": "^14.2.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/jest-dom": "^6.4.0",
    "jest": "^29.7.0",
    "@playwright/test": "^1.45.0"
  }
}
```

---

## 3. Functional Requirements

### 3.1 Public Landing Page

#### 3.1.1 News Listing

- Display all published news articles in reverse chronological order (newest first)
- Each news card shows:
  - Title
  - Short description (max 150 characters)
  - Thumbnail image
  - Published date
  - Source name and logo (if available)
  - "Read More" button/link

#### 3.1.2 Date Filtering

- **Calendar Filter:**
  - Interactive calendar widget
  - Click on date to filter news published on that date
  - Visual indicators for dates with available news
- **Date Range Filter:**
  - Start date and end date selectors
  - Filter news within the selected range
- **Quick Filters:**
  - Today
  - Last 7 days
  - Last 30 days
  - Custom range
  - Filter by source (multi-select dropdown)

#### 3.1.3 UI/UX Requirements

- Responsive design (mobile, tablet, desktop)
- Loading states during data fetch
- Empty state when no news found
- Pagination or infinite scroll (10-20 items per page)
- Clean, modern, accessible design

---

### 3.2 Admin Panel

#### 3.2.1 Authentication

- **Login Page:**
  - Email/password authentication via NextAuth + Supabase
  - Built-in CSRF protection
  - "Remember me" option
  - Password recovery flow
- **Session Management:**
  - Server-side session management with NextAuth
  - HTTP-only cookies for security
  - Session expires after 30 days (configurable)
  - Auto-redirect to login for protected routes via middleware
- **Route Protection:**
  - Middleware-based protection for `/admin/*` routes
  - Server-side session checks in API routes
  - Client-side session provider for UI states

#### 3.2.2 News Management

**Create News:**

- Form fields:
  - Title (required, max 200 characters)
  - Published Date (required, datetime picker)
  - Source (optional, dropdown select from available sources)
  - News Link (optional, URL validation)
  - Short Description (required, max 150 characters)
  - Full Content (optional, rich text editor)
  - Thumbnail Image (required, upload to Supabase Storage)
  - Additional Images (optional, multiple upload)
  - Tags/Categories (optional, multi-select)
  - Status (Draft/Published)
- Validation:
  - Required field validation
  - URL format validation
  - Image size limit (max 5MB per image)
  - Supported formats: JPG, PNG, WebP

**Edit News:**

- Load existing news data into form
- Update any field
- Preview changes before saving
- Image replacement option

**Delete News:**

- Confirmation modal before deletion
- Soft delete option (mark as archived)
- Cascade delete associated images from storage

**List All News:**

- Tabular view with columns: Title, Date, Source, Status, Actions
- Search by title
- Filter by status (Draft/Published)
- Filter by source
- Sort by date, title
- Bulk actions (delete, publish, unpublish)

#### 3.2.3 Source Management

**Create Source:**

- Form fields:
  - Name (required, max 100 characters, unique)
  - Website URL (optional, URL validation)
  - Logo (optional, upload to Supabase Storage)
  - Description (optional, max 300 characters)
  - Active Status (toggle, default: active)

**Edit Source:**

- Update name, website, logo, or description
- Toggle active/inactive status
- Logo replacement option

**Delete Source:**

- Confirmation modal before deletion
- Option to reassign news to another source or set as null
- Cannot delete source if it has associated news (must reassign first)

**List All Sources:**

- Card/table view with: Logo, Name, Website, News Count, Status
- Filter by active/inactive
- Search by name
- Sort by name, news count

---

## 4. Database Schema (Prisma)

```prisma
// schema.prisma

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Admin {
  id        String   @id @default(uuid())
  email     String   @unique
  supabaseId String  @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  news      News[]
}

model News {
  id              String   @id @default(uuid())
  title           String
  slug            String   @unique
  publishedDate   DateTime
  newsLink        String?
  shortDescription String
  fullContent     String?  @db.Text
  thumbnailUrl    String
  status          Status   @default(DRAFT)
  views           Int      @default(0)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  authorId        String
  author          Admin    @relation(fields: [authorId], references: [id])
  sourceId        String?
  source          Source?  @relation(fields: [sourceId], references: [id])
  images          NewsImage[]
  tags            NewsTag[]

  @@index([publishedDate])
  @@index([status])
  @@index([slug])
  @@index([sourceId])
}

model NewsImage {
  id        String   @id @default(uuid())
  url       String
  caption   String?
  newsId    String
  news      News     @relation(fields: [newsId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
}

model Source {
  id          String   @id @default(uuid())
  name        String   @unique
  slug        String   @unique
  website     String?
  logoUrl     String?
  description String?
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  news        News[]

  @@index([slug])
  @@index([isActive])
}

model Tag {
  id        String   @id @default(uuid())
  name      String   @unique
  slug      String   @unique
  news      NewsTag[]
}

model NewsTag {
  newsId    String
  tagId     String
  news      News     @relation(fields: [newsId], references: [id], onDelete: Cascade)
  tag       Tag      @relation(fields: [tagId], references: [id], onDelete: Cascade)

  @@id([newsId, tagId])
}

enum Status {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

---

## 5. API Routes (Next.js)

### 5.1 Public Routes

```
GET /api/news
Query params:
  - page (number)
  - limit (number)
  - startDate (ISO string)
  - endDate (ISO string)
  - tag (string)
  - source (string, source slug)
Response: { news: News[], total: number, page: number }

GET /api/news/[slug]
Response: News object with full content and source details

GET /api/sources
Response: Source[] (only active sources)
```

### 5.2 Protected Admin Routes (Requires Authentication)

```
GET /api/admin/news
Query params: search, status, page, limit, source
Response: { news: News[], total: number }

POST /api/admin/news
Body: { title, publishedDate, sourceId?, newsLink?, shortDescription, fullContent?, thumbnailUrl, images?, tags?, status }
Response: Created News object

PUT /api/admin/news/[id]
Body: News update data
Response: Updated News object

DELETE /api/admin/news/[id]
Response: { success: true }

GET /api/admin/sources
Query params: search, isActive
Response: { sources: Source[], total: number }

POST /api/admin/sources
Body: { name, website?, logoUrl?, description?, isActive }
Response: Created Source object

PUT /api/admin/sources/[id]
Body: Source update data
Response: Updated Source object

DELETE /api/admin/sources/[id]
Response: { success: true }

POST /api/admin/upload
Body: FormData with file
Response: { url: string, path: string }
```

### 5.3 Authentication Routes (NextAuth)

```
POST /api/auth/signin
Body: { email, password }
Response: Session object

POST /api/auth/signout
Response: { success: true }

GET /api/auth/session
Response: Current session or null
```

---

## 6. Supabase Configuration

### 6.1 Authentication Setup

- Enable email/password authentication
- Configure email templates for password recovery
- Integrate with NextAuth as authentication provider
- Set up Row Level Security (RLS) policies for admin table

### 6.2 Storage Setup

- Create buckets:
  - `news-images` (for news thumbnails and additional images)
  - `source-logos` (for news source logos)
- Configure bucket policies:
  - Public read access for published images
  - Authenticated write access for admin users
- Image optimization settings:
  - Auto-resize on upload
  - WebP conversion
  - Quality: 80%
  - Source logos: max 200x200px

### 6.3 Middleware Configuration (Next.js)

```typescript
// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token }) => !!token,
  },
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
```

---

## 7. Non-Functional Requirements

### 7.1 Performance

- **Core Web Vitals:**
  - LCP (Largest Contentful Paint) < 2.5s
  - FID (First Input Delay) < 100ms
  - CLS (Cumulative Layout Shift) < 0.1
- **Optimizations:**
  - Next.js Image component for automatic optimization
  - Static generation for public pages when possible
  - Server components for data-heavy pages
  - Dynamic imports for admin components
  - Route prefetching
  - Edge caching via Vercel CDN
- **Bundle Size:**
  - Initial page load < 150KB (gzipped)
  - Code splitting by route
  - Tree shaking unused code
- **Database:**
  - Query response time < 100ms
  - Connection pooling via Prisma
  - Indexed queries on frequently accessed fields

### 7.2 Security

- **Transport Security:**
  - HTTPS only (enforced by Vercel)
  - HSTS headers
  - Secure cookies (httpOnly, sameSite, secure flags)
- **Authentication & Authorization:**
  - NextAuth session management
  - CSRF protection (built-in with NextAuth)
  - Server-side session validation
  - Middleware-based route protection
- **Data Protection:**
  - Input sanitization on all forms
  - SQL injection prevention (Prisma parameterized queries)
  - XSS prevention (React automatic escaping)
  - Zod schema validation on API routes
- **API Security:**
  - Rate limiting (via Vercel or middleware)
  - CORS configuration
  - Request size limits
  - File upload validation (type, size)
- **Content Security:**
  - Content Security Policy (CSP) headers
  - Secure headers via next.config.js
  - Image sanitization before upload

### 7.3 Scalability

- Database indexing on frequently queried fields
- CDN for static assets
- Connection pooling for database
- Pagination to handle large datasets

### 7.4 Accessibility

- WCAG 2.1 Level AA compliance
- Semantic HTML
- Keyboard navigation
- Screen reader support
- Alt text for all images

---

## 8. Deployment & DevOps

### 8.1 Environment Variables (.env.local)

```bash
# Database
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...  # For Prisma migrations

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-here

# Node Environment
NODE_ENV=production
```

### 8.2 Deployment Strategy

- **Platform:** Vercel (zero-config deployment for Next.js)
- **Database:** Supabase managed PostgreSQL
- **CI/CD Pipeline:**
  1. Push to GitHub triggers build
  2. Run linting and type checks
  3. Run Prisma migrations
  4. Build Next.js application
  5. Deploy to Vercel edge network
  6. Automatic preview deployments for PRs

### 8.3 Build Configuration

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ["your-supabase-project.supabase.co"],
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    serverActions: true,
  },
};
```

---

## 9. Testing Requirements

### 9.1 Frontend Testing

- **Component Tests:** Jest + React Testing Library
- **E2E Tests:** Playwright
  - User flows: Browse news, filter by date, view details
  - Admin flows: Login, create/edit/delete news and sources
- **Accessibility:** axe-core integration

### 9.2 API Testing

- **API Route Tests:** Jest + node-mocks-http
- **Database Integration:** Test database with Prisma
- **Authentication Tests:** NextAuth session mocking

### 9.3 Test Coverage

- Minimum 70% code coverage
- Critical paths: 100% coverage
- API routes: 90% coverage

### 9.4 Test Commands

```bash
npm run test           # Run all tests
npm run test:watch     # Watch mode
npm run test:e2e       # E2E tests
npm run test:coverage  # Coverage report
```

---

## 10. Future Enhancements (Out of Scope for MVP)

- Multi-language support
- Advanced search with full-text indexing
- Social sharing features
- Newsletter subscription
- Comments section
- Analytics dashboard
- RSS feed
- Mobile app (React Native)
- SEO optimization with meta tags
- Author management (multiple admins with roles)
- Source credibility ratings
- Source-based RSS feeds
- Automated news aggregation from sources
- Source verification badges

---

## 11. Timeline Estimate

- **Week 1:** Project setup, database schema, Prisma configuration, Supabase setup
- **Week 2:** NextAuth integration, admin authentication, middleware protection
- **Week 3:** Admin panel UI (news & source CRUD with forms)
- **Week 4:** Public pages (landing, news detail), filtering components
- **Week 5:** Image upload, optimization, testing, bug fixes
- **Week 6:** Deployment, performance optimization, UAT

**Total: 6 weeks for MVP**

### Development Phases

1. **Setup & Infrastructure** (Week 1)
   - Initialize Next.js project with TypeScript
   - Configure Prisma with PostgreSQL
   - Set up Supabase authentication and storage
   - Create database schema and migrations

2. **Authentication & Security** (Week 2)
   - Implement NextAuth with Supabase provider
   - Create admin login page
   - Set up middleware for route protection
   - Configure session management

3. **Admin Features** (Week 3)
   - Build admin dashboard layout
   - Create news management (CRUD operations)
   - Create source management (CRUD operations)
   - Implement rich text editor for content

4. **Public Features** (Week 4)
   - Build landing page with news listing
   - Implement date filtering (calendar & range)
   - Create news detail page
   - Add source filtering

5. **Polish & Testing** (Week 5)
   - Supabase Storage integration for images
   - Image upload and optimization
   - Write tests (unit, integration, E2E)
   - Bug fixes and refinements

6. **Deployment & Launch** (Week 6)
   - Deploy to Vercel
   - Run production migrations
   - Performance testing and optimization
   - User acceptance testing
   - Documentation

---

## 12. Success Metrics

- Admin can create/edit/delete news in < 2 minutes
- Users can find news by date in < 3 clicks
- Page loads in < 2 seconds on 3G connection
- Zero critical security vulnerabilities
- 99% uptime

---

## Document Version

- **Version:** 1.0
- **Date:** February 14, 2026
- **Status:** Draft for Review
