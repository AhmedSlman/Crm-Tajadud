# 🔐 نظام Authentication - دليل الاستخدام

## 📋 نظرة عامة

تم بناء نظام مصادقة كامل مع إدارة المستخدمين والموافقات. النظام يدعم:

- ✅ تسجيل دخول الموظفين
- ✅ تسجيل موظف جديد
- ✅ موافقة الأدمن على الموظفين الجدد
- ✅ أدوار مختلفة للموظفين
- ✅ صفحات محمية (Protected Routes)

---

## 👥 أنواع المستخدمين (User Roles)

### 1. **Admin** (المدير)

- الصلاحيات الكاملة
- يستطيع الموافقة على الموظفين الجدد
- يرى صفحة Users Management
- يستطيع تعيين المهام للموظفين

### 2. **Graphic Designer** (مصمم جرافيك)

- تصميم المحتوى المرئي
- إدارة المشاريع الخاصة به

### 3. **Social Media Specialist** (متخصص سوشيال ميديا)

- إدارة المحتوى على منصات التواصل
- جدولة المنشورات

### 4. **Content Writer** (كاتب محتوى)

- كتابة المقالات والمحتوى

### 5. **Video Editor** (مونتير فيديو)

- تحرير ومونتاج الفيديوهات

### 6. **Ads Specialist** (متخصص إعلانات)

- إدارة الحملات الإعلانية

### 7. **SEO Specialist** (متخصص SEO)

- تحسين محركات البحث

---

## 🔄 سير العمل (Workflow)

### 📝 **تسجيل موظف جديد**

1. الموظف يذهب لصفحة `/auth/register`
2. يملأ البيانات:
   - الاسم الكامل
   - البريد الإلكتروني
   - رقم الهاتف
   - اختيار الدور (Role)
   - كلمة المرور
3. بعد التسجيل، يتم توجيهه لصفحة `/auth/pending`
4. حالة الحساب تصبح: **Pending** (في انتظار الموافقة)

### ✅ **موافقة الأدمن**

1. الأدمن يسجل دخول
2. يذهب لصفحة `/users`
3. يرى قسم "Pending Approvals" في الأعلى
4. يستطيع:
   - ✅ **Approve**: الموافقة على الموظف
   - ❌ **Reject**: رفض الموظف

### 🔓 **تسجيل الدخول**

1. الموظف يذهب لصفحة `/auth/login`
2. يدخل Email + Password
3. **إذا كان الحساب:**
   - ✅ **Active**: يدخل النظام بنجاح
   - ⏳ **Pending**: يظهر رسالة "في انتظار الموافقة"
   - 🚫 **Suspended**: يظهر رسالة "الحساب معطل"

---

## 🎯 الصفحات

### **صفحات Auth (غير محمية)**

- `/auth/login` - تسجيل الدخول
- `/auth/register` - تسجيل موظف جديد
- `/auth/pending` - صفحة انتظار الموافقة

### **صفحات النظام (محمية)**

- `/` - Dashboard
- `/clients` - إدارة العملاء
- `/projects` - المشاريع
- `/tasks` - المهام
- `/campaigns` - الحملات
- `/content` - المحتوى
- `/calendar` - التقويم
- `/reports` - التقارير
- `/users` - **إدارة المستخدمين (Admin فقط)**

---

## 🔑 حسابات تجريبية (Demo Accounts)

### 1️⃣ **Admin Account**

```
Email: admin@crm.com
Password: admin123
Status: Active ✅
```

### 2️⃣ **Graphic Designer (Active)**

```
Email: ahmed@crm.com
Password: 123456
Status: Active ✅
```

### 3️⃣ **Social Media (Pending)**

```
Email: sara@crm.com
Password: 123456
Status: Pending ⏳
```

**ملاحظة:** في صفحة Login، اضغط "Show Demo Accounts" للدخول السريع

---

## 🛠️ المكونات الأساسية

### **1. AuthContext** (`src/context/AuthContext.tsx`)

يدير حالة المستخدم والـ Authentication

**Functions:**

```typescript
login(credentials); // تسجيل الدخول
register(data); // تسجيل موظف جديد
logout(); // تسجيل الخروج
```

**State:**

```typescript
user; // بيانات المستخدم الحالي
isAuthenticated; // هل المستخدم مسجل دخول
isAdmin; // هل المستخدم Admin
isPending; // هل الحساب في انتظار الموافقة
loading; // حالة التحميل
```

### **2. ProtectedRoute** (`src/components/ProtectedRoute.tsx`)

يحمي الصفحات من الدخول غير المصرح

**Usage:**

```tsx
// حماية عادية (أي مستخدم مسجل دخول)
<ProtectedRoute>
  <YourComponent />
</ProtectedRoute>

// حماية للـ Admin فقط
<ProtectedRoute requireAdmin={true}>
  <AdminComponent />
</ProtectedRoute>

// حماية بأدوار محددة
<ProtectedRoute allowedRoles={['graphic-designer', 'video-editor']}>
  <DesignComponent />
</ProtectedRoute>
```

