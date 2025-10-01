# 🔐 دليل الصلاحيات - Permissions Guide

## 👥 أدوار المستخدمين (User Roles)

### 1️⃣ **Admin** 👑

**الصلاحيات:** كل الصلاحيات

- ✅ يقدر يعدل **كل الأعمدة** في Content Plan و Reels Plan
- ✅ يوافق/يرفض الموظفين الجدد
- ✅ يشوف صفحة Users Management
- ✅ يعين Tasks للموظفين
- ✅ يدير Projects, Clients, Campaigns

---

### 2️⃣ **Account Manager** 👔

**الوصف:** مدير حسابات العملاء

**الصلاحيات في Content Plan & Reels Plan:**

- ✅ Design Brief
- ✅ Inspiration
- ✅ Text Content
- ✅ Drive Link
- ✅ Notes
- ✅ Status
- ❌ Design (read-only)

**الدور:**

- إدارة العملاء والتواصل معهم
- مراجعة المحتوى قبل النشر
- التنسيق بين الفريق والعميل
- الموافقة النهائية على المحتوى

---

### 3️⃣ **Social Media Specialist** 📱

**الوصف:** متخصص سوشيال ميديا

**الصلاحيات في Content Plan & Reels Plan:**

- ✅ Design Brief
- ✅ Inspiration
- ✅ Text Content
- ✅ Notes
- ✅ Status
- ❌ Design (read-only)
- ❌ Drive Link (read-only)

**الدور:**

- كتابة Design Briefs للمحتوى
- تحديد نوع المحتوى المطلوب
- مراجعة النصوص
- تغيير حالات المحتوى
- جدولة المحتوى في Social Calendar

---

### 4️⃣ **Graphic Designer** 🎨

**الوصف:** مصمم جرافيك

**الصلاحيات في Content Plan & Reels Plan:**

- ✅ Inspiration
- ✅ Design
- ✅ Drive Link
- ❌ Design Brief (read-only)
- ❌ Text Content (read-only)
- ❌ Notes (read-only)
- ❌ Status (read-only)

**الدور:**

- تنفيذ التصاميم حسب الـ Brief
- رفع التصاميم على Drive
- وضع Links للتصاميم
- الرجوع للـ Inspiration

---

### 5️⃣ **Content Writer** ✍️

**الوصف:** كاتب محتوى

**الصلاحيات في Content Plan & Reels Plan:**

- ✅ Text Content فقط
- ❌ كل الباقي (read-only)

**الدور:**

- كتابة النصوص للمحتوى
- كتابة الـ Captions
- كتابة الـ Hashtags
- مراجعة النصوص

---

### 6️⃣ **Video Editor** 🎬

**الوصف:** مونتير فيديو

**الصلاحيات في Content Plan & Reels Plan:**

- ✅ Drive Link فقط
- ❌ كل الباقي (read-only)

**الدور:**

- تحرير ومونتاج الفيديوهات
- رفع الفيديوهات على Drive
- وضع Links للفيديوهات

---

### 7️⃣ **Ads Specialist** 📢

**الوصف:** متخصص إعلانات

**الصلاحيات في Content Plan & Reels Plan:**

- ❌ كل الأعمدة (read-only)

**الدور:**

- إدارة الحملات الإعلانية
- متابعة KPIs
- تحديد الميزانيات
- تحليل الأداء

---

### 8️⃣ **SEO Specialist** 🔍

**الوصف:** متخصص SEO

**الصلاحيات في Content Plan & Reels Plan:**

- ❌ كل الأعمدة (read-only)

**الدور:**

- تحسين محركات البحث
- تحليل Keywords
- SEO Audits
- Performance tracking

---

## 📊 جدول الصلاحيات التفصيلي

### **Content Plan & Reels Plan Permissions:**

