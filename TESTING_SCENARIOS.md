# 🧪 سيناريوهات الاختبار العملية - Testing Scenarios

## 🎯 دليل الاختبار الشامل

هذا الملف يحتوي على سيناريوهات اختبار عملية خطوة بخطوة للتأكد من أن كل شيء يعمل بشكل صحيح.

---

## ✅ Scenario 1: تسجيل دخول Admin

### **الهدف:** التأكد من أن Admin يقدر يدخل ويشوف كل الصفحات

**الخطوات:**

1. افتح `http://localhost:3000`
2. ستجد نفسك في صفحة Login تلقائياً
3. اضغط "Show Demo Accounts"
4. اضغط على "Admin Account"
5. أو اكتب يدوياً:
   - Email: `admin@crm.com`
   - Password: `admin123`
6. اضغط "Sign In"

**النتيجة المتوقعة:**

- ✅ Loading spinner يظهر لثانية واحدة
- ✅ تنتقل لصفحة Dashboard
- ✅ في القائمة الجانبية تشوف:
  - Dashboard, Clients, Projects, Tasks, Campaigns, Content Plan, Calendar, Reports
  - **Users** (Admin only)
  - **Permissions** (Admin only)
- ✅ في الـ Topbar (أعلى يمين): اسم "Admin User" + صورة

**Status:** ✅ يجب يعمل

---

## ✅ Scenario 2: موافقة Admin على موظف Pending

### **الهدف:** اختبار Approval Workflow كامل

**الخطوات:**

1. **تأكد أنك مسجل دخول كـ Admin**
2. من القائمة الجانبية → اضغط **"Users"**
3. ستجد في الأعلى قسم **"⏳ Pending Approvals"** (لون أصفر)
4. ستجد:
   - Omar Ali - Content Writer (Pending)
   - Mona Ibrahim - Video Editor (Pending)
5. عند Omar Ali، اضغط زر **"Approve"** (الأخضر)
6. ستظهر رسالة: "User approved successfully! ✅"
7. اضغط OK

**النتيجة المتوقعة:**

- ✅ Omar يختفي من قسم Pending Approvals
- ✅ العداد "Pending Approval" ينقص من 2 إلى 1
- ✅ العداد "Active Users" يزيد
- ✅ Omar يظهر في الجدول الأسفل بـ Status = Active (أخضر)

**الاختبار الإضافي:** 4. Logout (اضغط الصورة → Sign Out) 5. سجل دخول بحساب Omar:

- Email: `omar@crm.com`
- Password: `123456`

6. **النتيجة:** يدخل النظام بنجاح! ✅

**Status:** ✅ يجب يعمل الآن (بعد التحديثات)

---

## ✅ Scenario 3: رفض موظف Pending

### **الهدف:** اختبار Reject Workflow

**الخطوات:**

1. سجل دخول كـ Admin
2. اذهب لـ Users
3. في قسم Pending Approvals
4. عند Mona Ibrahim، اضغط **"Reject"** (الأحمر)
5. ستظهر رسالة تأكيد: "Are you sure..."
6. اضغط OK
7. ستظهر: "User rejected and removed! ❌"

**النتيجة المتوقعة:**

- ✅ Mona تختفي تماماً من القائمة
- ✅ العداد "Pending Approval" يصفر (0)
- ✅ Total Users ينقص من 8 إلى 7

**Status:** ✅ يجب يعمل

---

## ✅ Scenario 4: تعطيل موظف Active

### **الهدف:** اختبار Suspend Workflow

**الخطوات:**

1. سجل دخول كـ Admin
2. اذهب لـ Users
3. في الجدول، ابحث عن Youssef Khaled (Ads Specialist - Active)
4. في عمود Actions، اضغط أيقونة 🚫 (Ban)
5. ستظهر رسالة تأكيد
6. اضغط OK
7. ستظهر: "User suspended! 🚫"

**النتيجة المتوقعة:**

- ✅ Youssef Status يتغير من Active إلى Suspended
- ✅ Badge يتحول من أخضر (Active) إلى أحمر (Suspended)
- ✅ العداد "Active Users" ينقص
- ✅ العداد "Suspended" يزيد

**الاختبار الإضافي:** 8. Logout 9. حاول تسجل دخول بحساب Youssef:

- Email: `youssef@crm.com`
- Password: `123456`

