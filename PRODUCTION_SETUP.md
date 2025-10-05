# 🚀 إعداد الفرونت إند للإنتاج

## ✅ تم تحديث API URL

تم تحديث الـ Base URL ليشير إلى الخادم المباشر:

```
https://crm-api.tajadud.org/public/api
```

---

## 📝 التغييرات المُنفذة

### 1. **تحديث `config.ts`**

**الملف:** `src/lib/config.ts`

```typescript
api: {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://crm-api.tajadud.org/public/api',
  timeout: 10000,
}
```

### 2. **إنشاء `env.production.example`**

**الملف:** `env.production.example`

```env
NEXT_PUBLIC_API_URL=https://crm-api.tajadud.org/public/api
NEXT_PUBLIC_APP_NAME="CRM System"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NODE_ENV=production
```

---

## 🔧 خطوات الإعداد

### للتطوير المحلي (Local Development):

إذا أردت الاتصال بالـ API المباشر من جهازك:

```bash
cd crm-app

# أنشئ ملف .env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=https://crm-api.tajadud.org/public/api
NEXT_PUBLIC_APP_NAME="CRM System"
NEXT_PUBLIC_APP_VERSION="1.0.0"
EOF

# شغّل المشروع
npm run dev
```

### للإنتاج (Production Build):

```bash
cd crm-app

# أنشئ ملف .env.production
cat > .env.production << 'EOF'
NEXT_PUBLIC_API_URL=https://crm-api.tajadud.org/public/api
NEXT_PUBLIC_APP_NAME="CRM System"
NEXT_PUBLIC_APP_VERSION="1.0.0"
NODE_ENV=production
EOF

# بناء المشروع
npm run build

# تشغيل النسخة المُنتجة
npm start
```

---

## 🌐 رفع الفرونت إند

### الخيار 1: Vercel (الأسهل) ⭐

1. **ادفع المشروع إلى GitHub:**

   ```bash
   cd crm-app
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO
   git push -u origin main
   ```

