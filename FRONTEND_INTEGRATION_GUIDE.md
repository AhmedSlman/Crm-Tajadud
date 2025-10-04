# 🎨 دليل تكامل الفرونت إند - CRM System

## 🚀 التحديثات الجديدة

تم تحديث الفرونت إند بالكامل للتكامل مع Laravel Backend وإزالة جميع البيانات الوهمية.

## 📁 الملفات المحدثة

### 1. **API Client** (`/src/lib/api.ts`)

```typescript
// استخدام API الحقيقي
import { authAPI, usersAPI, projectsAPI } from "@/lib/api";

// مثال على الاستخدام
const user = await authAPI.login({ email, password });
const projects = await projectsAPI.getAll();
```

### 2. **AuthContext** (`/src/context/AuthContext.tsx`)

```typescript
// تم إزالة mock functions واستخدام APIs حقيقية
const login = async (credentials) => {
  const response = await authAPI.login(credentials);
  setUser(response);
};
```

### 3. **Configuration** (`/src/lib/config.ts`)

```typescript
export const config = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001/api",
  },
  // ... باقي الإعدادات
};
```

### 4. **Client Login** (`/src/app/client-login/page.tsx`)

```typescript
// استخدام API بدلاً من dummy data
const client = await authAPI.clientLogin(formData);
```

## 🔧 الإعداد والتشغيل

### 1. **متغيرات البيئة**

أنشئ ملف `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8001/api
NEXT_PUBLIC_APP_NAME="CRM System"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NODE_ENV=development
```

### 2. **تثبيت المتطلبات**

```bash
npm install
# أو
yarn install
```

### 3. **تشغيل التطبيق**

```bash
npm run dev
# أو
yarn dev
```

## 🔐 نظام المصادقة

### Team Members Authentication

```typescript
// تسجيل الدخول
const user = await authAPI.login({
  email: "admin@crm.com",
  password: "admin123",
});

// التحقق من التوكن
const validation = await authAPI.validateToken();

// تسجيل الخروج
await authAPI.logout();
```

### Client Authentication

```typescript
// تسجيل دخول العميل
const client = await authAPI.clientLogin({
  email: "mohamed@techstart.com",
  password: "123456",
});

// استخدام client token
const validation = await authAPI.validateToken(true);
```

## 🛡️ Protected Routes

### Team Routes

```typescript
// استخدام ProtectedRoute
<ProtectedRoute requireAdmin={true}>
  <AdminPanel />
</ProtectedRoute>

// أو بصلاحيات محددة
<ProtectedRoute allowedRoles={['admin', 'account-manager']}>
  <ClientsPage />
</ProtectedRoute>
```

### Client Routes

```typescript
// استخدام ClientProtectedRoute
<ClientProtectedRoute>
  <ClientDashboard />
</ClientProtectedRoute>
```

## 📊 استخدام APIs

### Users Management

```typescript
// الحصول على جميع المستخدمين
const users = await usersAPI.getAll();

// الموافقة على مستخدم
await usersAPI.approve(userId);

// تعليق مستخدم
await usersAPI.suspend(userId);
```

### Projects Management

```typescript
// إنشاء مشروع جديد
const project = await projectsAPI.create({
  name: "مشروع جديد",
  client_id: 1,
  start_date: "2025-01-01",
  end_date: "2025-12-31",
});

// رفع ملف
await projectsAPI.uploadFile(projectId, file, "اسم الملف");
```

### Tasks Management

```typescript
// الحصول على مهامي
const myTasks = await tasksAPI.getMyTasks();

// إضافة تعليق
await tasksAPI.addComment(taskId, "تعليق جديد");

// إضافة مرفق
await tasksAPI.addAttachment(taskId, file);
```

## 🎨 UI Components

### Error Handling

```typescript
try {
  await authAPI.login(credentials);
} catch (error) {
  toast.error(error.message);
  setError(error.message);
}
```

### Loading States

```typescript
const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  setLoading(true);
  try {
    await api.call();
  } finally {
    setLoading(false);
  }
};
```

