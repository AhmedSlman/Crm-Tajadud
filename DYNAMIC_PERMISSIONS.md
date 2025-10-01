# 🛡️ نظام الصلاحيات الديناميكي - Dynamic Permissions System

## ✨ ما تم إنجازه

تم بناء نظام **صلاحيات ديناميكي** يسمح للـ Admin بتحديد من يقدر يعدل أي عمود في Content Plan و Reels Plan.

---

## 🎯 المميزات

### ✅ **للـ Admin:**

- 🔧 صفحة كاملة لإدارة الصلاحيات
- 🎛️ تحكم كامل في كل Role و Column
- 💾 حفظ تلقائي في localStorage
- 🔄 Reset للصلاحيات الافتراضية
- 📊 Matrix واضح بكل الصلاحيات

### ✅ **للموظفين:**

- 👁️ يشوفوا الأعمدة الممنوعة باللون الرمادي
- ✏️ يقدروا يعدلوا الأعمدة المسموحة فقط
- 🚫 لا يمكن التعديل على الأعمدة الممنوعة

---

## 📁 الملفات الجديدة/المحدثة

### **ملفات جديدة:**

- ✨ `src/app/permissions/page.tsx` - صفحة إدارة الصلاحيات

### **ملفات محدثة:**

- ✏️ `src/types/index.ts` - إضافة RolePermission, ColumnName types
- ✏️ `src/context/DataContext.tsx` - إضافة permissions state و functions
- ✏️ `src/components/project/ContentPlanTable.tsx` - استخدام dynamic permissions
- ✏️ `src/components/Sidebar.tsx` - إضافة Permissions في القائمة

---

## 🚀 كيفية الاستخدام

### **1️⃣ الدخول لصفحة Permissions:**

1. سجل دخول كـ **Admin**
2. من القائمة الجانبية → اضغط **"Permissions"** 🛡️
3. ستفتح صفحة Permissions Management

---

### **2️⃣ تعديل الصلاحيات:**

**في صفحة Permissions ستجد جدول Matrix:**

```
Role \ Column   | Design Brief | Inspiration | Design | Text | Drive | Notes | Status
----------------|--------------|-------------|--------|------|-------|-------|--------
Admin           |      ✅      |      ✅     |   ✅   |  ✅  |  ✅   |  ✅   |   ✅
Account Manager |      ✅      |      ✅     |   ❌   |  ✅  |  ✅   |  ✅   |   ✅
Social Media    |      ✅      |      ✅     |   ❌   |  ✅  |  ❌   |  ✅   |   ✅
Graphic Designer|      ❌      |      ✅     |   ✅   |  ❌  |  ✅   |  ❌   |   ❌
... etc
```

**كيفية التعديل:**

- ✅ اللون الأخضر = Can Edit
- ❌ اللون الأحمر = Read Only
- اضغط على أي checkbox لتبديل الحالة
- Admin دائماً له كل الصلاحيات (مقفول)

---

### **3️⃣ حفظ التغييرات:**

**التغييرات تُحفظ تلقائياً في localStorage!**

لكن إذا تبي تأكد:

- اضغط زر **"Save Changes"** (يظهر لما تعدل)
- سيظهر تأكيد "Permissions saved successfully!"

---

### **4️⃣ إعادة الصلاحيات الافتراضية:**

إذا عدلت كتير وتبي ترجع للإعدادات الأصلية:

1. اضغط **"Reset to Default"**
2. سيطلب تأكيد
3. اضغط OK
4. الصلاحيات ترجع للوضع الافتراضي

---

## 🎨 الصلاحيات الافتراضية

### **Admin** 👑

- ✅ كل الأعمدة (مقفول - لا يمكن تغييره)

### **Account Manager** 👔

- ✅ Design Brief, Inspiration, Text Content, Drive Link, Notes, Status
- ❌ Design

### **Social Media** 📱

- ✅ Design Brief, Inspiration, Text Content, Notes, Status
- ❌ Design, Drive Link

### **Graphic Designer** 🎨

- ✅ Inspiration, Design, Drive Link
- ❌ Design Brief, Text Content, Notes, Status

### **Content Writer** ✍️

- ✅ Text Content فقط
- ❌ كل الباقي

### **Video Editor** 🎬

