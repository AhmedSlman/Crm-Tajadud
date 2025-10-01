# 🚀 دليل البدء السريع - نظام CRM

## ⚡ البدء في 3 دقائق

### 1️⃣ **تشغيل المشروع**

```bash
cd crm-app
npm install
npm run dev
```

افتح المتصفح على: `http://localhost:3000`

---

### 2️⃣ **تسجيل الدخول**

سيتم توجيهك تلقائياً لصفحة Login

**استخدم أحد الحسابات التجريبية:**

#### 👑 **Admin Account**

```
Email: admin@crm.com
Password: admin123
```

- الصلاحيات الكاملة
- يستطيع الموافقة على الموظفين الجدد
- يرى صفحة Users Management

#### 🎨 **Graphic Designer**

```
Email: ahmed@crm.com
Password: 123456
```

- حساب موظف نشط
- يستطيع العمل على المهام

#### 📱 **Social Media (Pending)**

```
Email: sara@crm.com
Password: 123456
```

- حساب في انتظار الموافقة
- سيرى صفحة "Pending Approval"

---

### 3️⃣ **تجربة النظام**

#### **كـ Admin:**

1. سجل دخول بحساب Admin
2. اذهب لصفحة `Users` من القائمة الجانبية
3. ستجد قسم "Pending Approvals" في الأعلى
4. جرب:
   - ✅ Approve موظف
   - ❌ Reject موظف
   - 🚫 Suspend موظف نشط

#### **كـ Employee:**

1. سجل دخول بحساب ahmed@crm.com
2. تصفح Dashboard
3. افتح Tasks
4. جرب إنشاء Task جديدة

#### **تسجيل موظف جديد:**

1. اضغط "Create New Account" في صفحة Login
2. املأ البيانات:
   - Name: Your Name
   - Email: your@email.com
   - Phone: +20 xxx xxx xxxx
   - Role: اختر دورك
   - Password: 123456
3. بعد التسجيل، ستذهب لصفحة "Pending Approval"
4. سجل دخول كـ Admin ووافق على الحساب الجديد

---

## 📱 صفحات النظام

| الصفحة        | الوصف                         | الرابط       |
| ------------- | ----------------------------- | ------------ |
| **Dashboard** | الصفحة الرئيسية مع الإحصائيات | `/`          |
| **Clients**   | إدارة العملاء                 | `/clients`   |
| **Projects**  | إدارة المشاريع                | `/projects`  |
| **Tasks**     | إدارة المهام                  | `/tasks`     |
| **Campaigns** | الحملات الإعلانية             | `/campaigns` |
| **Content**   | تخطيط المحتوى                 | `/content`   |
| **Calendar**  | التقويم الشهري                | `/calendar`  |
| **Reports**   | التقارير والإحصائيات          | `/reports`   |
| **Users**     | إدارة المستخدمين (Admin فقط)  | `/users`     |

---

## 🎯 المميزات الأساسية

### ✅ **Authentication System**

- ✓ Login/Register
- ✓ Approval workflow للموظفين
- ✓ Role-based access
- ✓ Protected routes

### 📊 **Dashboard**

- ✓ إحصائيات سريعة
- ✓ Active Projects
- ✓ Recent Tasks
- ✓ Content & Campaigns overview

### 👥 **Clients Management**

- ✓ CRUD كامل
- ✓ Search & Filters
- ✓ Export to CSV
- ✓ Linked Projects

### 📁 **Projects Management**

- ✓ Grid view مع cards
- ✓ Progress tracking
- ✓ Filters by status/client
- ✓ Project details page

### ✅ **Tasks Management**

- ✓ List & Kanban views
- ✓ Bulk actions (select multiple)
- ✓ Filters متعددة
- ✓ Progress tracking
- ✓ Priority & Status management

### 📢 **Campaigns**

- ✓ Multiple campaign types
- ✓ Budget tracking
- ✓ KPIs monitoring
- ✓ Status management

### 📝 **Content Planning**

- ✓ Content calendar
- ✓ Workflow states
- ✓ Priority management
- ✓ Publishing scheduler

### 📅 **Social Calendar**

- ✓ Monthly view
- ✓ Content & Tasks scheduling
- ✓ Status indicators
- ✓ Month navigation

### 📊 **Reports**

- ✓ Filters by client/project
- ✓ Comprehensive statistics
- ✓ Performance metrics

### 👤 **Users Management (Admin)**

- ✓ Approve/Reject employees
- ✓ Suspend/Activate users
- ✓ User details
- ✓ Search & filters

---

## ⚙️ Quick Actions (Ctrl+K)