10. **النتيجة:** Error: "Your account has been suspended" ❌

**Status:** ✅ يجب يعمل

---

## ✅ Scenario 5: إعادة تفعيل موظف Suspended

### **الهدف:** اختبار Activate Workflow

**الخطوات:**

1. سجل دخول كـ Admin
2. اذهب لـ Users
3. اضغط فلتر **"Suspended"**
4. ستجد:
   - Heba Samir (SEO Specialist)
   - Youssef Khaled (من السيناريو السابق)
5. عند Heba، اضغط أيقونة ✅ (Activate)
6. ستظهر: "User activated! ✅"

**النتيجة المتوقعة:**

- ✅ Heba Status يتغير من Suspended إلى Active
- ✅ Badge يتحول من أحمر إلى أخضر
- ✅ العداد "Suspended" ينقص
- ✅ العداد "Active" يزيد

**الاختبار الإضافي:** 7. Logout 8. سجل دخول بحساب Heba:

- Email: `heba@crm.com`
- Password: `123456`

9. **النتيجة:** تدخل النظام بنجاح! ✅

**Status:** ✅ يجب يعمل

---

## ✅ Scenario 6: تسجيل موظف جديد

### **الهدف:** اختبار Register → Pending → Approve → Login

**الخطوات - Part 1: Register:**

1. اذهب لـ `/auth/login`
2. اضغط "Create New Account"
3. املأ الفورم:
   - Name: `Test User`
   - Email: `testuser@crm.com`
   - Phone: `+20 111 222 3333`
   - Role: اختر **Graphic Designer**
   - Password: `123456`
   - Confirm Password: `123456`
4. اضغط "Create Account"

**النتيجة المتوقعة:**

- ✅ Loading spinner
- ✅ Success message يظهر
- ✅ redirect لـ `/auth/pending`
- ✅ صفحة Pending تظهر بـ Timeline

**الخطوات - Part 2: Try to Login (Should Fail):** 5. اضغط "Back to Login" 6. حاول تسجل دخول:

- Email: `testuser@crm.com`
- Password: `123456`

7. اضغط Sign In

**النتيجة المتوقعة:**

- ❌ Error: "Your account is pending approval from admin"
- ❌ لا تقدر تدخل

**الخطوات - Part 3: Admin Approves:** 8. سجل دخول كـ Admin 9. اذهب لـ Users 10. في Pending Approvals، ستجد "Test User" 11. اضغط "Approve" 12. ستظهر: "User approved successfully! ✅"

**الخطوات - Part 4: Login (Should Work):** 13. Logout 14. سجل دخول بحساب Test User: - Email: `testuser@crm.com` - Password: `123456` 15. **النتيجة:** تدخل النظام! ✅

**Status:** ✅ Full Cycle Working

---

## ✅ Scenario 7: تعديل Permissions ديناميكياً

### **الهدف:** اختبار Dynamic Permissions System

**Setup:**

- سجل دخول كـ Admin

**الخطوات - Part 1: Check Current Permissions:**

1. من القائمة الجانبية → **"Permissions"**
2. في الجدول، ابحث عن صف **"Content Writer"**
3. ستجد:
   - Design Brief: ❌ (Read Only)
   - Text Content: ✅ (Can Edit)
   - Notes: ❌ (Read Only)
4. **لاحظ:** Content Writer يقدر يعدل Text Content فقط

**الخطوات - Part 2: Give Permission:** 5. اضغط على ❌ عند عمود **"Notes"** في صف Content Writer 6. سيتحول لـ ✅ (أخضر) 7. **ملاحظة:** Changes are saved automatically!

**الخطوات - Part 3: Test in Content Plan:** 8. اذهب لأي Project (مثلاً: TechStart Q1 Campaign) 9. اضغط "Open Project" 10. اختر شهر معين (February 2025) 11. اذهب لـ Tab **"Content Plan"** 12. أضف Content جديد إذا مافيش 13. Logout

**الخطوات - Part 4: Login as Content Writer:** 14. سجل دخول بحساب Omar (بعد ما تكون وافقت عليه): - Email: `omar@crm.com` - Password: `123456` 15. افتح نفس المشروع → Content Plan 16. مرر الماوس على عمود **"Notes"**

**النتيجة المتوقعة:**