- ✅ Drive Link فقط
- ❌ كل الباقي

### **Ads Specialist** 📢

- ❌ كل الأعمدة (read-only)

### **SEO Specialist** 🔍

- ❌ كل الأعمدة (read-only)

---

## 💡 Use Cases

### **Example 1: منح Content Writer صلاحية Notes**

**الوضع الحالي:**

- Content Writer يقدر يعدل Text Content فقط

**التغيير:**

1. Admin → Permissions page
2. في صف "Content Writer"
3. في عمود "Notes"
4. اضغط على ❌ (تتحول لـ ✅)
5. Done! الآن Content Writer يقدر يضيف Notes

---

### **Example 2: منع Social Media من تعديل Status**

**الوضع الحالي:**

- Social Media يقدر يغير Status

**التغيير:**

1. Admin → Permissions page
2. في صف "Social Media"
3. في عمود "Status"
4. اضغط على ✅ (تتحول لـ ❌)
5. Done! الآن Social Media مش هيقدر يغير Status

---

## 🔄 كيف يعمل النظام

### **1. عند تحميل الصفحة:**

```
1. يتحقق من localStorage
2. إذا وجد permissions محفوظة → يستخدمها
3. إذا لم يجد → يستخدم Default Permissions
```

### **2. عند فتح Content Plan:**

```
1. يجلب Role الخاص بالمستخدم
2. لكل عمود: يتحقق من canUserEdit(role, column)
3. إذا true → يظهر Edit icon
4. إذا false → يظهر رمادي (read-only)
```

### **3. عند تعديل Permissions:**

```
1. Admin يضغط على checkbox
2. updatePermission() يُستدعى
3. الـ State يتحدث
4. يُحفظ في localStorage
5. ContentPlanTable يتحدث تلقائياً
```

---

## 📊 الـ API (في DataContext)

### **Functions:**

#### `canUserEdit(role, column)`

```typescript
// تحقق إذا Role معين يقدر يعدل Column معين
const canEdit = canUserEdit("social-media", "design-brief");
// Returns: true or false
```

#### `updatePermission(role, column, canEdit)`

```typescript
// تحديث صلاحية معينة
updatePermission("content-writer", "notes", true);
// الآن Content Writer يقدر يعدل Notes
```

#### `resetPermissions()`

```typescript
// إعادة كل الصلاحيات للوضع الافتراضي
resetPermissions();
```

---

## 🎯 Benefits

### **للـ Admin:**

- ✓ تحكم كامل بدون كود
- ✓ تغيير فوري بدون deploy
- ✓ مرونة في التنظيم
- ✓ تجربة سيناريوهات مختلفة

### **للفريق:**

- ✓ واضح من يقدر يعدل إيه
- ✓ لا يوجد أخطاء أو تضارب
- ✓ Workflow منظم
- ✓ Focus على المسؤوليات

### **للنظام:**

- ✓ Dynamic & Flexible
- ✓ Easy to maintain
- ✓ Scalable
- ✓ User-friendly

---

## 🔐 التخزين (Storage)

**حالياً:**

- الصلاحيات تُحفظ في `localStorage`
- Key: `'permissions'`
- Format: JSON array of RolePermission objects

**للـ Production:**
عند الربط بالـ Backend:

```typescript
// في DataContext.tsx
const updatePermission = async (role, column, canEdit) => {
  // Update in backend
  await fetch("/api/permissions", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role, column, canEdit }),
  });

  // Update local state
  const updated = permissions.map((p) =>
    p.role === role && p.column === column ? { ...p, canEdit } : p
  );
  setPermissions(updated);
};
```

---

## 🎨 UI Design

### **Permissions Matrix:**

- ✅ جدول تفاعلي واضح
- 🟢 Checkboxes خضراء = Can Edit
- 🔴 Checkboxes حمراء = Read Only
- 🔒 Admin مقفول (دايماً له كل الصلاحيات)
- 🎯 Hover effects جميلة

### **Stats Cards:**

- 📊 Active Permissions count
- 👥 Total Roles
- 📋 Total Columns

---

## 💼 Workflow Example

### **Scenario: تغيير صلاحيات Social Media**

**Before:**

```
Social Media:
✅ Design Brief
✅ Text Content
❌ Drive Link
```

**Admin wants to give Drive Link access:**

