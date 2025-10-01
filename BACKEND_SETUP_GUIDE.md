# 🚀 دليل إعداد الـ Backend - Backend Setup Guide

## ✅ ما تم إضافته

### 1. **Prisma ORM** 💾

- ✅ Database schema كامل
- ✅ Relations بين الجداول
- ✅ Models لجميع الـ entities

### 2. **API Routes** 🔌

- ✅ `/api/clients` - CRUD للعملاء
- ✅ `/api/projects` - CRUD للمشاريع
- ✅ `/api/tasks` - CRUD للمهام
- ✅ Filters support
- ✅ Relations included

### 3. **Configuration Files** ⚙️

- ✅ `.env.example` - Environment variables template
- ✅ `.gitignore` - Git ignore rules
- ✅ `prisma.ts` - Database client

---

## 📦 **Packages المثبتة**

```json
{
  "prisma": "^latest",
  "@prisma/client": "^latest",
  "bcryptjs": "^latest",
  "next-auth": "^latest",
  "@types/bcryptjs": "^latest"
}
```

---

## 🗄️ **Database Schema**

### Tables Created (11):

1. **users** - المستخدمين
   - id, email, name, password, role, avatar
2. **clients** - العملاء
   - id, name, contactPerson, phone, email, company, notes
3. **projects** - المشاريع
   - id, name, description, dates, status, progress
   - Relations: client, manager, creator
4. **tasks** - المهام
   - id, title, description, type, status, priority, dates, progress
   - Relations: project, assignedTo, createdBy
5. **campaigns** - الحملات
   - id, name, type, objective, dates, budget, status, progress
   - Relations: project, responsiblePerson, createdBy
6. **content** - المحتوى
   - id, title, contentType, status, priority, dates, progress
   - Relations: project, campaign, assignedTo, createdBy
7. **subtasks** - المهام الفرعية
   - Linked to tasks
8. **comments** - التعليقات
   - Threaded comments support
   - Relations: task, content, author, parent
9. **attachments** - المرفقات
   - For tasks, campaigns, content
10. **notifications** - الإشعارات
    - Real notifications system
11. **project_files** - ملفات المشروع
    - File management
12. **campaign_kpis** - مؤشرات الحملات
13. **change_logs** - سجل التغييرات

---

## 🚀 **خطوات الإعداد**

### Step 1: Setup Database

#### Option A: Supabase (الأسهل - موصى به) ⭐

```bash
1. اذهب لـ https://supabase.com
2. Create new project
3. انتظر 2 دقيقة للـ setup
4. اذهب لـ Settings → Database
5. انسخ Connection String
6. استبدل في .env
```

#### Option B: Local PostgreSQL

```bash
# Install PostgreSQL
brew install postgresql  # Mac
# or download from postgresql.org

# Start PostgreSQL
brew services start postgresql

# Create database
createdb crm_db
```

#### Option C: Neon.tech (سريع ومجاني)

```bash
1. اذهب لـ https://neon.tech
2. Sign up (free)
3. Create project
4. Copy connection string
```

---

### Step 2: Configure Environment

```bash
# 1. Copy .env.example to .env
cp .env.example .env

# 2. Edit .env
nano .env  # or use any editor

# 3. Add your DATABASE_URL
DATABASE_URL="postgresql://user:password@localhost:5432/crm_db"
```

**مثال لـ Supabase:**

```
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

---

### Step 3: Run Prisma Migrations

```bash
# 1. Generate Prisma Client
npx prisma generate

# 2. Create migration
npx prisma migrate dev --name init

