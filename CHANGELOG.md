# Changelog

## [0.1.0] - 2025-10-01

### ✅ Fixed Linting Issues

**Errors Fixed:**

- Fixed unescaped apostrophes in Dashboard welcome message (changed to `&apos;`)

**Warnings Fixed:**

- Removed unused imports across multiple files:
  - `Badge` from calendar/page.tsx
  - `Textarea` from campaigns/page.tsx and content/page.tsx
  - `TrendingUp`, `Calendar` from campaigns/page.tsx
  - `FileText`, `TrendingUp` from dashboard page.tsx
  - `Table`, `TableRow`, `TableCell` from projects/page.tsx
  - `Button` from Modal.tsx
- Removed unused variable `responsible` in campaigns/page.tsx
- Removed unused variable `avgProjectProgress` in reports/page.tsx
- Replaced `<img>` tags with Next.js `<Image />` component in:
  - Topbar.tsx (user avatar)
  - reports/page.tsx (team member avatars)

**Configuration Updates:**

- Added image remote patterns to `next.config.ts` to allow external images from dicebear.com

### 🎨 Initial Release Features

**Core Modules:**

- ✅ Dashboard with overview statistics
- ✅ Clients Management (CRUD)
- ✅ Projects Management with progress tracking
- ✅ Tasks Management with status and priority
- ✅ Campaigns Management with KPIs
- ✅ Content Planning with workflow states
- ✅ Social Calendar (monthly view)
- ✅ Reports & Analytics with filters

**UI Components:**

- ✅ Badge, Button, Card
- ✅ Input, Textarea, Select
- ✅ Modal, Table, ProgressBar
- ✅ Sidebar, Topbar

**Technical Stack:**

- Next.js 15.5.4
- React 19.1.0
- TailwindCSS 4.0
- TypeScript
- Lucide React Icons

**Theme:**

- Background: #0c081e
- Primary: #563EB7
- Responsive design (Desktop, Tablet, Mobile)

### 📝 Notes

- Application uses in-memory state management with Context API
- Includes dummy data for testing
- All components are fully typed with TypeScript
- No linter errors or warnings
- Development server runs on http://localhost:3000