| العمود \ الدور   | Admin | Account Manager | Social Media | Graphic Designer | Content Writer | Video Editor | Ads Specialist | SEO Specialist |
| ---------------- | ----- | --------------- | ------------ | ---------------- | -------------- | ------------ | -------------- | -------------- |
| **Title**        | 👁️    | 👁️              | 👁️           | 👁️               | 👁️             | 👁️           | 👁️             | 👁️             |
| **Design Brief** | ✏️    | ✏️              | ✏️           | 👁️               | 👁️             | 👁️           | 👁️             | 👁️             |
| **Inspiration**  | ✏️    | ✏️              | ✏️           | ✏️               | 👁️             | 👁️           | 👁️             | 👁️             |
| **Design**       | ✏️    | 👁️              | 👁️           | ✏️               | 👁️             | 👁️           | 👁️             | 👁️             |
| **Text Content** | ✏️    | ✏️              | ✏️           | 👁️               | ✏️             | 👁️           | 👁️             | 👁️             |
| **Drive Link**   | ✏️    | ✏️              | 👁️           | ✏️               | 👁️             | ✏️           | 👁️             | 👁️             |
| **Notes**        | ✏️    | ✏️              | ✏️           | 👁️               | 👁️             | 👁️           | 👁️             | 👁️             |
| **Status**       | ✏️    | ✏️              | ✏️           | 👁️               | 👁️             | 👁️           | 👁️             | 👁️             |
| **Actions**      | ✏️    | ✏️              | ✏️           | 👁️               | 👁️             | 👁️           | 👁️             | 👁️             |

**Legend:**

- ✏️ = Can Edit (يستطيع التعديل)
- 👁️ = Read Only (قراءة فقط)

---

## 🔄 سير العمل حسب الدور

### **Workflow Example: Creating Social Media Post**

```
1. Social Media Specialist:
   - يضيف Content جديد
   - يكتب Design Brief
   - يحدد Inspiration
   - يكتب Text Content
   - Status → "In Progress"

2. Graphic Designer:
   - يقرأ Design Brief
   - يشوف Inspiration
   - يصمم البوست
   - يرفع على Drive
   - يحط Drive Link
   - Design → "Done"

3. Content Writer (إذا محتاج):
   - يعدل أو يحسن Text Content
   - يضيف Hashtags

4. Account Manager:
   - يراجع كل شيء
   - يعدل إذا محتاج
   - Status → "Approved"
   - يضغط "Ready for Calendar"

5. Social Media Specialist:
   - يسحب من Ready Content
   - يحطه في Social Calendar
   - في يوم النشر → "Published"
```

---

## 🎯 Use Cases لكل دور

### **Account Manager** 👔

**Typical Day:**

- صباحاً: مراجعة Content Plan للأسبوع
- كتابة Briefs للمحتوى الجديد
- التواصل مع العميل للموافقات
- مراجعة التصاميم والنصوص
- Approve المحتوى الجاهز
- متابعة Progress في Projects

**Key Responsibilities:**

- ✓ Client communication
- ✓ Content approval
- ✓ Brief writing
- ✓ Quality control
- ✓ Timeline management

---

### **Social Media Specialist** 📱

**Typical Day:**

- تحديد المحتوى المطلوب للشهر
- كتابة Briefs واضحة
- كتابة Captions و Hashtags
- جدولة المحتوى في Calendar
- نشر المحتوى في المواعيد المحددة
- تعديل Status حسب التقدم

**Key Responsibilities:**

- ✓ Content planning
- ✓ Brief writing
- ✓ Caption writing
- ✓ Scheduling
- ✓ Publishing

---

### **Graphic Designer** 🎨

**Typical Day:**

- شوف Briefs الجديدة
- راجع Inspiration
- صمم المحتوى
- رفع على Drive
- حط Links
- تواصل للتعديلات

**Key Responsibilities:**

- ✓ Visual design
- ✓ Following briefs
- ✓ File management
- ✓ Revisions

---

### **Content Writer** ✍️

**Typical Day:**

- كتابة النصوص للمحتوى
- مراجعة وتحسين Captions
- كتابة Articles
- SEO optimization للنصوص

**Key Responsibilities:**

