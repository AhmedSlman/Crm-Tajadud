# 📁 Project Management System - دليل الاستخدام

## 🎯 نظرة عامة

نظام إدارة مشاريع متقدم مع:

- ✅ Month Selector لكل مشروع
- ✅ Dynamic Tabs (Tasks, Content Plan, Reels, Campaigns, Social Calendar)
- ✅ Kanban Board مع Drag & Drop
- ✅ Content Planning مع صلاحيات حسب الدور
- ✅ Social Calendar مع Drag & Drop للنشر

---

## 🚀 كيفية الاستخدام

### 1️⃣ **فتح مشروع**

1. اذهب لصفحة **Projects** من القائمة الجانبية
2. اختر أي مشروع واضغط **"Open Project"**
3. ستفتح صفحة Project Detail

### 2️⃣ **اختيار الشهر**

في أعلى الصفحة ستجد **Month Selector**

- اضغط الأسهم للتنقل بين الأشهر
- كل البيانات ستتفلتر حسب الشهر المختار

### 3️⃣ **الـ Stats Dashboard**

في أعلى الصفحة ستجد 5 بطاقات إحصائيات:

- **Tasks Completed**: عدد المهام المكتملة / إجمالي المهام
- **Active Campaigns**: عدد الحملات النشطة
- **Content Ready**: المحتوى الجاهز للنشر
- **Reels Ready**: الريلز الجاهزة
- **Project Progress**: تقدم المشروع العام

---

## 📑 التابات (Tabs)

### 🔷 **1. Tasks**

**Kanban Board مع 4 أعمدة:**

- To Do
- In Progress
- Review
- Done

**المميزات:**

- ✅ Drag & Drop: اسحب المهمة بين الأعمدة لتغيير الحالة
- ✅ Add Task: أضف مهمة جديدة
- ✅ Assign: عيّن المهمة لشخص
- ✅ Priority: حدد الأولوية (Low, Medium, High, Urgent)
- ✅ Due Date: حدد تاريخ التسليم

---

### 🔷 **2. Content Plan**

**جدول متقدم للمحتوى العادي (Posts, Graphics, etc.)**

**الأعمدة:**

1. **Title** - عنوان المحتوى
2. **Design Brief** - الملخص التصميمي
3. **Inspiration** - الإلهام/المرجع
4. **Design** - التصميم
5. **Text Content** - النص
6. **Drive Link** - رابط Google Drive
7. **Notes** - ملاحظات
8. **Status** - الحالة
9. **Actions** - إجراءات

**الصلاحيات (Role-based Permissions):**

| العمود       | من يستطيع التعديل                     |
| ------------ | ------------------------------------- |
| Design Brief | Admin, Social Media                   |
| Inspiration  | Admin, Social Media, Graphic Designer |
| Design       | Admin, Graphic Designer               |
| Text Content | Admin, Content Writer, Social Media   |
| Drive Link   | Admin, Graphic Designer, Video Editor |
| Notes        | Admin, Social Media                   |
| Status       | Admin, Social Media                   |

**كيفية التعديل:**

- الأعمدة المسموحة: مرر الماوس واضغط أيقونة Edit ✏️
- الأعمدة الممنوعة: تظهر باللون الرمادي (read-only)

**عمل المحتوى جاهز:**

1. لما يكون Status = "Approved"
2. اضغط زر **"Ready"**
3. المحتوى سيظهر في Social Calendar جاهز للسحب

---

### 🔷 **3. Reels Plan**

**نفس فكرة Content Plan بس للريلز**

- نفس الأعمدة
- نفس الصلاحيات
- نفس طريقة العمل

**الفرق:**

- المحتوى يتعلم كـ "Reel" في النظام
- يظهر بأيقونة فيديو 🎬

---

### 🔷 **4. Campaigns**

**عرض الحملات الإعلانية الخاصة بالمشروع**

**المعلومات المعروضة:**

- اسم الحملة ونوعها
- الميزانية
- التواريخ (Start/End)
- KPIs (المؤشرات)
- Progress (التقدم)

---

### 🔷 **5. Social Calendar** ⭐ الأهم

**تقويم شهري لجدولة المحتوى**

**كيفية الاستخدام:**

**1. في الجانب الأيسر:**

- ستجد "Ready Content" - المحتوى الجاهز للنشر
- هذا المحتوى جاي من Content Plan و Reels Plan
- لازم يكون Status = "Approved" و Ready = True

**2. في التقويم:**

- اسحب أي content item من اليسار
- اسقطه على اليوم المطلوب في التقويم
- تلقائياً سيتم:
  - تحديد Publish Date
  - تغيير Status إلى "Scheduled"

**3. النشر:**

- المحتوى المجدول يظهر باللون الأزرق 🔵
- اضغط ✅ للتحويل إلى "Published"
- المحتوى المنشور يظهر باللون الأخضر 🟢

**Legend:**

- 🔵 Scheduled - مجدول
- 🟢 Published - منشور
- 📄 Regular Content - محتوى عادي
- 🎬 Reel - ريل

---

## 🎭 Workflow الكامل

### **من البداية للنهاية:**