2. **اربط مع Vercel:**
   - اذهب إلى [vercel.com](https://vercel.com)
   - انقر **New Project**
   - اختر الـ Repository
   - أضف Environment Variables:
     - `NEXT_PUBLIC_API_URL` = `https://crm-api.tajadud.org/public/api`
   - انقر **Deploy**

### الخيار 2: Netlify

1. **بناء المشروع:**

   ```bash
   cd crm-app
   npm run build
   ```

2. **رفع على Netlify:**
   - اذهب إلى [netlify.com](https://netlify.com)
   - اسحب مجلد `.next` أو اربط مع GitHub
   - أضف Environment Variables

### الخيار 3: Hostinger (نفس الخادم)

إذا أردت رفع الفرونت على نفس خادم Hostinger:

```bash
# 1. بناء المشروع
cd crm-app
npm run build

# 2. رفع المجلدات التالية عبر FTP:
# - .next/
# - public/
# - package.json
# - next.config.ts

# 3. على الخادم، شغّل:
npm install --production
npm start
```

---

## 🧪 اختبار الاتصال

### 1. اختبار API من المتصفح:

افتح:

```
https://crm-api.tajadud.org/public/api/auth/login
```

يجب أن ترى رسالة JSON (حتى لو خطأ، المهم أن API يستجيب)

### 2. اختبار من الفرونت إند:

```bash
cd crm-app
npm run dev
```

ثم:

1. افتح `http://localhost:3000`
2. اذهب إلى صفحة Login
3. جرب تسجيل الدخول بـ:
   - Email: `admin@crm.com`
   - Password: `admin123`

إذا نجح، معناها الاتصال يعمل! ✅

### 3. فحص Console:

افتح Developer Tools (F12) → Console

ابحث عن:

- ✅ Requests إلى `https://crm-api.tajadud.org/public/api`
- ❌ أي CORS Errors

---

## 🔒 إعدادات CORS في الباك إند

تأكد من أن الباك إند يسمح بطلبات من نطاق الفرونت إند.

في ملف `.env` على الخادم:

```env
# إذا الفرونت على Vercel
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://crm-api.tajadud.org

# إذا الفرونت على Netlify
CORS_ALLOWED_ORIGINS=https://your-frontend.netlify.app,https://crm-api.tajadud.org

# إذا الفرونت على نفس النطاق
CORS_ALLOWED_ORIGINS=https://tajadud.org,https://www.tajadud.org,https://crm-api.tajadud.org
```

ثم على الخادم:

```bash
php artisan config:cache
```

---

## 📊 الحالة الحالية

| المكون                  | الحالة          | الملاحظات                              |
| ----------------------- | --------------- | -------------------------------------- |
| **Backend API**         | ✅ مرفوع        | https://crm-api.tajadud.org/public/api |
| **Frontend Config**     | ✅ مُحدّث       | يشير إلى API المباشر                   |
| **Environment Files**   | ✅ جاهز         | env.production.example                 |
| **CORS**                | ⚠️ يحتاج تحديث  | أضف نطاق الفرونت في `.env`             |
| **Frontend Deployment** | ⏳ قيد الانتظار | جاهز للرفع                             |

---

## 🐛 حل المشاكل الشائعة

### 1. CORS Error

**المشكلة:**

```
Access to fetch at 'https://crm-api.tajadud.org/public/api/auth/login'
from origin 'http://localhost:3000' has been blocked by CORS policy
```

**الحل:**

في الباك إند `.env`:

```env
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://your-frontend-domain.com
```

ثم:

```bash
php artisan config:cache
```

### 2. API Not Found (404)

**المشكلة:** جميع الطلبات تعطي 404

**الحل:**

- تحقق من Document Root يشير إلى `/public`
- تحقق من `.htaccess` موجود في `public/`
- تحقق من URL صحيح: `https://crm-api.tajadud.org/public/api` (مع `/api` في النهاية)

### 3. 500 Internal Server Error

**الحل:**

```bash
# على الخادم
chmod -R 775 storage bootstrap/cache
php artisan config:cache
```

تحقق من `storage/logs/laravel.log` للتفاصيل

### 4. Token Validation Failed

**المشكلة:** تسجيل الدخول يعمل لكن الطلبات الأخرى تفشل

**الحل:**

- تحقق من أن Token يُحفظ في localStorage
- تحقق من Headers في الطلبات تحتوي على `Authorization: Bearer TOKEN`
- تحقق من `SANCTUM_STATEFUL_DOMAINS` في `.env`

---

## 📚 الملفات المُحدّثة

1. ✅ `src/lib/config.ts` - تحديث baseUrl
2. ✅ `env.production.example` - ملف البيئة للإنتاج
3. ✅ `PRODUCTION_SETUP.md` - هذا الملف

---

## 🎯 الخطوات التالية

### 1. اختبر محلياً:

```bash
cd crm-app
npm run dev
# افتح http://localhost:3000
# جرب تسجيل الدخول
```

### 2. إذا نجح، ارفع الفرونت:

- Vercel (الأسهل)
- Netlify
- أو Hostinger

### 3. حدّث CORS في الباك إند:

```env
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

### 4. اختبر على الإنتاج:

- افتح الفرونت المرفوع
- جرب جميع الميزات
- تحقق من عدم وجود CORS Errors

---

## ✅ Checklist

- [x] ✅ تحديث `config.ts`
- [x] ✅ إنشاء `env.production.example`
- [ ] ⏳ اختبار محلي
- [ ] ⏳ رفع الفرونت إند
- [ ] ⏳ تحديث CORS في الباك إند
- [ ] ⏳ اختبار على الإنتاج

---

## 🎉 النتيجة

الفرونت إند الآن مُعد للاتصال بالـ API المباشر على:

```
https://crm-api.tajadud.org/public/api
```

**الخطوة التالية:** رفع الفرونت إند على Vercel/Netlify/Hostinger

---

**تم التحديث:** 5 أكتوبر 2025  
**الحالة:** جاهز للرفع ✅