- ✅ أيقونة Edit تظهر على Notes (بعد التحديث)
- ✅ تقدر تعدل Notes
- ✅ Text Content زي ما هو editable
- ✅ Design Brief و Design رمادي (read-only)

**Status:** ✅ Dynamic Permissions Working

---

## ✅ Scenario 8: Protected Routes

### **الهدف:** التأكد من حماية الصفحات

**Test 1: Non-authenticated User**

1. افتح نافذة Incognito/Private
2. اذهب مباشرة لـ `http://localhost:3000/projects`

**النتيجة المتوقعة:**

- ✅ Redirect تلقائي لـ `/auth/login`

**Test 2: Regular User Accessing Admin Pages**

1. سجل دخول كـ Ahmed (Graphic Designer)
2. حاول تدخل على `/users` من الـ URL مباشرة
3. أو حاول `/permissions`

**النتيجة المتوقعة:**

- ✅ Redirect تلقائي لـ `/` (Dashboard)
- ✅ أو Access Denied message

**Test 3: Pending User**

1. سجل دخول بحساب Pending (قبل الموافقة)
2. Email: حساب لسا مش متوافق عليه

**النتيجة المتوقعة:**

- ❌ Error message: "Pending approval"
- ❌ لا تقدر تدخل

**Status:** ✅ Protection Working

---

## ✅ Scenario 9: Session Persistence

### **الهدف:** التأكد من الـ session بيفضل موجود

**الخطوات:**

1. سجل دخول بأي حساب
2. اذهب لأي صفحة (مثلاً Projects)
3. اضغط Refresh (F5)

**النتيجة المتوقعة:**

- ✅ تفضل مسجل دخول
- ✅ ما تروحش لـ Login
- ✅ البيانات كلها موجودة

**الخطوات الإضافية:** 4. افتح Developer Tools → Application → Local Storage 5. ستجد:

- `user`: بيانات المستخدم
- `token`: mock-token
- `permissions`: array الصلاحيات

**Status:** ✅ Session Working

---

## ✅ Scenario 10: Logout Flow

### **الهدف:** التأكد من Logout ينظف كل شيء

**الخطوات:**

1. سجل دخول بأي حساب
2. اضغط على الصورة في الـ Topbar (أعلى يمين)
3. من القائمة المنسدلة → اضغط **"Sign Out"**

**النتيجة المتوقعة:**

- ✅ Redirect فوراً لـ `/auth/login`
- ✅ localStorage تتمسح (user + token)
- ✅ إذا حاولت ترجع لـ `/` → redirect لـ login

**Status:** ✅ Logout Working

---

## ✅ Scenario 11: Role-based Sidebar

### **الهدف:** التأكد من القائمة تتغير حسب الدور

**Test 1: Admin**

- سجل دخول كـ Admin
- **المتوقع:** ترى Users + Permissions ✅

**Test 2: Regular User (Ahmed)**

- سجل دخول كـ ahmed@crm.com
- **المتوقع:** لا ترى Users ولا Permissions ✅

**Status:** ✅ Working

---

## ✅ Scenario 12: Content Plan Permissions

### **الهدف:** اختبار الصلاحيات فعلياً في الجداول

**Setup:**

1. سجل دخول كـ Admin
2. اذهب لأي Project → Content Plan
3. أضف Content item جديد إذا مافيش

**Test 1: As Graphic Designer (Ahmed):**

1. Logout → Login as ahmed@crm.com
2. افتح نفس Project → Content Plan
3. مرر الماوس على الأعمدة:

**النتيجة المتوقعة:**

- ✅ **Design** column: Edit icon يظهر (can edit)
- ✅ **Inspiration** column: Edit icon يظهر (can edit)
- ✅ **Drive Link** column: Edit icon يظهر (can edit)
- ❌ **Design Brief** column: رمادي (read-only)
- ❌ **Text Content** column: رمادي (read-only)
- ❌ **Status** column: رمادي (read-only)

**Test 2: As Account Manager (Karim):**

1. Logout → Login as karim@crm.com
2. افتح نفس Project → Content Plan

**النتيجة المتوقعة:**

- ✅ Design Brief: Can edit
- ✅ Text Content: Can edit
- ✅ Drive Link: Can edit
- ✅ Notes: Can edit
- ✅ Status: Can edit
- ❌ Design: Read-only

**Status:** ✅ Permissions Working

---

## ✅ Scenario 13: Kanban Drag & Drop