## 📱 Responsive Design

### Breakpoints

```css
/* Mobile First */
.container {
  @apply px-4;
}

/* Tablet */
@media (min-width: 768px) {
  .container {
    @apply px-6;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .container {
    @apply px-8;
  }
}
```

## 🔄 State Management

### AuthContext Usage

```typescript
const { user, isAuthenticated, isAdmin, login, logout } = useAuth();

// التحقق من الصلاحيات
if (isAdmin) {
  // عرض محتوى الأدمن
}

// تسجيل الخروج
const handleLogout = async () => {
  await logout();
};
```

### Local Storage Management

```typescript
// يتم إدارتها تلقائياً في API client
// التوكنات والبيانات تُحفظ وتُحذف تلقائياً
```

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### Integration Tests

```bash
npm run test:integration
```

### E2E Tests

```bash
npm run test:e2e
```

## 🚀 Build & Deploy

### Development Build

```bash
npm run build
npm run start
```

### Production Optimization

```bash
# تحسين الصور
npm run optimize-images

# تحليل الحزمة
npm run analyze
```

## 📊 Performance

### Code Splitting

```typescript
// تحميل كسول للمكونات
const AdminPanel = lazy(() => import("./AdminPanel"));

// استخدام Suspense
<Suspense fallback={<LoadingSpinner />}>
  <AdminPanel />
</Suspense>;
```

### Image Optimization

```typescript
import Image from "next/image";

<Image src="/avatar.jpg" alt="User Avatar" width={50} height={50} priority />;
```

## 🔍 Debugging

### API Debugging

```typescript
// تفعيل debug logs في development
if (config.dev.enableDebugLogs) {
  console.log("API Response:", response);
}
```

### Network Issues

```typescript
// معالجة أخطاء الشبكة
const handleResponse = async (response) => {
  if (!response.ok) {
    if (response.status === 401) {
      // إعادة توجيه لتسجيل الدخول
      router.push("/auth/login");
    }
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
};
```

## 📝 Best Practices

### 1. **Error Boundaries**

```typescript
class ErrorBoundary extends Component {
  componentDidCatch(error, errorInfo) {
    console.error("Error caught:", error, errorInfo);
  }
}
```

### 2. **Loading States**

```typescript
// استخدام loading states في جميع العمليات
const [loading, setLoading] = useState(false);
```

### 3. **Form Validation**

```typescript
// تحقق من البيانات قبل الإرسال
const validate = (data) => {
  const errors = {};
  if (!data.email) errors.email = "البريد الإلكتروني مطلوب";
  return errors;
};
```

## 🎯 الخطوات التالية

### المميزات المخططة:

- [ ] Real-time notifications
- [ ] Advanced search and filters
- [ ] Drag & drop file upload
- [ ] Dark mode support
- [ ] PWA capabilities
- [ ] Offline support

## 🆘 المساعدة والدعم

### مشاكل شائعة:

#### 1. **API Connection Issues**

```bash
# تحقق من تشغيل Laravel server
curl http://localhost:8001/api/health
```

#### 2. **CORS Errors**

```typescript
// تأكد من إعداد CORS في Laravel
// وأن الـ URL صحيح في config
```

#### 3. **Authentication Issues**

```typescript
// مسح البيانات المحلية
localStorage.clear();
// إعادة تسجيل الدخول
```

## ✅ Checklist للتطوير

- [x] إزالة جميع mock data
- [x] تكامل APIs الحقيقية
- [x] تحديث AuthContext
- [x] إضافة error handling
- [x] تحسين UI/UX
- [x] إضافة loading states
- [x] تحديث التوثيق

## 🎉 النتيجة النهائية

الفرونت إند الآن:

- ✅ متكامل بالكامل مع Laravel Backend
- ✅ يستخدم APIs حقيقية فقط
- ✅ آمن ومحمي
- ✅ سريع ومحسن
- ✅ سهل الصيانة والتطوير

النظام جاهز للاستخدام! 🚀