```
1. إنشاء Task
   ↓
2. تعيين المهمة للموظف
   ↓
3. تحريك المهمة في Kanban (To Do → In Progress → Review → Done)
   ↓
4. إضافة Content في Content Plan
   ↓
5. فريق العمل يملأ الأعمدة حسب صلاحياته:
   - Social Media: Design Brief, Text, Notes
   - Graphic Designer: Inspiration, Design
   - Content Writer: Text Content
   ↓
6. عند الاكتمال: Status → Approved
   ↓
7. اضغط "Ready" لجعله جاهز للتقويم
   ↓
8. اذهب لـ Social Calendar
   ↓
9. اسحب المحتوى من Ready Content
   ↓
10. اسقطه على يوم محدد في التقويم
   ↓
11. في يوم النشر: اضغط ✅ لتحويله لـ Published
```

---

## 👥 الصلاحيات حسب الدور

### **Admin** 👑

- كل الصلاحيات
- يقدر يعدل أي حاجة
- يقدر يوافق على الموظفين الجدد

### **Social Media Specialist** 📱

- Design Brief ✓
- Inspiration ✓
- Text Content ✓
- Notes ✓
- Status ✓

### **Graphic Designer** 🎨

- Inspiration ✓
- Design ✓
- Drive Link ✓

### **Content Writer** ✍️

- Text Content ✓

### **Video Editor** 🎬

- Drive Link ✓

### **Ads Specialist** 📢

- يشوف بس (read-only)
- مسؤول عن Campaigns

---

## 💡 نصائح مهمة

### ✅ **Do's (افعل)**

1. ✓ دايماً حدد الشهر الصح قبل ما تبدأ الشغل
2. ✓ استخدم Drag & Drop في Tasks عشان أسرع
3. ✓ خلي كل Content يعدي على Status: Idea → In Progress → Review → Approved
4. ✓ متنساش تحط Drive Link للتصاميم
5. ✓ اعمل Ready للمحتوى بس لما يكون جاهز فعلاً

### ❌ **Don'ts (متعملش)**

1. ✗ متعدلش على أعمدة مش من صلاحياتك (مش هتقدر أصلاً)
2. ✗ متنشرش محتوى من غير ما يكون Approved
3. ✗ متنساش تحدث Progress لما تخلص Tasks
4. ✗ متسيبش Tasks في To Do لفترة طويلة

---

## 🔥 Shortcuts & Tips

### **Keyboard Shortcuts:**

- `Ctrl+K` - فتح Quick Actions
- `Esc` - إغلاق Modal

### **Mouse Actions:**

- **Single Click**: تعديل cell في الجدول
- **Drag & Drop**: نقل Tasks أو Content للتقويم
- **Hover**: إظهار Edit button في الجداول

---

## 📊 الإحصائيات في كل مشروع

### **Tasks Completion Rate**

```
Completed Tasks / Total Tasks × 100
```

### **Content Progress**

```
(Published + Approved Content) / Total Content × 100
```

### **Reels Progress**

```
(Published + Approved Reels) / Total Reels × 100
```

---

## 🐛 المشاكل الشائعة

### **1. لا أستطيع تعديل عمود معين**

- ✅ تحقق من صلاحياتك
- ✅ الأعمدة الرمادية = Read-only

### **2. المحتوى لا يظهر في Social Calendar**

- ✅ تأكد أن Status = Approved
- ✅ تأكد أنك ضغطت زر "Ready"

### **3. لا أستطيع سحب المحتوى للتقويم**

- ✅ تأكد أنه موجود في Ready Content
- ✅ جرب Refresh الصفحة

### **4. الـ Month Filter لا يعمل**

- ✅ تأكد أن المهام/المحتوى مربوطة بنفس الشهر
- ✅ بعض البيانات قد تكون بدون Month

---

## 🎯 Best Practices

### **للـ Project Manager:**

1. ابدأ كل شهر بتحديد الأهداف
2. وزع Tasks على التيم
3. راقب Progress من Stats Dashboard
4. راجع Social Calendar أسبوعياً

### **للـ Social Media Specialist:**

1. حدد المحتوى المطلوب أول الشهر
2. اكتب Design Briefs واضحة
3. راجع كل محتوى قبل Approval
4. جدول المحتوى في Social Calendar

### **للـ Designers:**

1. ارفع التصاميم على Drive
2. حط الـ Links في الجدول
3. اترك Notes للتعديلات
4. حدث Status لما تخلص

### **للـ Content Writers:**

1. اكتب النصوص في Text Content column
2. خلي النصوص جاهزة للنسخ واللصق
3. راجع Inspiration قبل الكتابة

---

## 📈 المتابعة والتحليل

### **يومياً:**

- تحقق من Tasks Board
- راجع Social Calendar لليوم
- انقل Tasks المكتملة لـ Done

### **أسبوعياً:**

- راجع Content Plan progress
- تأكد من جاهزية المحتوى للأسبوع القادم
- Update Campaign KPIs

### **شهرياً:**

- راجع Project Stats
- حلل Task Completion Rate
- خطط للشهر القادم

---

## 🚀 الخطوات التالية

بعد ما تتعود على النظام:

1. **Custom Columns**: أضف أعمدة جديدة للجداول
2. **Automation**: أتمتة تغيير Status
3. **Notifications**: إشعارات عند اقتراب Due Dates
4. **Reports**: تقارير شهرية تلقائية
5. **Integrations**: ربط مع Google Drive/Slack

---

## 📞 الدعم

للأسئلة والمشاكل:

- راجع هذا الملف أولاً
- اتصل بالـ Admin إذا كانت مشكلة صلاحيات
- ابعت screenshot للمشكلة

---

**تم إنشاؤه:** October 2025  
**الإصدار:** 1.0.0  
**النظام:** Marketing Agency CRM

**Happy Planning! 🎉**