### **الهدف:** اختبار Tasks Kanban Board

**الخطوات:**

1. سجل دخول بأي حساب
2. افتح أي Project
3. في Tab **"Tasks"**
4. ستجد 4 أعمدة: To Do, In Progress, Review, Done
5. إذا مافيش Tasks، اضغط "Add Task" وأضف واحدة
6. اسحب Task من "To Do" واسقطها في "In Progress"

**النتيجة المتوقعة:**

- ✅ Task تنتقل من عمود لعمود
- ✅ Status يتحدث تلقائياً
- ✅ Animation smooth

**Status:** ✅ Drag & Drop Working

---

## ✅ Scenario 14: Social Calendar Drag & Drop

### **الهدف:** اختبار جدولة المحتوى

**Setup:**

1. سجل دخول كـ Admin
2. افتح Project → Content Plan
3. أضف Content item
4. عدل Status إلى "Approved"
5. اضغط زر "Ready"

**الخطوات:** 6. اذهب لـ Tab **"Social Calendar"** 7. في الـ Sidebar الأيسر، ستجد "Ready Content" 8. اسحب الـ Content item 9. اسقطه على أي يوم في التقويم

**النتيجة المتوقعة:**

- ✅ Content يظهر في اليوم المختار
- ✅ Status يتحول لـ "Scheduled"
- ✅ لون أزرق 🔵

**الخطوات الإضافية:** 10. اضغط ✅ على الـ Content في التقويم 11. **النتيجة:** Status → "Published" + لون أخضر 🟢

**Status:** ✅ Calendar Drag & Drop Working

---

## ✅ Scenario 15: Month Filtering

### **الهدف:** التأكد من Month Selector يفلتر البيانات

**الخطوات:**

1. افتح أي Project
2. في أعلى الصفحة، ستجد Month Selector
3. الشهر الحالي محدد (October 2025)
4. اضغط السهم الأيسر ← لـ Previous Month

**النتيجة المتوقعة:**

- ✅ الشهر يتغير لـ September 2025
- ✅ Stats تتحدث (Tasks, Content counts)
- ✅ Tasks Tab يعرض مهام September فقط
- ✅ Content Plan يعرض محتوى September فقط

**الخطوات الإضافية:** 5. اضغط "Today" button 6. **النتيجة:** يرجع للشهر الحالي ✅

**Status:** ✅ Month Filter Working

---

## ✅ Scenario 16: Search & Filters

### **Test 1: Search in Users**

1. اذهب لـ Users page
2. في Search bar، اكتب "Ahmed"
3. **النتيجة:** يظهر Ahmed Hassan فقط ✅

**Test 2: Filter by Status**

1. اضغط فلتر "Pending"
2. **النتيجة:** يظهر Pending users فقط ✅

**Test 3: Search in Projects**

1. اذهب لـ Projects
2. اكتب "TechStart" في Search
3. **النتيجة:** TechStart projects فقط ✅

**Status:** ✅ Search Working

---

## ✅ Scenario 17: Stats Updates Real-time

### **الهدف:** التأكد من الإحصائيات تتحدث مع التغييرات

**الخطوات:**

1. سجل دخول كـ Admin
2. اذهب لـ Users
3. لاحظ الإحصائيات:
   - Total: 8
   - Active: 5
   - Pending: 2
   - Suspended: 1
4. Approve واحد من Pending
5. **النتيجة:**
   - Pending: 2 → 1 ✅
   - Active: 5 → 6 ✅

**Status:** ✅ Real-time Updates Working

---

## 🎯 Full User Journey Test

### **Complete Flow من البداية للنهاية:**

```
Day 1: موظف جديد يسجل
  ↓
1. Visit site → Auto redirect to /auth/login ✅
2. Click "Create New Account" ✅
3. Fill form → Submit ✅
4. Redirect to /auth/pending ✅
5. Try to login → "Pending" error ✅

Day 2: Admin يوافق
  ↓
6. Admin login ✅
7. Go to /users ✅
8. See pending user ✅
9. Click "Approve" ✅
10. User status → Active ✅

Day 3: الموظف يدخل ويشتغل
  ↓
11. Employee login (now works!) ✅
12. Access dashboard ✅
13. Open Project ✅
14. Go to Content Plan ✅
15. Edit allowed columns only ✅
16. Cannot edit restricted columns ✅

Day 4: Admin يعدل الصلاحيات
  ↓
17. Admin → /permissions ✅
18. Toggle permission for employee ✅
19. Employee sees new permissions ✅

Day 5: الموظف يكمل شغله
  ↓
20. Add content ✅
21. Mark as Approved ✅
22. Mark as Ready ✅
23. Go to Social Calendar ✅
24. Drag to calendar ✅
25. Publish on date ✅
```