# 3. Open Prisma Studio (optional - لمشاهدة البيانات)
npx prisma studio
```

---

### Step 4: Seed Database (Optional)

Create `prisma/seed.ts`:

```typescript
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@agency.com",
      name: "Admin User",
      password: hashedPassword,
      role: "admin",
    },
  });

  // Create sample client
  const client = await prisma.client.create({
    data: {
      name: "TechStart Inc.",
      contactPerson: "John Doe",
      phone: "+1 234 567 8900",
      email: "john@techstart.com",
      company: "TechStart Inc.",
      notes: "Sample client",
    },
  });

  console.log("Seed completed!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
```

Run seed:

```bash
npx prisma db seed
```

---

## 🔌 **API Routes Structure**

### Endpoints Created:

```
GET    /api/clients           # Get all clients
POST   /api/clients           # Create client
GET    /api/clients/[id]      # Get single client
PATCH  /api/clients/[id]      # Update client
DELETE /api/clients/[id]      # Delete client

GET    /api/projects          # Get all projects (with filters)
POST   /api/projects          # Create project
GET    /api/projects/[id]     # Get single project (with relations)
PATCH  /api/projects/[id]     # Update project
DELETE /api/projects/[id]     # Delete project

GET    /api/tasks             # Get all tasks (with filters)
POST   /api/tasks             # Create task
GET    /api/tasks/[id]        # Get single task (full details)
PATCH  /api/tasks/[id]        # Update task (+ change log)
DELETE /api/tasks/[id]        # Delete task
```

---

## 🔄 **Migration من Context إلى API**

### الخطوات التالية (بعد setup الـ database):

#### 1. Update DataContext.tsx

```typescript
// بدل useState:
const [clients, setClients] = useState([]);

// هنستخدم:
const [clients, setClients] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetch("/api/clients")
    .then((res) => res.json())
    .then((data) => setClients(data));
}, []);
```

#### 2. Update CRUD Functions

```typescript
// بدل:
const addClient = (client) => setClients([...clients, client]);

// هنستخدم:
const addClient = async (client) => {
  const res = await fetch("/api/clients", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(client),
  });
  const newClient = await res.json();
  setClients([...clients, newClient]);
};
```

---

## 🔐 **NextAuth Setup (Optional - للمرحلة التالية)**

### Install:

```bash
npm install next-auth @next-auth/prisma-adapter
```

### Create `/app/api/auth/[...nextauth]/route.ts`:

```typescript
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/signin",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

---

## 📁 **File Upload Setup (Optional)**

### Using Next.js Upload:

```typescript
// /app/api/upload/route.ts
import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Save to public/uploads
  const filename = `${Date.now()}-${file.name}`;
  const filepath = path.join(process.cwd(), "public/uploads", filename);

  await writeFile(filepath, buffer);

  return NextResponse.json({
    url: `/uploads/${filename}`,
    name: file.name,
  });
}
```

---

## ⚡ **Quick Start Commands**

```bash
# 1. Setup .env
cp .env.example .env
# ثم عدّل DATABASE_URL

# 2. Generate Prisma Client
npx prisma generate

# 3. Create database tables
npx prisma migrate dev --name init

# 4. (Optional) Open Prisma Studio
npx prisma studio

# 5. Run development server
npm run dev
```

---

## 🎯 **What's Next**

### مرحلة 1: Database Setup (الآن)

```
✅ Prisma schema created
✅ API routes created
✅ .env.example created
⏳ Setup database (you need to do this)
⏳ Run migrations
⏳ Test APIs
```

### مرحلة 2: Frontend Integration (بعد الـ database)

```
⏳ Update DataContext to use APIs
⏳ Add loading states
⏳ Add error handling
⏳ Test all CRUD operations
```

### مرحلة 3: Authentication (اختياري)

```
⏳ Setup NextAuth
⏳ Create login/signup pages
⏳ Protect routes
⏳ Add user management
```

### مرحلة 4: Advanced (للمستقبل)

```
⏳ File uploads
⏳ Real-time features
⏳ Email notifications
⏳ Deploy to production
```

---

## 📊 **Database Options Comparison**

| Option               | Setup Time | Cost     | Difficulty  | Recommended  |
| -------------------- | ---------- | -------- | ----------- | ------------ |
| **Supabase**         | 2 mins     | Free→$25 | ⭐ Easy     | ✅ Yes       |
| **Neon.tech**        | 1 min      | Free→$20 | ⭐ Easy     | ✅ Yes       |
| **Railway**          | 3 mins     | $5+      | ⭐⭐ Medium | ✅ Good      |
| **Local PostgreSQL** | 10 mins    | Free     | ⭐⭐⭐ Hard | For dev only |