اضغط `Ctrl+K` (أو `Cmd+K` في Mac) لفتح Quick Actions

**اختصارات سريعة:**

- `T` → New Task
- `P` → New Project
- `C` → New Client
- `M` → New Campaign
- `N` → New Content
- `D` → Dashboard
- `R` → Reports

---

## 🎨 الثيم والتصميم

**الألوان:**

- Background: `#0c081e` (Dark purple)
- Primary: `#563EB7` (Purple)
- Hover: `#6d4dd4`

**المميزات:**

- ✓ Gradient backgrounds
- ✓ Smooth animations
- ✓ Hover effects
- ✓ Glass morphism
- ✓ Custom scrollbar
- ✓ Responsive design

---

## 🔑 Keyboard Shortcuts

| Shortcut | Action               |
| -------- | -------------------- |
| `Ctrl+K` | فتح Quick Actions    |
| `Esc`    | إغلاق Modal/Dropdown |

---

## 💾 البيانات التجريبية

النظام يحتوي على بيانات تجريبية:

- ✓ 7 Users (مختلف الأدوار والحالات)
- ✓ 3 Clients
- ✓ 4 Projects
- ✓ 8 Tasks
- ✓ 4 Campaigns
- ✓ 8 Content items

**ملاحظة:** البيانات حالياً في الـ Memory، عند Refresh الصفحة ستعود للحالة الأولية.

---

## 🛠️ للمطورين

### **إضافة صفحة محمية جديدة:**

```tsx
"use client";

import ProtectedRoute from "@/components/ProtectedRoute";

export default function MyPage() {
  return (
    <ProtectedRoute>
      <div>My Protected Content</div>
    </ProtectedRoute>
  );
}
```

### **صفحة للـ Admin فقط:**

```tsx
<ProtectedRoute requireAdmin={true}>
  <AdminOnlyContent />
</ProtectedRoute>
```

### **صفحة لأدوار محددة:**

```tsx
<ProtectedRoute allowedRoles={["graphic-designer", "video-editor"]}>
  <DesignContent />
</ProtectedRoute>
```

### **استخدام Auth في Component:**

```tsx
import { useAuth } from "@/context/AuthContext";

function MyComponent() {
  const { user, isAdmin, logout } = useAuth();

  return (
    <div>
      <p>Welcome {user?.name}</p>
      {isAdmin && <AdminFeature />}
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

---

## 📚 الملفات المهمة

### **Authentication:**

- `src/context/AuthContext.tsx` - Auth state management
- `src/components/ProtectedRoute.tsx` - Route protection
- `src/app/providers.tsx` - Context providers
- `src/app/auth/login/page.tsx` - Login page
- `src/app/auth/register/page.tsx` - Register page
- `src/app/auth/pending/page.tsx` - Pending approval page

### **Components:**

- `src/components/Sidebar.tsx` - Navigation
- `src/components/Topbar.tsx` - Top bar with user menu
- `src/components/Button.tsx` - Reusable button
- `src/components/Card.tsx` - Card container
- `src/components/Modal.tsx` - Modal dialogs
- `src/components/Table.tsx` - Data tables

### **Data:**

- `src/context/DataContext.tsx` - Global state
- `src/lib/dummy-data.ts` - Demo data
- `src/types/index.ts` - TypeScript types

---

## 🐛 المشاكل الشائعة

### **1. الصفحة تعيد توجيهي للـ Login باستمرار**

- تأكد من تسجيل الدخول بحساب صحيح
- تحقق من الـ Console للأخطاء
- امسح localStorage وحاول مرة أخرى

### **2. لا أستطيع الدخول كـ Sara (Pending account)**

- هذا طبيعي! الحساب pending
- سجل دخول كـ Admin أولاً ووافق على الحساب

### **3. صفحة Users لا تظهر**

- هذه الصفحة للـ Admin فقط
- سجل دخول بحساب admin@crm.com

---

## 🎯 الخطوة التالية

بعد التجربة، يمكنك:

1. **ربط Backend:**

   - راجع `AUTH_SYSTEM.md` للتفاصيل
   - استبدل Mock functions بـ API calls

2. **تخصيص الثيم:**

   - عدل `globals.css`
   - غير الألوان في `--primary`

3. **إضافة مميزات:**
   - Password reset
   - Email notifications
   - 2FA authentication
   - Activity logs

---

## 📞 الدعم

للأسئلة والمشاكل:

- راجع `AUTH_SYSTEM.md` للتوثيق الكامل
- راجع `README.md` للمعلومات العامة

---

**Happy Coding! 🚀**