1. Admin → Permissions page
2. Row: Social Media
3. Column: Drive Link
4. Click ❌ → becomes ✅
5. **Instant effect!**

**After:**

```
Social Media:
✅ Design Brief
✅ Text Content
✅ Drive Link ← NEW!
```

Now Social Media can edit Drive Link in Content Plan! 🎉

---

## 🐛 Troubleshooting

### **1. التغييرات لا تظهر:**

- ✅ تأكد من حفظ التغييرات
- ✅ Refresh صفحة Content Plan
- ✅ تحقق من localStorage في DevTools

### **2. Permissions اختفت:**

- ✅ اضغط "Reset to Default"
- ✅ امسح localStorage وأعد تحميل الصفحة

### **3. لا أستطيع تعديل Admin permissions:**

- ✅ هذا طبيعي! Admin دائماً له كل الصلاحيات

---

## 📚 Technical Details

### **Data Structure:**

```typescript
type RolePermission = {
  role: UserRole;
  column: ColumnName;
  canEdit: boolean;
};

// Example:
{
  role: 'social-media',
  column: 'design-brief',
  canEdit: true
}
```

### **Storage:**

```javascript
localStorage.setItem("permissions", JSON.stringify(permissions));
// Saved as array of 56 permission objects (8 roles × 7 columns)
```

### **Default Permissions:**

```javascript
const defaultPerms = {
  "design-brief": ["admin", "account-manager", "social-media"],
  inspiration: ["admin", "account-manager", "social-media", "graphic-designer"],
  design: ["admin", "graphic-designer"],
  "text-content": [
    "admin",
    "account-manager",
    "social-media",
    "content-writer",
  ],
  "drive-link": [
    "admin",
    "account-manager",
    "graphic-designer",
    "video-editor",
  ],
  notes: ["admin", "account-manager", "social-media"],
  status: ["admin", "account-manager", "social-media"],
};
```

---

## 🚀 Next Steps

### **للربط بالـ Backend:**

1. **Create Permissions API:**

   ```
   GET    /api/permissions           // Get all permissions
   PUT    /api/permissions           // Update permissions
   POST   /api/permissions/reset     // Reset to default
   ```

2. **Update DataContext:**

   - Replace localStorage with API calls
   - Add loading states
   - Add error handling

3. **Add Audit Log:**
   - Track who changed what
   - When changes were made
   - History of permission changes

---

## ✅ الخلاصة

**نظام صلاحيات ديناميكي كامل مع:**

✅ صفحة Permissions Management للـ Admin  
✅ Matrix تفاعلي واضح  
✅ Instant updates  
✅ localStorage persistence  
✅ Reset to default  
✅ Integration مع Content Plan  
✅ User-friendly UI

**الآن Admin يتحكم بالكامل في الصلاحيات!** 🎉

---

## 📸 Screenshot Description

**Permissions Management Page:**

```
┌─────────────────────────────────────────────────────────┐
│  🛡️ Permissions Management                             │
│  Configure role-based access control                    │
│                                   [Reset] [Save]        │
├─────────────────────────────────────────────────────────┤
│  ℹ️  About Permissions                                  │
│  Configure which roles can edit which columns...        │
├─────────────────────────────────────────────────────────┤
│  Permissions Matrix                                     │
│                                                         │
│  Role              | Brief | Insp | Design | Text | ...│
│  ──────────────────┼───────┼──────┼────────┼──────┼────│
│  👑 Admin          |  ✅   |  ✅  |   ✅   |  ✅  | ...│
│  👔 Account Mgr    |  ✅   |  ✅  |   ❌   |  ✅  | ...│
│  📱 Social Media   |  ✅   |  ✅  |   ❌   |  ✅  | ...│
│  🎨 Designer       |  ❌   |  ✅  |   ✅   |  ❌  | ...│
│  ✍️ Writer         |  ❌   |  ❌  |   ❌   |  ✅  | ...│
│  ...                                                    │
├─────────────────────────────────────────────────────────┤
│  Legend: ✅ Can Edit  |  ❌ Read Only                   │
└─────────────────────────────────────────────────────────┘
```

---

**Created:** October 2025  
**Version:** 2.0.0  
**System:** Marketing Agency CRM

**Admin Controls Everything Now! 🚀**