**توصيتي: Supabase** ⭐

- سهل جداً
- Free tier سخي
- Dashboard جميل
- Auth مدمج
- Storage مدمج
- Real-time مدمج

---

## 🎓 **Example: Using the APIs**

### Test API in Browser:

```
http://localhost:3000/api/clients
→ Should return [] (empty array initially)
```

### Test with code:

```typescript
// Fetch clients
const response = await fetch("/api/clients");
const clients = await response.json();
console.log(clients);

// Create client
const response = await fetch("/api/clients", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: "Test Client",
    contactPerson: "John Doe",
    phone: "+1234567890",
    email: "test@example.com",
    company: "Test Co",
    notes: "Test notes",
  }),
});
const newClient = await response.json();
```

---

## 🔒 **Security Notes**

### Current Status:

```
⚠️ No authentication yet
⚠️ APIs are public
⚠️ No rate limiting
⚠️ No validation (basic)
```

### للـ Production:

```
✅ Add NextAuth
✅ Protect all routes
✅ Add input validation (Zod)
✅ Add rate limiting
✅ Add CORS configuration
✅ Use environment secrets
✅ Enable HTTPS
```

---

## 📝 **Next Actions**

### للبدء الآن:

```bash
# 1. اختر database provider (Supabase موصى به)
https://supabase.com → Create project

# 2. انسخ connection string
Settings → Database → Connection String

# 3. أضفه للـ .env
DATABASE_URL="postgresql://..."

# 4. Run migrations
npx prisma migrate dev --name init

# 5. Check Prisma Studio
npx prisma studio
→ http://localhost:5555

# 6. Test API
http://localhost:3000/api/clients

# 7. ✅ Backend Ready!
```

---

## 🎯 **Migration Roadmap**

### Phase 1: Setup (1 day)

```
✅ Install packages
✅ Create schema
✅ Create API routes
⏳ Setup database
⏳ Run migrations
⏳ Test APIs
```

### Phase 2: Integration (2-3 days)

```
⏳ Update DataContext
⏳ Replace dummy data with API calls
⏳ Add loading states
⏳ Add error handling
⏳ Test all features
```

### Phase 3: Authentication (2-3 days)

```
⏳ Setup NextAuth
⏳ Create auth pages
⏳ Protect routes
⏳ Add role-based access
```

### Phase 4: Advanced (1 week)

```
⏳ File uploads
⏳ Real comments
⏳ Real notifications
⏳ Email integration
```

---

## 💡 **Pro Tips**

### للتطوير:

```
1. استخدم Prisma Studio لمشاهدة البيانات
2. استخدم Thunder Client / Postman لاختبار APIs
3. check Console للأخطاء
4. استخدم npx prisma migrate reset لإعادة البناء
```

### للـ Production:

```
1. استخدم environment variables للأسرار
2. Enable SSL
3. Add rate limiting
4. Use CDN للملفات
5. Monitor errors (Sentry)
6. Backup database regularly
```

---

## 🎉 **Conclusion**

### ✅ **Backend Structure Ready!**

**الموجود:**

- ✅ Complete Prisma schema
- ✅ API routes (Clients, Projects, Tasks)
- ✅ Configuration files
- ✅ Documentation

**المطلوب منك:**

1. Setup database (Supabase موصى به)
2. Run migrations
3. Test APIs

**المدة:**

- Setup: 10-30 minutes
- Testing: 1 hour
- Integration: 1-2 days

**النتيجة:**
**Full-stack CRM! 🚀**

---

**🚀 ابدأ الآن:**

```bash
# اختر database
https://supabase.com

# Setup
cp .env.example .env
# عدّل .env

# Migrate
npx prisma migrate dev

# Test
npx prisma studio
```

**🎊 Backend جاهز! ✨**
