# CV Maker Platform

Aplikasi web MVP untuk membuat CV online dengan sistem membership dan portal lowongan kerja.

## Fitur

- **Autentikasi**: Login dan register dengan email/password
- **Dashboard**: Statistik CV, membership, dan referral dengan design modern SaaS
- **CV Builder**: Form lengkap untuk membuat CV dengan 2 template (Modern & Minimal)
- **PDF Export**: Download CV dalam format PDF (dengan watermark untuk user gratis)
- **Portal Lowongan Kerja**: 
  - **Google Jobs**: Lowongan dari Google Jobs API (via SerpAPI)
  - **Lowongan Lokal**: Lowongan dari database lokal
- **Sistem Referral**: Bagikan kode referral dan dapatkan poin
- **Admin Panel**: Kelola user, CV, dan lowongan kerja

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS v4
- Prisma ORM + SQLite
- NextAuth.js
- jsPDF + html2canvas
- SerpAPI (Google Jobs)

## Cara Menjalankan

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

File `.env` sudah disediakan dengan konfigurasi default:

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
SERPAPI_KEY="your-serpapi-key"
```

### 3. Setup Database

```bash
# Database sudah di-setup dengan SQLite
npm run db:migrate

# Seed data contoh
npm run db:seed
```

### 4. Jalankan Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## Akun Default

### Admin
- Email: `admin@cvmaker.com`
- Password: `admin123`

## Integrasi Google Jobs (SerpAPI)

Aplikasi ini menggunakan SerpAPI untuk mengambil data lowongan kerja dari Google Jobs.

### Konfigurasi

1. Daftar di [SerpAPI](https://serpapi.com/)
2. Dapatkan API key dari dashboard
3. Update `SERPAPI_KEY` di file `.env`

### Fitur

- Tab switcher antara "Google Jobs" dan "Lowongan Lokal"
- Data dari Google Jobs di-cache selama 1 jam untuk menghemat quota
- Fallback data tersedia jika API gagal atau quota habis
- Link langsung ke halaman detail pekerjaan

## Struktur Folder

```
app/
  (auth)/           # Route group untuk auth pages
    login/
    register/
  (dashboard)/      # Route group untuk dashboard pages
    dashboard/
    cv/
    jobs/
    referral/
    profile/
    admin/
  api/              # API Routes
    auth/
    cv/
    jobs/
      google/       # Google Jobs API integration
    admin/
components/
  ui/               # UI Components (Button, Input, Card, dll)
  cv/               # CV Components
  templates/        # CV Templates (Modern, Minimal)
lib/
  prisma.ts         # Prisma Client
  auth.ts           # Auth utilities
  utils.ts          # Helper functions
types/
  next-auth.d.ts    # NextAuth types
prisma/
  schema.prisma     # Database schema
  seed.ts           # Seed data
```

## Membership

### Gratis
- Maksimal 1 CV
- PDF dengan watermark "Dibuat dengan CV Maker"
- Akses semua lowongan kerja

### Premium
- CV tidak terbatas
- PDF tanpa watermark
- Semua template

## Data Contoh

### Lowongan Lokal
- Frontend Developer - Tech Indonesia (Jakarta)
- Backend Developer - Digital Solutions (Bandung)
- UI/UX Designer - Creative Studio (Yogyakarta)
- Digital Marketing - Growth Hub (Jakarta)

### Google Jobs
Data lowongan diambil real-time dari Google Jobs API meliputi:
- Software Engineer
- Frontend Developer
- Backend Developer
- UI/UX Designer
- Product Manager
- Data Analyst

## Pengembangan Selanjutnya

- Integrasi payment gateway untuk upgrade premium
- Template CV tambahan
- Notifikasi email
- Analytics dashboard
- Mobile app

---

**Dibuat oleh Muhammad Zhafran Ghaly**