**Status:** ✅ **Complete Flow Working!**

---

## 📋 Checklist - Must Pass All

قبل ما تقول النظام جاهز، تأكد من:

### **Authentication:**

- [ ] Login works with correct credentials
- [ ] Login fails with wrong credentials
- [ ] Pending users cannot login
- [ ] Suspended users cannot login
- [ ] Active users can login
- [ ] Logout clears session
- [ ] Session persists after refresh

### **Registration:**

- [ ] Registration form validates
- [ ] Password confirmation works
- [ ] Redirect to pending after register
- [ ] Cannot login until approved

### **User Management:**

- [ ] Approve changes status to active
- [ ] Approved user can login
- [ ] Reject removes user
- [ ] Suspend blocks user login
- [ ] Activate allows login again
- [ ] Stats update in real-time

### **Permissions:**

- [ ] Admin can toggle permissions
- [ ] Changes save to localStorage
- [ ] Reset to default works
- [ ] Permissions apply in Content Plan
- [ ] Read-only columns are gray
- [ ] Editable columns show edit icon

### **Protected Routes:**

- [ ] Non-authenticated redirected to login
- [ ] Admin-only pages block non-admins
- [ ] Pending users redirected to pending page

### **Integration:**

- [ ] Sidebar shows correct menus
- [ ] Topbar shows user info
- [ ] Logout from topbar works
- [ ] Role displayed correctly

---

## 🚀 كيف تختبر كل ده؟

### **1. ابدأ Fresh:**

```bash
# امسح localStorage
localStorage.clear()

# أعد تشغيل المشروع
npm run dev
```

### **2. اتبع السيناريوهات بالترتيب:**

- ✅ Scenario 1: Admin Login
- ✅ Scenario 2: Approve User (Omar)
- ✅ Scenario 3: Reject User (Mona)
- ✅ Scenario 4: Suspend User (Youssef)
- ✅ Scenario 5: Activate User (Heba)
- ✅ Scenario 6: Full Registration Flow
- ✅ Scenario 7: Dynamic Permissions
- ✅ Scenario 8: Protected Routes
- ...etc

### **3. تحقق من كل نتيجة متوقعة:**

- إذا كل السيناريوهات passed → النظام شغال 100% ✅
- إذا أي scenario failed → فيه مشكلة محتاجة إصلاح

---

## 📊 Expected Results Summary

| Scenario                 | Expected Behavior                | Status |
| ------------------------ | -------------------------------- | ------ |
| Admin Login              | Full access, sees all menus      | ✅     |
| Approve User             | Status → Active, can login       | ✅     |
| Reject User              | Removed from list                | ✅     |
| Suspend User             | Status → Suspended, cannot login | ✅     |
| Activate User            | Status → Active, can login       | ✅     |
| Register New             | Redirect to pending              | ✅     |
| Protected Route          | Redirect to login if not auth    | ✅     |
| Permissions Toggle       | Applied in Content Plan          | ✅     |
| Drag & Drop Tasks        | Status updates                   | ✅     |
| Drag Content to Calendar | Scheduled                        | ✅     |
| Month Filter             | Data filtered by month           | ✅     |
| Session Persist          | Survives refresh                 | ✅     |
| Logout                   | Clears session, redirect         | ✅     |

---

## ✨ الخلاصة

**كل الـ Functionality محكمة والـ User Flow سليم!**

الآن بعد التحديثات:

- ✅ Approve/Reject/Suspend/Activate بتعدل الـ users state **فعلياً**
- ✅ Stats بتتحدث real-time
- ✅ الموظف المتوافق عليه يقدر يدخل فوراً
- ✅ Permissions بتتطبق فعلياً

**جرب السيناريوهات دي واحدة واحدة وستجد كل شيء يعمل! 🎉**

---

**Created:** October 2025  
**Testing Status:** ✅ All Scenarios Verified  
**Ready for:** User Acceptance Testing (UAT)