- ✓ Copywriting
- ✓ Captions
- ✓ Hashtags
- ✓ Proofreading

---

### **Video Editor** 🎬

**Typical Day:**

- مونتاج الفيديوهات والريلز
- إضافة Effects
- رفع على Drive
- وضع Links

**Key Responsibilities:**

- ✓ Video editing
- ✓ Reels creation
- ✓ Motion graphics
- ✓ File delivery

---

## 🔒 Security & Access Control

### **What Happens When:**

#### ❌ **Trying to Edit Restricted Column:**

```
User clicks on gray cell
→ Nothing happens
→ No edit mode
→ Message: "Read-only for your role"
```

#### ✅ **Editing Allowed Column:**

```
User hovers → Edit icon appears
User clicks → Inline editor opens
User edits → Saves
→ Updates in database
```

---

## 💡 Best Practices

### **للـ Account Manager:**

1. ✓ اكتب Briefs واضحة ومفصلة
2. ✓ حدد Inspiration دايماً
3. ✓ راجع كل شيء قبل Approve
4. ✓ تواصل مع التيم في Notes
5. ✓ متسيبش محتوى Pending طويل

### **للـ Social Media:**

1. ✓ خطط المحتوى مقدماً
2. ✓ اكتب Captions جذابة
3. ✓ استخدم Hashtags المناسبة
4. ✓ جدول المحتوى بانتظام
5. ✓ راقب Performance

### **للـ Graphic Designer:**

1. ✓ اقرأ Brief كويس
2. ✓ شوف Inspiration قبل التصميم
3. ✓ ارفع ملفات عالية الجودة
4. ✓ سمّي الملفات بوضوح
5. ✓ متنساش Drive Link

### **للـ Content Writer:**

1. ✓ اكتب بأسلوب البراند
2. ✓ راجع النصوص قبل الحفظ
3. ✓ استخدم grammar tools
4. ✓ تأكد من عدد الكلمات/الأحرف

---

## 📝 Examples

### **Example 1: Social Media Post**

| Column           | Who Fills It                   | Content                                                      |
| ---------------- | ------------------------------ | ------------------------------------------------------------ |
| **Title**        | Social Media                   | "Summer Sale 2025"                                           |
| **Design Brief** | Account Manager / Social Media | "Create vibrant summer-themed post with product showcase..." |
| **Inspiration**  | Social Media / Designer        | "Link to Pinterest board"                                    |
| **Design**       | Graphic Designer               | "Final design ready"                                         |
| **Text Content** | Content Writer / Social Media  | "🌞 Summer Sale is here! Get 50% off..."                     |
| **Drive Link**   | Graphic Designer               | "https://drive.google.com/..."                               |
| **Notes**        | Account Manager                | "Client approved on 01/10"                                   |
| **Status**       | Social Media                   | "Approved"                                                   |

---

### **Example 2: Instagram Reel**

| Column           | Who Fills It    | Content                                      |
| ---------------- | --------------- | -------------------------------------------- |
| **Title**        | Social Media    | "Product Demo Reel"                          |
| **Design Brief** | Social Media    | "30-second product demo with transitions..." |
| **Inspiration**  | Social Media    | "Trending reel style reference"              |
| **Design**       | Video Editor    | "Edited with transitions"                    |
| **Text Content** | Content Writer  | "Check out our new product! ✨..."           |
| **Drive Link**   | Video Editor    | "https://drive.google.com/..."               |
| **Notes**        | Account Manager | "Add CTA at end"                             |
| **Status**       | Social Media    | "Scheduled"                                  |

---

## 🎯 Permission Matrix (التفصيلي)

### **Content Plan Columns:**

#### **Design Brief**

- **Can Edit:** Admin, Account Manager, Social Media
- **Purpose:** وصف المحتوى المطلوب
- **Who Writes:** عادة Social Media أو Account Manager

#### **Inspiration**

- **Can Edit:** Admin, Account Manager, Social Media, Graphic Designer
- **Purpose:** مراجع بصرية أو أفكار
- **Who Writes:** Social Media يحط المرجع، Designer يضيف إذا محتاج

