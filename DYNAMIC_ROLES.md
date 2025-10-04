# 🎭 Dynamic Roles Management

## 🌟 Overview

The CRM now supports **Dynamic Role Management**! Admins can create, edit, and delete custom roles directly from the Permissions page, and these roles will automatically appear throughout the entire application.

---

## 🚀 Features

### ✨ **Add Custom Roles**

- Create new roles with custom names, labels, and emojis
- Automatic validation to prevent duplicate role names
- Real-time integration across the entire application

### ✏️ **Edit Custom Roles**

- Update role labels and emojis
- Role names (IDs) are immutable for data consistency
- Live updates throughout the system

### 🗑️ **Delete Custom Roles**

- Remove custom roles with confirmation
- Automatic cleanup of associated permissions
- Cannot delete default system roles

### 🔒 **Permission Management**

- Set permissions for custom roles on all content plan columns
- Visual indicators for custom vs default roles
- Persistent storage in localStorage

---

## 🎯 How to Use

### **1. Access Role Management**

```
1. Login as Admin (admin@crm.com / admin123)
2. Go to "Permissions" page
3. Click "Add Role" button
```

### **2. Create a New Role**

```
1. Fill in the form:
   - Role Name: e.g., "project-coordinator" (auto-formatted)
   - Display Label: e.g., "Project Coordinator"
   - Emoji: e.g., "📋"
2. Click "Add Role"
3. ✅ Role appears in the permissions matrix!
```

### **3. Edit Custom Roles**

```
1. Find your custom role in the permissions table
2. Click the blue Edit icon (✏️)
3. Update label and/or emoji
4. Click "Update Role"
```

### **4. Delete Custom Roles**

```
1. Find your custom role in the permissions table
2. Click the red Delete icon (🗑️)
3. Click "Confirm" to delete
4. Role and its permissions are removed
```

---

## 🔧 Technical Implementation

### **Type System**

```typescript
export type UserRole =
  | "admin"
  | "account-manager"
  | "graphic-designer"
  | "social-media"
  | "content-writer"
  | "video-editor"
  | "ads-specialist"
  | "seo-specialist"
  | string; // ✅ Now supports custom roles!

export type CustomRole = {
  id: string;
  name: string; // e.g., "project-manager"
  label: string; // e.g., "Project Manager"
  emoji: string; // e.g., "📋"
  isCustom: boolean;
  createdAt: string;
  createdBy: string;
};
```

### **Data Management**

```typescript
// DataContext provides:
- customRoles: CustomRole[]
- addCustomRole(role)
- updateCustomRole(id, updates)
- deleteCustomRole(id)
- getAllRoles() // Returns combined default + custom roles
```

### **Storage**

- All custom roles are stored in `localStorage`
- Automatic persistence across sessions
- No backend required

---

## 🎨 UI Features

### **Visual Indicators**

- **Custom Badge**: Custom roles show a purple "Custom" badge
- **Edit/Delete Actions**: Only available for custom roles
- **Emoji Support**: Full emoji support for role icons

### **Permissions Matrix**

- Custom roles appear alongside default roles
- Same permission management as default roles
- Visual distinction with custom badge

### **Registration Page**

- Custom roles automatically appear in role dropdown
- Admin role is excluded from registration options
- Dynamic updates when new roles are added

---

## 📊 Example Usage

### **Create Marketing Team Roles**

```
1. Add "content-strategist" → 📈 Content Strategist
2. Add "brand-manager" → 🏷️ Brand Manager
3. Add "community-manager" → 👥 Community Manager
```

### **Set Permissions**

```
Content Strategist:
✅ Design Brief, Text Content, Notes
❌ Design, Drive Link

Brand Manager:
✅ All columns (full access)

Community Manager:
✅ Text Content, Notes, Status
❌ Design Brief, Design, Drive Link
```

---

## 🔄 Integration Points

### **Automatic Updates**

- **Registration**: New roles appear in role dropdown
- **User Management**: Custom roles available for user assignment
- **Permissions**: Full permission control for custom roles
- **Content Tables**: Permission enforcement works immediately

### **Data Consistency**

- Role deletions clean up associated permissions
- Role updates propagate throughout the system
- No orphaned data or broken references

---

## 🛡️ Security & Validation

### **Role Name Validation**

- Automatic kebab-case formatting (spaces → hyphens)
- Duplicate name prevention
- Required field validation

### **Permission Inheritance**

- New roles start with no permissions (secure by default)
- Admin must explicitly grant permissions
- Cannot modify admin permissions (always full access)

### **Deletion Safety**

- Cannot delete default system roles
- Confirmation required for custom role deletion
- Automatic cleanup of associated data

---

## 🎉 Benefits

### **For Admins**

- **Flexibility**: Create roles that match your organization
- **Control**: Fine-grained permission management
- **Scalability**: Add roles as your team grows

### **For Organizations**

- **Customization**: Roles that fit your workflow
- **Security**: Proper access control
- **Growth**: Easy to adapt as needs change

### **For Users**

- **Clarity**: Clear role definitions
- **Efficiency**: Appropriate access levels
- **Experience**: Smooth registration process

---

## 🚀 Future Enhancements

### **Potential Features**

- Role hierarchies and inheritance
- Bulk permission assignment
- Role templates and presets
- Advanced role analytics
- Integration with external systems

---

## 🎯 Demo Instructions

### **Quick Test**

```
1. Login as Admin
2. Go to Permissions page
3. Click "Add Role"
4. Create: "project-coordinator" / "📋 Project Coordinator"
5. Set some permissions
6. Go to Register page
7. ✅ See your new role in the dropdown!
8. Go back to Permissions
9. Edit or delete your custom role
10. ✅ Changes reflect immediately!
```

---

**🎭 Dynamic Roles Management - Making the CRM truly adaptable to your organization! 🚀**
