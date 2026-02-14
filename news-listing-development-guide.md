# News Listing App - Step-by-Step Development Guide

## 📋 Overview
This guide breaks down the development of the News Listing Application into manageable steps with specific prompts for AI assistants or developers.

---

## 🗂️ Table of Contents
1. [Phase 1: Project Setup & Infrastructure](#phase-1-project-setup--infrastructure)
2. [Phase 2: Database & Prisma Setup](#phase-2-database--prisma-setup)
3. [Phase 3: Authentication System](#phase-3-authentication-system)
4. [Phase 4: Admin - News Management](#phase-4-admin---news-management)
5. [Phase 5: Admin - Source Management](#phase-5-admin---source-management)
6. [Phase 6: Public Landing Page](#phase-6-public-landing-page)
7. [Phase 7: Image Upload & Storage](#phase-7-image-upload--storage)
8. [Phase 8: Testing & Optimization](#phase-8-testing--optimization)
9. [Phase 9: Deployment](#phase-9-deployment)

---

## Phase 1: Project Setup & Infrastructure

### Step 1.1: Initialize Next.js Project

**Prompt:**
```
Create a new Next.js 14 project with TypeScript, Tailwind CSS, and App Router. 
Configure it with the following requirements:
- TypeScript strict mode enabled
- ESLint with Next.js recommended config
- Prettier for code formatting
- App Router structure
- Tailwind CSS with custom configuration
- Path aliases (@/ for root imports)

Include the initial folder structure:
- app/ (for pages and API routes)
- components/ (for React components)
- lib/ (for utilities)
- types/ (for TypeScript types)
- styles/ (for global styles)

Provide the complete package.json with all necessary dependencies.
```

**Expected Deliverables:**
- `package.json` with dependencies
- `next.config.js` configuration
- `tsconfig.json` with path aliases
- `tailwind.config.js` with custom theme
- `.eslintrc.json` configuration
- Initial folder structure

---

### Step 1.2: Environment Configuration

**Prompt:**
```
Set up environment variables for the News Listing Application with:
1. Create .env.local and .env.example files
2. Include variables for:
   - Database connection (DATABASE_URL and DIRECT_URL)
   - Supabase (URL and keys)
   - NextAuth (URL and secret)
   - Node environment

3. Add proper .gitignore entries to exclude sensitive files
4. Create a README section explaining how to set up environment variables

Also create a lib/env.ts file with Zod validation for environment variables.
```

**Expected Deliverables:**
- `.env.example` template
- `.gitignore` updated
- `lib/env.ts` with validation
- README.md with setup instructions

---

### Step 1.3: Install Core Dependencies

**Prompt:**
```
Install and configure the following dependencies for a Next.js news listing application:

Production dependencies:
- @prisma/client (database ORM)
- @supabase/supabase-js (storage and auth)
- next-auth (authentication)
- react-hook-form (form management)
- @hookform/resolvers (form validation)
- zod (schema validation)
- date-fns (date utilities)
- clsx and tailwind-merge (utility classes)

Dev dependencies:
- prisma (database management)
- @types/* for all libraries
- jest and testing libraries
- playwright for E2E testing

Provide the complete installation command and any necessary configuration files.
```

**Expected Deliverables:**
- Installation commands
- `jest.config.js`
- `playwright.config.ts`
- Updated `package.json` scripts

---

## Phase 2: Database & Prisma Setup

### Step 2.1: Create Prisma Schema

**Prompt:**
```
Create a complete Prisma schema for a news listing application with the following models:

1. Admin model:
   - id (UUID)
   - email (unique)
   - supabaseId (unique)
   - timestamps

2. News model:
   - id (UUID)
   - title, slug (unique)
   - publishedDate
   - newsLink (optional)
   - shortDescription, fullContent
   - thumbnailUrl
   - status (enum: DRAFT, PUBLISHED, ARCHIVED)
   - views counter
   - relations: author (Admin), source (Source), images, tags
   - timestamps

3. Source model:
   - id (UUID)
   - name (unique), slug (unique)
   - website, logoUrl, description (optional)
   - isActive (boolean)
   - timestamps

4. NewsImage model:
   - id (UUID)
   - url, caption
   - relation to News
   - timestamp

5. Tag and NewsTag models for many-to-many relationship

Include proper indexes on:
- publishedDate, status, slug for News
- sourceId for News
- slug, isActive for Source

Add the Status enum and configure PostgreSQL as the datasource.
```

**Expected Deliverables:**
- `prisma/schema.prisma` complete file
- Proper relations and indexes
- Enum definitions

---

### Step 2.2: Initialize Database & Migrations

**Prompt:**
```
Create scripts and commands to:
1. Initialize Prisma with PostgreSQL
2. Generate Prisma Client
3. Create initial migration
4. Set up seed data script with:
   - 1 test admin user
   - 3-5 sample news sources
   - 5-10 sample tags
   - 10-15 sample news articles with various statuses

Create a prisma/seed.ts file that uses @faker-js/faker for realistic test data.
Include proper error handling and logging.

Also create a lib/prisma.ts file with a singleton Prisma Client instance that works with Next.js hot reloading.
```

**Expected Deliverables:**
- `prisma/seed.ts` with sample data
- `lib/prisma.ts` singleton client
- Migration files
- Package.json scripts for database operations

---

### Step 2.3: Create Database Utilities

**Prompt:**
```
Create utility functions in lib/db/ for common database operations:

1. lib/db/news.ts:
   - getPublishedNews(filters) - with pagination, date range, source filter
   - getNewsBySlug(slug)
   - createNews(data)
   - updateNews(id, data)
   - deleteNews(id)
   - generateUniqueSlug(title)

2. lib/db/sources.ts:
   - getAllSources(activeOnly)
   - getSourceById(id)
   - createSource(data)
   - updateSource(id, data)
   - deleteSource(id)
   - getSourceBySlug(slug)

3. lib/db/tags.ts:
   - getAllTags()
   - getOrCreateTags(names[])
   - getTagsByNewsId(newsId)

Include TypeScript types for all function parameters and return values.
Add proper error handling with try-catch blocks.
Use Prisma transactions where necessary.
```

**Expected Deliverables:**
- `lib/db/news.ts` with CRUD functions
- `lib/db/sources.ts` with CRUD functions
- `lib/db/tags.ts` with tag operations
- TypeScript interfaces in `types/index.ts`

---

## Phase 3: Authentication System

### Step 3.1: Configure Supabase

**Prompt:**
```
Create configuration for Supabase integration:

1. lib/supabase/client.ts - Browser client
2. lib/supabase/server.ts - Server client for API routes
3. lib/supabase/storage.ts - Helper functions for file uploads:
   - uploadImage(file, bucket, path)
   - deleteImage(bucket, path)
   - getPublicUrl(bucket, path)

Set up two storage buckets configuration:
- news-images (for news content)
- source-logos (for source branding)

Include TypeScript types and error handling.
Create helper functions for image optimization (resize, WebP conversion).
```

**Expected Deliverables:**
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/storage.ts`
- Bucket configuration documentation

---

### Step 3.2: Setup NextAuth

**Prompt:**
```
Configure NextAuth for admin authentication:

1. Create app/api/auth/[...nextauth]/route.ts with:
   - Credentials provider using Supabase
   - Session strategy: JWT
   - Custom callbacks for session and JWT
   - Sign-in verification against Admin table

2. Create lib/auth/index.ts with:
   - getServerSession() helper
   - requireAuth() middleware
   - getCurrentUser() utility

3. Create types/next-auth.d.ts to extend NextAuth types with admin properties

4. Add error handling for failed authentication attempts
5. Configure session expiration (30 days)

Include proper TypeScript typing and security best practices.
```

**Expected Deliverables:**
- `app/api/auth/[...nextauth]/route.ts`
- `lib/auth/index.ts` utilities
- `types/next-auth.d.ts` type extensions
- Authentication helpers

---

### Step 3.3: Create Middleware & Route Protection

**Prompt:**
```
Create Next.js middleware for route protection:

1. middleware.ts in project root:
   - Protect all /admin/* routes
   - Protect all /api/admin/* API routes
   - Redirect unauthenticated users to /admin/login
   - Allow public routes to pass through

2. Create lib/auth/guards.ts with server-side guards:
   - withAuth(handler) - HOC for API routes
   - requireAdmin() - throws if not authenticated

3. Add proper TypeScript types
4. Include logging for authentication attempts

Test cases to consider:
- Unauthenticated user accessing /admin
- Authenticated user accessing /admin
- Direct API route access without auth
```

**Expected Deliverables:**
- `middleware.ts` with route protection
- `lib/auth/guards.ts` with HOCs
- Configuration for matcher patterns

---

### Step 3.4: Build Login Page

**Prompt:**
```
Create the admin login page at app/admin/login/page.tsx:

UI Requirements:
- Clean, centered login form
- Email and password fields
- "Remember me" checkbox (optional)
- Submit button with loading state
- Error message display
- Responsive design (mobile-friendly)

Functionality:
- Use react-hook-form for form management
- Zod validation for email format and password
- signIn from next-auth/react
- Redirect to /admin after successful login
- Show error toast/message on failed login
- Disable form during submission

Styling:
- Use Tailwind CSS
- Modern, clean design
- Focus states for accessibility
- Loading spinner during authentication

Also create a simple logo/header component for branding.
```

**Expected Deliverables:**
- `app/admin/login/page.tsx`
- Login form component
- Validation schema
- Error handling

---

## Phase 4: Admin - News Management

### Step 4.1: Create Admin Layout

**Prompt:**
```
Create admin layout at app/admin/layout.tsx:

Requirements:
1. Sidebar navigation with links to:
   - Dashboard
   - News Management
   - Source Management
   - Logout

2. Top header with:
   - App logo/title
   - Current user email
   - Logout button

3. Mobile responsive:
   - Hamburger menu for mobile
   - Collapsible sidebar
   - Touch-friendly navigation

4. Protected layout:
   - Check authentication on server side
   - Redirect to login if not authenticated
   - Show loading state during auth check

5. Styling:
   - Use Tailwind CSS
   - Modern admin panel aesthetic
   - Active route highlighting
   - Smooth transitions

Create reusable components:
- components/admin/Sidebar.tsx
- components/admin/Header.tsx
- components/admin/MobileMenu.tsx
```

**Expected Deliverables:**
- `app/admin/layout.tsx`
- `components/admin/Sidebar.tsx`
- `components/admin/Header.tsx`
- Mobile menu component

---

### Step 4.2: Build News List Page

**Prompt:**
```
Create app/admin/news/page.tsx - Admin news listing page:

Features:
1. Table view with columns:
   - Thumbnail (small image)
   - Title
   - Source (with logo)
   - Published Date
   - Status badge (Draft/Published/Archived)
   - Actions (Edit, Delete)

2. Filters:
   - Search by title (debounced)
   - Filter by status dropdown
   - Filter by source dropdown
   - Sort by date/title

3. Actions:
   - Create New button (links to create page)
   - Edit button (links to edit page)
   - Delete button (with confirmation modal)
   - Bulk actions (optional for MVP)

4. Pagination:
   - 20 items per page
   - Page numbers
   - Next/Previous buttons

5. Empty state when no news exists

6. Server-side data fetching
7. Loading skeleton during fetch

Use server components where possible for better performance.
Create reusable components for table, filters, and pagination.
```

**Expected Deliverables:**
- `app/admin/news/page.tsx`
- `components/admin/NewsTable.tsx`
- `components/admin/NewsFilters.tsx`
- `components/ui/Pagination.tsx`
- Delete confirmation modal

---

### Step 4.3: Create News Form Component

**Prompt:**
```
Create a reusable news form component at components/admin/NewsForm.tsx:

Form Fields:
1. Title (text input, required, max 200 chars)
2. Published Date (datetime picker)
3. Source (dropdown select, optional)
4. News Link (URL input, optional, with validation)
5. Short Description (textarea, required, max 150 chars, character counter)
6. Full Content (rich text editor - Tiptap)
7. Thumbnail Image (file upload, required, image preview)
8. Additional Images (multiple file upload, optional, image gallery)
9. Tags (multi-select or chip input)
10. Status (radio buttons: Draft/Published)

Features:
- React Hook Form for form management
- Zod validation schema
- Real-time validation feedback
- Character counters for limited fields
- Image preview before upload
- Drag-and-drop for images
- Auto-generate slug from title
- Save as draft functionality
- Loading states during submission

Rich Text Editor:
- Use Tiptap with basic formatting
- Bold, italic, underline
- Headings (H2, H3)
- Lists (bullet, numbered)
- Links
- Images (optional)

Create supporting components:
- components/admin/ImageUpload.tsx
- components/admin/RichTextEditor.tsx
- components/admin/TagSelector.tsx
```

**Expected Deliverables:**
- `components/admin/NewsForm.tsx`
- `components/admin/ImageUpload.tsx`
- `components/admin/RichTextEditor.tsx`
- `components/admin/TagSelector.tsx`
- Zod validation schema
- TypeScript types for form data

---

### Step 4.4: Create & Edit News Pages

**Prompt:**
```
Create news create and edit pages:

1. app/admin/news/create/page.tsx:
   - Use NewsForm component
   - Initialize with empty values
   - Handle form submission to POST /api/admin/news
   - Upload images to Supabase Storage
   - Show success toast and redirect to news list
   - Handle errors gracefully

2. app/admin/news/[id]/edit/page.tsx:
   - Fetch existing news data on server
   - Pre-populate NewsForm with existing data
   - Handle form submission to PUT /api/admin/news/[id]
   - Handle image replacement (delete old, upload new)
   - Show success toast and redirect to news list
   - Handle errors gracefully

Both pages should:
- Show loading state during data fetch
- Validate user is authenticated
- Handle 404 for non-existent news (edit page)
- Provide "Cancel" button to go back
- Show unsaved changes warning (optional)

Create helper functions:
- lib/helpers/image-upload.ts for client-side image handling
- lib/helpers/slug-generator.ts for URL slugs
```

**Expected Deliverables:**
- `app/admin/news/create/page.tsx`
- `app/admin/news/[id]/edit/page.tsx`
- Image upload helpers
- Slug generator utility

---

### Step 4.5: News API Routes

**Prompt:**
```
Create API routes for news management:

1. app/api/admin/news/route.ts:
   - GET: List all news with filters (search, status, source, pagination)
   - POST: Create new news article
   - Both require authentication
   - Validate request data with Zod
   - Handle errors with proper HTTP status codes

2. app/api/admin/news/[id]/route.ts:
   - GET: Get single news by ID
   - PUT: Update existing news
   - DELETE: Delete news and associated images
   - All require authentication
   - Validate news ownership (optional)
   - Cascade delete related images from Supabase

Features:
- Use Next.js 14 route handlers
- Proper error handling with try-catch
- Zod validation for request bodies
- Return consistent JSON responses
- HTTP status codes (200, 201, 400, 401, 404, 500)
- Logging for debugging

Create validation schemas:
- lib/validations/news.ts with createNewsSchema and updateNewsSchema

Include TypeScript types for request/response.
```

**Expected Deliverables:**
- `app/api/admin/news/route.ts` (GET, POST)
- `app/api/admin/news/[id]/route.ts` (GET, PUT, DELETE)
- `lib/validations/news.ts` validation schemas
- Error handling utilities

---

## Phase 5: Admin - Source Management

### Step 5.1: Source List Page

**Prompt:**
```
Create app/admin/sources/page.tsx - Source management page:

Features:
1. Card/Table view with:
   - Source logo (thumbnail)
   - Name
   - Website link
   - News count (number of associated news)
   - Active status toggle
   - Actions (Edit, Delete)

2. Filters:
   - Search by name
   - Filter by active/inactive
   - Sort by name or news count

3. Actions:
   - Create New Source button
   - Edit button
   - Delete button (with confirmation)
   - Toggle active/inactive status

4. Empty state for no sources

5. Server-side data fetching
6. Loading skeleton

Special considerations:
- Show warning if trying to delete source with news
- Provide option to reassign news before deletion
- Quick toggle for active status (optimistic update)

Reuse pagination and filter components from news.
```

**Expected Deliverables:**
- `app/admin/sources/page.tsx`
- `components/admin/SourceCard.tsx` or `SourceTable.tsx`
- `components/admin/SourceFilters.tsx`
- Delete confirmation with reassignment option

---

### Step 5.2: Source Form & Pages

**Prompt:**
```
Create source form and CRUD pages:

1. components/admin/SourceForm.tsx:
   - Name (text input, required, unique)
   - Website URL (URL input, optional, with validation)
   - Logo (image upload, optional, preview)
   - Description (textarea, max 300 chars)
   - Active Status (toggle switch, default: true)
   - React Hook Form + Zod validation
   - Auto-generate slug from name

2. app/admin/sources/create/page.tsx:
   - Use SourceForm component
   - POST to /api/admin/sources
   - Upload logo to Supabase Storage
   - Redirect to source list on success

3. app/admin/sources/[id]/edit/page.tsx:
   - Fetch existing source data
   - Pre-populate form
   - PUT to /api/admin/sources/[id]
   - Handle logo replacement

Both pages need:
- Authentication check
- Loading states
- Error handling
- Success notifications
```

**Expected Deliverables:**
- `components/admin/SourceForm.tsx`
- `app/admin/sources/create/page.tsx`
- `app/admin/sources/[id]/edit/page.tsx`
- Validation schema for source

---

### Step 5.3: Source API Routes

**Prompt:**
```
Create API routes for source management:

1. app/api/admin/sources/route.ts:
   - GET: List all sources with filters
   - POST: Create new source
   - Authentication required
   - Validate unique name and slug

2. app/api/admin/sources/[id]/route.ts:
   - GET: Get single source
   - PUT: Update source
   - DELETE: Delete source (check for associated news first)
   - Authentication required

3. app/api/sources/route.ts (PUBLIC):
   - GET: List active sources only
   - No authentication required
   - Used by public pages for filtering

Features:
- Zod validation
- Proper error handling
- Check for orphaned news before deletion
- Return associated news count with each source

Create validation schema:
- lib/validations/source.ts
```

**Expected Deliverables:**
- `app/api/admin/sources/route.ts`
- `app/api/admin/sources/[id]/route.ts`
- `app/api/sources/route.ts` (public)
- `lib/validations/source.ts`

---

## Phase 6: Public Landing Page

### Step 6.1: News Card Component

**Prompt:**
```
Create a reusable news card component at components/news/NewsCard.tsx:

Display:
- Thumbnail image (Next.js Image component, optimized)
- Title (truncate to 2 lines if too long)
- Short description (truncate to 3 lines)
- Published date (formatted with date-fns)
- Source name and logo (small badge)
- "Read More" link/button

Features:
- Responsive design (mobile, tablet, desktop)
- Hover effects (subtle scale/shadow)
- Skeleton loading state version
- Click anywhere on card to navigate
- Accessibility (semantic HTML, ARIA labels)
- Optimized images with Next.js Image

Styling:
- Tailwind CSS
- Modern card design
- Aspect ratio for images (16:9)
- Clean typography

Create companion component:
- components/news/NewsCardSkeleton.tsx for loading state
```

**Expected Deliverables:**
- `components/news/NewsCard.tsx`
- `components/news/NewsCardSkeleton.tsx`
- Responsive and accessible design

---

### Step 6.2: Date Filter Component

**Prompt:**
```
Create date filtering component at components/news/DateFilter.tsx:

Features:
1. Quick filters (buttons):
   - Today
   - Last 7 days
   - Last 30 days
   - Custom range

2. Calendar picker:
   - Use react-day-picker
   - Date range selection
   - Highlight dates with news (optional)
   - Mobile-friendly calendar

3. Source filter:
   - Multi-select dropdown
   - Show source logos in dropdown
   - Filter by multiple sources

4. Clear filters button

5. Active filter indicators:
   - Show currently applied filters as chips/tags
   - Click to remove individual filter

Behavior:
- Update URL query params on filter change
- Debounced API calls when typing
- Persist filters in URL (shareable links)
- Client-side state management

Make it a client component with proper state handling.
```

**Expected Deliverables:**
- `components/news/DateFilter.tsx`
- `components/news/SourceFilter.tsx`
- URL query param integration
- Filter state management

---

### Step 6.3: News List Page (Landing)

**Prompt:**
```
Create the public landing page at app/(public)/page.tsx:

Layout:
1. Header:
   - App logo/title
   - Navigation (if any)
   - Search bar (optional for MVP)

2. Filter Section:
   - DateFilter component
   - SourceFilter component
   - Active filters display

3. News Grid:
   - Responsive grid (1 col mobile, 2 col tablet, 3 col desktop)
   - NewsCard components
   - Infinite scroll OR pagination
   - Loading skeletons during fetch

4. Empty State:
   - Show when no news match filters
   - Helpful message
   - Clear filters button

Features:
- Server-side rendering for initial load (SEO)
- Client-side filtering for better UX
- Loading states
- Error boundaries
- Meta tags for SEO

Create supporting components:
- components/layout/Header.tsx
- components/news/NewsList.tsx
- components/news/EmptyState.tsx
```

**Expected Deliverables:**
- `app/(public)/page.tsx`
- `components/layout/Header.tsx`
- `components/news/NewsList.tsx`
- `components/news/EmptyState.tsx`
- SEO meta tags

---

### Step 6.4: News Detail Page

**Prompt:**
```
Create news detail page at app/(public)/news/[slug]/page.tsx:

Display:
1. Full-width header image (thumbnail)
2. Article metadata:
   - Title (H1)
   - Published date
   - Source (with logo and link to website)
   - View counter

3. Full content:
   - Render HTML content safely
   - Proper typography (headings, paragraphs, lists)
   - Responsive images in content
   - Additional images gallery (if any)

4. Tags:
   - Display as clickable chips
   - Link to filtered view (optional)

5. Related news:
   - 3-4 news from same source or similar tags
   - NewsCard component

6. Breadcrumb navigation:
   - Home > News > [Title]

Features:
- Server-side rendering (generateStaticParams for popular news)
- Increment view counter
- Social sharing buttons (optional)
- Print-friendly version (optional)
- SEO optimization (OpenGraph, Twitter cards)

Create supporting components:
- components/news/NewsContent.tsx
- components/news/ImageGallery.tsx
- components/news/RelatedNews.tsx
- components/ui/Breadcrumb.tsx
```

**Expected Deliverables:**
- `app/(public)/news/[slug]/page.tsx`
- `components/news/NewsContent.tsx`
- `components/news/ImageGallery.tsx`
- `components/news/RelatedNews.tsx`
- SEO meta tags and social sharing

---

### Step 6.5: Public API Routes

**Prompt:**
```
Create public API routes for news data:

1. app/api/news/route.ts:
   - GET: List published news with filters
   - Query params: page, limit, startDate, endDate, source, tag
   - Return paginated results
   - No authentication required
   - Cache headers for performance

2. app/api/news/[slug]/route.ts:
   - GET: Get single published news by slug
   - Increment view counter
   - Return full content and source details
   - 404 if not found or not published
   - Cache headers

Features:
- Input validation with Zod
- Error handling
- Proper HTTP status codes
- Performance optimization (DB indexes)
- Rate limiting (optional)

Create helper:
- lib/api/cache.ts for cache header utilities
```

**Expected Deliverables:**
- `app/api/news/route.ts`
- `app/api/news/[slug]/route.ts`
- Cache utilities
- Validation schemas

---

## Phase 7: Image Upload & Storage

### Step 7.1: Image Upload API Route

**Prompt:**
```
Create image upload API route at app/api/admin/upload/route.ts:

Features:
1. Accept image files (JPEG, PNG, WebP)
2. Validate file:
   - File type (image only)
   - File size (max 5MB)
   - Dimensions (optional)

3. Process image:
   - Generate unique filename
   - Resize/optimize image
   - Convert to WebP (optional)
   - Create thumbnail version (optional)

4. Upload to Supabase Storage:
   - Determine bucket (news-images or source-logos)
   - Upload original and thumbnail
   - Get public URLs

5. Return response:
   - Public URL
   - File path
   - Metadata (size, dimensions)

Security:
- Require authentication
- Validate file types server-side
- Sanitize filenames
- Prevent path traversal

Use libraries:
- sharp for image processing (optional)
- file-type for validation

Error handling:
- Invalid file type
- File too large
- Upload failed
- Storage quota exceeded
```

**Expected Deliverables:**
- `app/api/admin/upload/route.ts`
- `lib/image/processor.ts` for image optimization
- File validation utilities
- Error handling

---

### Step 7.2: Client-Side Upload Component

**Prompt:**
```
Create reusable image upload component at components/ui/ImageUploader.tsx:

Features:
1. Drag and drop area
2. Click to browse files
3. Multiple file selection support
4. Image preview before upload
5. Upload progress indicator
6. Success/error states
7. Remove/replace functionality

UI Elements:
- Dropzone with dashed border
- File input (hidden)
- Image preview grid
- Progress bars
- Error messages
- File size and type validation client-side

Props:
- onUpload(urls: string[]) callback
- maxFiles: number
- maxSize: number (MB)
- accept: string (file types)
- bucket: 'news-images' | 'source-logos'

Features:
- Client-side validation before upload
- Compress images before upload (optional)
- Support for paste from clipboard
- Accessible (keyboard navigation, screen reader)

Use libraries:
- react-dropzone (optional)

Create supporting components:
- components/ui/FilePreview.tsx
- components/ui/UploadProgress.tsx
```

**Expected Deliverables:**
- `components/ui/ImageUploader.tsx`
- `components/ui/FilePreview.tsx`
- `components/ui/UploadProgress.tsx`
- Client-side validation

---

### Step 7.3: Supabase Storage Configuration

**Prompt:**
```
Create Supabase Storage setup documentation and helper functions:

1. Documentation (docs/supabase-storage-setup.md):
   - How to create buckets in Supabase
   - Bucket policies (public read, authenticated write)
   - CORS configuration
   - File size limits
   - Allowed file types

2. lib/supabase/storage-helpers.ts:
   - uploadToSupabase(file, bucket, path)
   - deleteFromSupabase(bucket, path)
   - getPublicUrl(bucket, path)
   - listFiles(bucket, prefix)
   - moveFile(bucket, oldPath, newPath)

3. lib/supabase/bucket-config.ts:
   - Bucket names constants
   - Bucket configurations
   - Public URL generator

4. Create helper for orphaned image cleanup:
   - Find images not referenced in database
   - Delete unused images (cron job or manual script)

Include TypeScript types and error handling.
```

**Expected Deliverables:**
- `docs/supabase-storage-setup.md`
- `lib/supabase/storage-helpers.ts`
- `lib/supabase/bucket-config.ts`
- Cleanup utilities

---

## Phase 8: Testing & Optimization

### Step 8.1: Unit Tests

**Prompt:**
```
Create unit tests for key utilities and components:

1. Database utilities tests:
   - lib/db/news.test.ts
   - lib/db/sources.test.ts
   - Test CRUD operations
   - Mock Prisma client

2. Helper function tests:
   - lib/helpers/slug-generator.test.ts
   - lib/helpers/date-formatter.test.ts
   - lib/validations/news.test.ts (Zod schemas)

3. Component tests:
   - components/news/NewsCard.test.tsx
   - components/admin/NewsForm.test.tsx
   - Test rendering, user interactions, edge cases

Use:
- Jest for test runner
- React Testing Library for components
- Prisma mock for database
- MSW for API mocking (optional)

Test coverage should be >70% for utilities, >60% for components.
```

**Expected Deliverables:**
- Test files for all utilities
- Component test files
- Jest configuration
- Mock utilities

---

### Step 8.2: E2E Tests

**Prompt:**
```
Create E2E tests with Playwright:

User flows to test:
1. Public user:
   - Browse news on landing page
   - Filter by date range
   - Filter by source
   - View news detail
   - Navigate between pages

2. Admin user:
   - Login
   - Create new news article
   - Upload images
   - Edit existing news
   - Delete news
   - Create source
   - Logout

Test files:
- tests/e2e/public-news-browsing.spec.ts
- tests/e2e/admin-news-management.spec.ts
- tests/e2e/admin-source-management.spec.ts
- tests/e2e/auth.spec.ts

Features:
- Page object model pattern
- Test data seeding before tests
- Cleanup after tests
- Screenshots on failure
- Parallel test execution

Create helpers:
- tests/helpers/test-data.ts for seed data
- tests/helpers/auth.ts for login helpers
```

**Expected Deliverables:**
- E2E test files
- Playwright configuration
- Page object models
- Test helpers and fixtures

---

### Step 8.3: Performance Optimization

**Prompt:**
```
Optimize the application for performance:

1. Image optimization:
   - Implement Next.js Image component everywhere
   - Add blur placeholders
   - Use appropriate image sizes
   - Lazy load images below fold

2. Code splitting:
   - Dynamic imports for heavy components (rich text editor)
   - Route-based code splitting (automatic with Next.js)
   - Lazy load admin components

3. Database optimization:
   - Review and optimize queries
   - Add missing indexes
   - Implement pagination properly
   - Use select to fetch only needed fields

4. Caching:
   - Add cache headers to API routes
   - Implement SWR or React Query for client-side caching (optional)
   - Static generation for popular news

5. Bundle optimization:
   - Analyze bundle with @next/bundle-analyzer
   - Remove unused dependencies
   - Tree-shake libraries

6. Lighthouse audit:
   - Run Lighthouse tests
   - Fix accessibility issues
   - Improve SEO scores
   - Optimize Core Web Vitals

Create performance monitoring:
- Use Next.js Speed Insights (optional)
- Add error tracking with Sentry (optional)
```

**Expected Deliverables:**
- Optimized images throughout
- Dynamic imports for heavy components
- Database query optimizations
- Bundle analysis report
- Lighthouse score report

---

### Step 8.4: Accessibility Improvements

**Prompt:**
```
Ensure accessibility compliance (WCAG 2.1 Level AA):

1. Semantic HTML:
   - Use proper heading hierarchy
   - Use semantic tags (nav, main, article, section)
   - Form labels for all inputs

2. Keyboard navigation:
   - Focus states on all interactive elements
   - Logical tab order
   - Skip to main content link
   - Escape to close modals

3. Screen reader support:
   - ARIA labels where needed
   - ARIA live regions for dynamic content
   - Alt text for all images
   - Hidden labels for icon-only buttons

4. Color and contrast:
   - Sufficient color contrast (4.5:1 for text)
   - Don't rely on color alone for information
   - Focus indicators

5. Forms:
   - Clear error messages
   - Error summary at top of form
   - Required field indicators
   - Help text for complex fields

6. Testing:
   - Use axe-core for automated testing
   - Manual keyboard navigation testing
   - Screen reader testing (NVDA/JAWS)

Create:
- components/ui/SkipToContent.tsx
- Accessibility documentation
```

**Expected Deliverables:**
- Accessibility audit report
- Fixed accessibility issues
- `components/ui/SkipToContent.tsx`
- Keyboard navigation support

---

## Phase 9: Deployment

### Step 9.1: Environment Setup

**Prompt:**
```
Prepare for production deployment:

1. Create production environment variables:
   - Supabase production project
   - Production database URL
   - NextAuth secret (generate new)
   - All API keys for production

2. Update configuration files:
   - next.config.js (production settings)
   - Allow domains for Next.js Image
   - Security headers
   - Redirects and rewrites if needed

3. Database preparation:
   - Run migrations on production database
   - Seed initial admin user
   - Create indexes
   - Set up backups

4. Create deployment checklist:
   - Environment variables set
   - Database migrated
   - Supabase buckets created
   - Storage policies configured
   - Admin user created
   - DNS configured (if custom domain)

5. Security review:
   - Rate limiting configured
   - CORS properly set
   - Authentication tested
   - File upload limits set
   - Error messages don't leak info
```

**Expected Deliverables:**
- Production environment variables
- Updated configuration files
- Deployment checklist
- Security review document

---

### Step 9.2: Vercel Deployment

**Prompt:**
```
Deploy Next.js application to Vercel:

1. Connect GitHub repository to Vercel
2. Configure project settings:
   - Framework preset: Next.js
   - Build command: next build
   - Output directory: .next
   - Install command: npm install

3. Add environment variables in Vercel:
   - All production environment variables
   - Use Vercel Postgres or external PostgreSQL

4. Configure deployment:
   - Production branch: main
   - Preview branches: Pull requests
   - Ignored build step: Deploy only on main

5. Set up Prisma in Vercel:
   - Add postinstall script for Prisma generate
   - Configure DATABASE_URL and DIRECT_URL
   - Set up migration workflow

6. Custom domain (optional):
   - Add domain to Vercel
   - Configure DNS records
   - Enable SSL certificate

7. Configure monitoring:
   - Enable Vercel Analytics
   - Set up logging
   - Configure alerts

Create deployment documentation:
- docs/deployment.md with step-by-step guide
```

**Expected Deliverables:**
- Deployed application on Vercel
- Custom domain configured (optional)
- Deployment documentation
- Environment variables set

---

### Step 9.3: Database Migration Strategy

**Prompt:**
```
Create safe database migration process:

1. Migration scripts:
   - Create scripts/migrate.sh for running migrations
   - Add backup before migration
   - Rollback script if migration fails

2. Prisma migration workflow:
   - Generate migration locally
   - Test migration on staging database
   - Review migration SQL
   - Run migration on production
   - Verify data integrity

3. Create staging environment:
   - Separate database for staging
   - Mirror production configuration
   - Test migrations here first

4. Data backup strategy:
   - Automated daily backups
   - Pre-migration manual backup
   - Backup retention policy (30 days)

5. Rollback plan:
   - Document rollback steps
   - Keep previous migration files
   - Test rollback procedure

6. Migration testing checklist:
   - Data integrity after migration
   - No broken references
   - Indexes created properly
   - Application works after migration

Create documentation:
- docs/database-migrations.md
```

**Expected Deliverables:**
- `scripts/migrate.sh`
- `scripts/rollback.sh`
- Migration workflow documentation
- Backup and restore procedures

---

### Step 9.4: Monitoring & Maintenance

**Prompt:**
```
Set up monitoring and maintenance procedures:

1. Error tracking:
   - Set up Sentry or similar (optional)
   - Configure error boundaries
   - Log errors to external service
   - Alert on critical errors

2. Performance monitoring:
   - Vercel Analytics for Core Web Vitals
   - Database query performance
   - API response times
   - Image optimization metrics

3. Uptime monitoring:
   - Set up UptimeRobot or Pingdom
   - Monitor homepage
   - Monitor API endpoints
   - Email alerts on downtime

4. Database maintenance:
   - Regular backups
   - Index maintenance
   - Query optimization
   - Cleanup orphaned images

5. Logging strategy:
   - Application logs
   - API request logs
   - Authentication logs
   - Error logs
   - Log rotation policy

6. Create maintenance scripts:
   - scripts/cleanup-images.ts (remove orphaned images)
   - scripts/optimize-database.ts (analyze and vacuum)
   - scripts/generate-report.ts (usage statistics)

7. Documentation:
   - Admin user guide
   - Troubleshooting guide
   - Common issues and solutions
   - Support contact information

Create:
- docs/monitoring.md
- docs/maintenance.md
- docs/troubleshooting.md
```

**Expected Deliverables:**
- Monitoring setup
- Maintenance scripts
- Logging configuration
- Admin documentation

---

## 📊 Development Checklist

Use this checklist to track progress:

### Phase 1: Setup ☐
- [ ] Next.js project initialized
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Folder structure created

### Phase 2: Database ☐
- [ ] Prisma schema created
- [ ] Migrations run
- [ ] Seed data created
- [ ] Database utilities built

### Phase 3: Authentication ☐
- [ ] Supabase configured
- [ ] NextAuth setup
- [ ] Middleware created
- [ ] Login page built

### Phase 4: Admin News ☐
- [ ] Admin layout created
- [ ] News list page
- [ ] News form component
- [ ] Create/Edit pages
- [ ] News API routes

### Phase 5: Admin Sources ☐
- [ ] Source list page
- [ ] Source form
- [ ] Create/Edit pages
- [ ] Source API routes

### Phase 6: Public Pages ☐
- [ ] News card component
- [ ] Date filter component
- [ ] Landing page
- [ ] News detail page
- [ ] Public API routes

### Phase 7: Images ☐
- [ ] Upload API route
- [ ] Image uploader component
- [ ] Supabase storage configured
- [ ] Image optimization

### Phase 8: Testing ☐
- [ ] Unit tests written
- [ ] E2E tests written
- [ ] Performance optimized
- [ ] Accessibility fixed

### Phase 9: Deployment ☐
- [ ] Production environment setup
- [ ] Vercel deployment
- [ ] Database migrated
- [ ] Monitoring configured

---

## 🎯 Quick Start Commands

For developers starting fresh:

```bash
# Clone and setup
git clone <repository-url>
cd news-listing-app
npm install

# Environment setup
cp .env.example .env.local
# Fill in your environment variables

# Database setup
npx prisma generate
npx prisma migrate dev
npx prisma db seed

# Development
npm run dev

# Testing
npm run test
npm run test:e2e

# Build
npm run build

# Production
npm start
```

---

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [NextAuth Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Hook Form Documentation](https://react-hook-form.com)

---

## 💡 Tips for Success

1. **Start Small:** Build one feature at a time
2. **Test Early:** Write tests as you build
3. **Version Control:** Commit frequently with clear messages
4. **Documentation:** Document as you build
5. **Code Review:** Review your own code before committing
6. **Performance:** Keep bundle size small from the start
7. **Accessibility:** Build accessible from day one
8. **Security:** Never commit secrets, always validate input

---

**Document Version:** 1.0  
**Last Updated:** February 14, 2026  
**Status:** Ready for Development
