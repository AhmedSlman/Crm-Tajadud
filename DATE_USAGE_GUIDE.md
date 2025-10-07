# 🕐 دليل استخدام التواريخ والأوقات (توقيت مصر)

## ⚙️ الإعدادات المطبقة

### Backend (Laravel):

- ✅ Timezone: `Africa/Cairo`
- ✅ موقع الإعداد: `crm-laravel/config/app.php`

### Frontend (Next.js):

- ✅ Date Utilities مع دعم توقيت مصر
- ✅ موقع الملفات:
  - `src/lib/utils.ts` - الدوال الأساسية
  - `src/lib/date-config.ts` - الإعدادات

---

## 📝 كيفية الاستخدام

### 1️⃣ **تنسيق التاريخ فقط**

```typescript
import { formatDate } from '@/lib/utils';

// ❌ القديم (بدون timezone):
<span>{new Date(task.dueDate).toLocaleDateString()}</span>

// ✅ الجديد (مع توقيت مصر):
<span>{formatDate(task.dueDate)}</span>
// Output: "Dec 25, 2024"
```

### 2️⃣ **تنسيق التاريخ والوقت**

```typescript
import { formatDateTime } from '@/lib/utils';

// ❌ القديم:
<span>{new Date(notification.createdAt).toLocaleString()}</span>

// ✅ الجديد:
<span>{formatDateTime(notification.createdAt)}</span>
// Output: "Dec 25, 2024, 02:30 PM"
```

### 3️⃣ **تنسيق الوقت فقط**

```typescript
import { formatTime } from "@/lib/utils";

<span>{formatTime(task.createdAt)}</span>;
// Output: "02:30 PM"
```

### 4️⃣ **تنسيق التاريخ القصير**

```typescript
import { formatShortDate } from "@/lib/utils";

<span>{formatShortDate(task.dueDate)}</span>;
// Output: "12/25/2024"
```

### 5️⃣ **تنسيق كامل مع المنطقة الزمنية**

```typescript
import { formatFullDateTime } from "@/lib/utils";

<span>{formatFullDateTime(task.createdAt)}</span>;
// Output: "Mon, Dec 25, 2024, 02:30:45 PM GMT+2"
```

### 6️⃣ **تنسيق بالعربي (اختياري)**

```typescript
import { formatDateArabic } from "@/lib/utils";

<span>{formatDateArabic(task.dueDate)}</span>;
// Output: "٢٥ ديسمبر ٢٠٢٤"
```

---

## 🔄 أمثلة عملية من المشروع

### مثال 1: في Dashboard

```typescript
// قبل:
<span>{new Date(task.dueDate).toLocaleDateString()}</span>;

// بعد:
import { formatDate } from "@/lib/utils";
<span>{formatDate(task.dueDate)}</span>;
```

### مثال 2: في Tasks Page

```typescript
// قبل:
<TableCell>
  <div className="flex items-center gap-2">
    <Calendar size={16} className="text-gray-400" />
    <span className="text-white">
      {new Date(task.dueDate).toLocaleDateString()}
    </span>
  </div>
</TableCell>;

// بعد:
import { formatDate } from "@/lib/utils";
<TableCell>
  <div className="flex items-center gap-2">
    <Calendar size={16} className="text-gray-400" />
    <span className="text-white">{formatDate(task.dueDate)}</span>
  </div>
</TableCell>;
```

### مثال 3: في Notifications

```typescript
// قبل:
<span className="text-xs text-gray-400">
  {new Date(notification.createdAt).toLocaleString()}
</span>;

// بعد:
import { formatDateTime } from "@/lib/utils";
<span className="text-xs text-gray-400">
  {formatDateTime(notification.createdAt)}
</span>;
```

### مثال 4: في Reports

```typescript
// قبل:
<div className="mt-2 text-xs text-gray-400">
  Due: {new Date(project.endDate).toLocaleDateString()}
</div>;

// بعد:
import { formatDate } from "@/lib/utils";
<div className="mt-2 text-xs text-gray-400">
  Due: {formatDate(project.endDate)}
</div>;
```

---

## 🔍 الدوال المتاحة (من `@/lib/utils`)

| الدالة                     | الاستخدام           | مثال الخرج                             |
| -------------------------- | ------------------- | -------------------------------------- |
| `formatDate(date)`         | تاريخ فقط           | "Dec 25, 2024"                         |
| `formatDateTime(date)`     | تاريخ ووقت          | "Dec 25, 2024, 02:30 PM"               |
| `formatTime(date)`         | وقت فقط             | "02:30 PM"                             |
| `formatShortDate(date)`    | تاريخ قصير          | "12/25/2024"                           |
| `formatFullDateTime(date)` | تاريخ كامل + منطقة  | "Mon, Dec 25, 2024, 02:30:45 PM GMT+2" |
| `formatDateArabic(date)`   | تاريخ بالعربي       | "٢٥ ديسمبر ٢٠٢٤"                       |
| `toEgyptTime(date)`        | تحويل لتوقيت مصر    | Date object                            |
| `getDaysUntil(date)`       | عدد الأيام المتبقية | 5                                      |
| `getRelativeTime(date)`    | وقت نسبي            | "Due in 5 days"                        |

---

## 📍 الملفات التي تحتاج تحديث

ابحث في المشروع عن الاستخدامات التالية وقم بتحديثها:

```bash
# ابحث عن:
.toLocaleDateString()
.toLocaleString()
.toLocaleTimeString()

# واستبدلها بـ:
formatDate()
formatDateTime()
formatTime()
```

### الصفحات الرئيسية التي تحتاج تحديث:

1. ✅ `src/app/page.tsx` - Dashboard
2. ✅ `src/app/tasks/page.tsx`
3. ✅ `src/app/campaigns/page.tsx`
4. ✅ `src/app/content/page.tsx`
5. ✅ `src/app/reports/page.tsx`
6. ✅ `src/app/calendar/page.tsx`
7. ✅ `src/components/Topbar.tsx` - Notifications

---

## 🚀 التطبيق السريع

### خطوة 1: استورد الدوال

```typescript
import { formatDate, formatDateTime, formatTime } from "@/lib/utils";
```

### خطوة 2: استبدل الكود القديم

```typescript
// ❌ القديم
{
  new Date(date).toLocaleDateString();
}

// ✅ الجديد
{
  formatDate(date);
}
```

### خطوة 3: تأكد من النتيجة

- افتح الصفحة في المتصفح
- تأكد من ظهور التاريخ والوقت بتوقيت مصر الصحيح

---

## ⚠️ ملاحظات مهمة

1. **جميع التواريخ من الـ API** سيتم تحويلها تلقائياً لتوقيت مصر
2. **Laravel Backend** مضبوط على `Africa/Cairo` timezone
3. **كل الدوال** تدعم `string | Date` كـ input
4. **استخدم** `formatDateTime()` للتواريخ مع الوقت
5. **استخدم** `formatDate()` للتواريخ فقط
6. **للواجهة العربية** استخدم `formatDateArabic()`

---

## 📧 للدعم

إذا واجهت أي مشكلة في التواريخ، تأكد من:

- ✅ استيراد الدالة الصحيحة من `@/lib/utils`
- ✅ التاريخ صحيح وليس `null` أو `undefined`
- ✅ Laravel timezone مضبوط على `Africa/Cairo`
