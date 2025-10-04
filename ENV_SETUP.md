# ⚙️ إعداد Environment Variables

## 📋 الملف المطلوب

أنشئ ملف `.env.local` في مجلد `crm-app`:

```bash
cd crm-app
cat > .env.local << 'EOF'
# Laravel Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:8001/api

# App Configuration
NEXT_PUBLIC_APP_NAME="CRM System"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# Development Settings
NODE_ENV=development
EOF
```

## 🚀 أو بطريقة أبسط:

```bash
cd crm-app
echo "NEXT_PUBLIC_API_URL=http://localhost:8001/api" > .env.local
```

## ✅ التحقق:

```bash
# تحقق من وجود الملف
ls -la crm-app/.env.local

# اعرض المحتوى
cat crm-app/.env.local
```

## 📝 ملاحظة:

الملف `.env.local` مُستثنى من Git تلقائياً، لذلك لن يُرفع للـ repository.

---

_ملف إعداد سريع للـ Environment Variables_