### **3. Providers** (`src/app/providers.tsx`)

يوفر AuthContext و DataContext لكل التطبيق

- يخفي Sidebar/Topbar في صفحات Auth

---

## 📦 التخزين (Storage)

**حالياً:**

- البيانات تُحفظ في `localStorage`
- Token في `localStorage`

**للربط بالـ Backend:**
استبدل الدوال في `AuthContext.tsx`:

```typescript
// استبدل mockLogin بـ:
const login = async (credentials) => {
  const response = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message);
  }

  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));
  setUser(data.user);
  router.push("/");
};
```

---

## 🎨 UI Components

### **Login Page**

- Form تسجيل الدخول
- Demo accounts للاختبار السريع
- "Remember me" checkbox
- Link لصفحة التسجيل

### **Register Page**

- Form التسجيل الكامل
- اختيار الدور من قائمة
- Validation للـ Passwords
- رسالة توضيحية بأن الحساب سينتظر الموافقة

### **Pending Page**

- رسالة واضحة بانتظار الموافقة
- Timeline يوضح مراحل الموافقة
- معلومات التواصل مع الأدمن

### **Users Management (Admin)**

- قسم خاص بالـ Pending Users في الأعلى
- جدول بكل المستخدمين
- Filters حسب Status
- Actions: Approve, Reject, Suspend, Activate

---

## 🔒 الحماية (Security)

✅ **تم تطبيقه:**

- Protected Routes
- Role-based access control
- Token storage in localStorage
- Redirect لغير المصرح لهم

⚠️ **يجب إضافته عند الربط بالـ Backend:**

- JWT Token verification
- Refresh tokens
- HTTPS only
- CSRF protection
- Password hashing (bcrypt)
- Rate limiting
- Session management

---

## 📊 حالات المستخدم (User Status)

| Status        | الوصف                   | Actions                |
| ------------- | ----------------------- | ---------------------- |
| **pending**   | في انتظار موافقة الأدمن | لا يستطيع تسجيل الدخول |
| **active**    | حساب نشط ومفعّل         | يستطيع الدخول والعمل   |
| **suspended** | حساب معطل مؤقتاً        | لا يستطيع تسجيل الدخول |

---

## 🚀 التشغيل

### **Development Mode**

```bash
cd crm-app
npm install
npm run dev
```

ثم افتح: `http://localhost:3000/auth/login`

---

## 🔄 الربط بالـ Backend

### **الخطوات المطلوبة:**

1. **استبدال Mock Functions في AuthContext:**

   - `mockLogin` → API call
   - `mockRegister` → API call

2. **إضافة API Endpoints في Backend:**

   ```
   POST /api/auth/login
   POST /api/auth/register
   POST /api/auth/logout
   GET  /api/auth/me
   PUT  /api/users/:id/approve
   PUT  /api/users/:id/reject
   PUT  /api/users/:id/suspend
   ```

3. **تحديث Users Management:**

   - ربط Approve/Reject/Suspend بالـ API
   - تحديث الـ State بعد كل action

4. **إضافة Error Handling:**
   - Toast notifications للأخطاء
   - Loading states
   - Network error handling

---

## 📝 ملاحظات مهمة

### ✅ **ما تم إنجازه:**

- ✓ نظام Login/Register كامل
- ✓ Protected Routes
- ✓ Role-based access
- ✓ Users Management للـ Admin
- ✓ Pending approval workflow
- ✓ User menu مع Logout
- ✓ UI/UX احترافي

### ⏳ **ما يحتاج إضافة:**

- [ ] ربط بالـ Backend API
- [ ] Password reset functionality
- [ ] Email notifications
- [ ] 2FA (Two-factor authentication)
- [ ] Activity logs
- [ ] Profile editing

---

## 💡 Tips للتطوير

1. **للاختبار السريع:**
   استخدم Demo Accounts في صفحة Login

2. **لإضافة دور جديد:**

   - أضف في `types/index.ts` → `UserRole`
   - أضف في `AuthContext.tsx` → mock users
   - أضف في `dummy-data.ts`

3. **لحماية صفحة جديدة:**

   ```tsx
   export default function NewPage() {
     return (
       <ProtectedRoute>
         <Content />
       </ProtectedRoute>
     );
   }
   ```

4. **لجعل ميزة للـ Admin فقط:**

   ```tsx
   const { isAdmin } = useAuth();

   {
     isAdmin && <AdminFeature />;
   }
   ```

---

## 🎓 الخلاصة

نظام Authentication كامل ومتكامل مع:

- تسجيل الموظفين وانتظار الموافقة
- تحديد الأدوار المختلفة
- صلاحيات خاصة للـ Admin
- واجهة مستخدم احترافية

**الخطوة التالية:** ربط النظام بالـ Backend API! 🚀

---

**تم إنشاؤه بواسطة:** Agency CRM Team  
**التاريخ:** October 2025  
**الإصدار:** 1.0.0