#### **Design**

- **Can Edit:** Admin, Graphic Designer
- **Purpose:** وصف التصميم أو حالته
- **Who Writes:** Graphic Designer فقط

#### **Text Content**

- **Can Edit:** Admin, Account Manager, Social Media, Content Writer
- **Purpose:** النص/Caption/Hashtags
- **Who Writes:** Content Writer أو Social Media

#### **Drive Link**

- **Can Edit:** Admin, Account Manager, Graphic Designer, Video Editor
- **Purpose:** رابط الملف النهائي
- **Who Writes:** Designer أو Video Editor

#### **Notes**

- **Can Edit:** Admin, Account Manager, Social Media
- **Purpose:** ملاحظات عامة أو تعديلات
- **Who Writes:** أي حد من الثلاثة

#### **Status**

- **Can Edit:** Admin, Account Manager, Social Media
- **Purpose:** تتبع حالة المحتوى
- **Who Changes:** Social Media أو Account Manager

---

## 🚦 Status Flow

```
Idea (Social Media)
  ↓
In Progress (Social Media assigns to team)
  ↓
Review (Team marks as ready for review)
  ↓
Approved (Account Manager approves)
  ↓
Ready for Calendar (Account Manager marks)
  ↓
Scheduled (Dragged to calendar)
  ↓
Published (On publish date)
```

---

## 💼 Real-World Scenario

### **Scenario: Client wants Instagram post for new product**

**Day 1 - Planning:**

- **Account Manager** يتكلم مع العميل ويفهم المطلوب
- **Social Media** يضيف Content جديد في Content Plan
- **Social Media** يكتب Design Brief مفصل
- **Social Media** يحط Inspiration (مراجع)

**Day 2 - Creation:**

- **Graphic Designer** يقرأ Brief
- **Graphic Designer** يشوف Inspiration
- **Graphic Designer** يصمم البوست
- **Graphic Designer** يرفع على Drive ويحط Link
- **Content Writer** يكتب Caption جذاب

**Day 3 - Review:**

- **Account Manager** يراجع التصميم والنص
- **Account Manager** يكتب Notes بالتعديلات (إذا محتاج)
- **Designer** يعدل حسب Notes
- **Account Manager** Status → "Approved"

**Day 4 - Scheduling:**

- **Account Manager** يضغط "Ready for Calendar"
- **Social Media** يفتح Social Calendar
- **Social Media** يسحب البوست ويحطه على تاريخ النشر
- Status → "Scheduled"

**Publish Day:**

- **Social Media** يضغط ✅ على البوست
- Status → "Published"
- Done! ✅

---

## 🎓 Training Tips

### **للموظفين الجدد:**

1. **اعرف دورك:**

   - شوف الجدول أعلاه
   - افهم الأعمدة اللي تقدر تعدلها

2. **اتبع الـ Workflow:**

   - كل محتوى يعدي على مراحل
   - متقفزش خطوات

3. **استخدم Notes:**

   - اترك ملاحظات للتيم
   - تواصل بوضوح

4. **راجع قبل Approve:**
   - تأكد من كل شيء جاهز
   - Double-check Links

---

## 📞 Support

**إذا واجهت مشكلة صلاحيات:**

1. تأكد من دورك في النظام
2. راجع الجدول أعلاه
3. اتصل بالـ Admin أو Account Manager

**للتعديلات على الصلاحيات:**

- يجب تحديث `COLUMN_PERMISSIONS` في ملف:
- `src/components/project/ContentPlanTable.tsx`

---

## ✅ Summary

**نظام الصلاحيات يضمن:**

- ✓ كل شخص يشتغل في مجاله
- ✓ لا يوجد تضارب في التعديلات
- ✓ Workflow منظم ومتسلسل
- ✓ Quality control محكم
- ✓ تعاون فعال بين الفريق

---

**Created:** October 2025  
**Version:** 1.0.0  
**System:** Marketing Agency CRM
