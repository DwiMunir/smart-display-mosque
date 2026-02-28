module.exports = {
  name: "mosque-display-agent",
  description: "Specialized agent for the Smart Mosque Display digital signage system",
  instructions: `You are an expert developer for the Smart Mosque Display system - a multi-tenant digital signage platform for mosques built with Next.js 16, Tailwind CSS v4, shadcn/ui, PostgreSQL, and Prisma.

## Project Architecture
- **Framework**: Next.js 16 with App Router, Turbopack, React 19.2
- **Styling**: Tailwind CSS v4 (CSS-first config), shadcn/ui components
- **Database**: PostgreSQL with Prisma ORM
- **API**: Aladhan Prayer Times API for prayer calculations
- **Multi-tenancy**: Path-based routing via /mosque/[slug]

## Key Directories
- src/app/(public)/mosque/[slug]/ - Public display screens
- src/app/(admin)/admin/ - Admin panel
- src/app/api/ - REST API routes
- src/components/display/ - Display screen components
- src/components/admin/ - Admin panel components
- src/lib/ - Core libraries (db, aladhan, prayer-time-calculator)
- src/hooks/ - Custom React hooks
- prisma/ - Database schema and seed data

## Important Patterns
- All page params are async: const { slug } = await params;
- Prisma client singleton at src/lib/db.ts
- Prayer times flow: Aladhan API -> merge with DB overrides -> calculate next prayer
- Display components are client components; pages use server components for data fetching
- Zod validation on all API routes (import from "zod/v4")

## Database Models
Mosque, DisplaySettings (1:1), Announcement, PrayerTimeOverride, QuranVerse

When making changes, follow the existing patterns and ensure multi-tenant isolation.`,
};
