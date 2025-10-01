# Marketing Agency CRM System

A comprehensive CRM (Customer Relationship Management) system built with Next.js, designed specifically for marketing agencies to manage clients, projects, tasks, campaigns, and content planning.

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)
![React](https://img.shields.io/badge/React-19.1.0-61dafb)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8)

## 🎨 Design Theme

- **Background Color**: `#0c081e` (Dark purple)
- **Primary Color**: `#563EB7` (Purple)
- **Auxiliary Color**: White
- **Style**: Clean, modern dashboard with sidebar navigation and top bar
- **Responsive**: Fully responsive design for Desktop, Tablet, and Mobile

## ✨ Features

### 1. **Dashboard**

- Overview of all active projects, tasks, and campaigns
- Quick stats and KPIs at a glance
- Recent activity feed
- Visual progress indicators

### 2. **Clients Module**

- Complete CRUD operations (Create, Read, Update, Delete)
- Client information management:
  - Client Name
  - Contact Person
  - Phone & Email
  - Company
  - Notes
- View linked projects for each client
- Search and filter capabilities

### 3. **Projects Module**

- Comprehensive project management
- Fields include:
  - Project Name & Description
  - Client (Linked)
  - Start Date / End Date
  - Status (Planned, In Progress, Completed, On Hold)
  - Project Manager
  - Progress tracking (0-100%)
  - Linked Tasks, Campaigns, and Content
- Visual progress bars
- Card-based project view

### 4. **Tasks Module**

- Task Types:
  - Content Writing
  - Graphic Design
  - Video Editing
  - Ads Setup
  - SEO
  - Reporting
  - General
- Status tracking:
  - To Do
  - In Progress
  - Review
  - Done
  - Delayed
- Priority levels (Low, Medium, High, Urgent)
- Assignee management
- Due date tracking
- Progress indicators
- Filterable table view

### 5. **Campaigns Module**

- Campaign Types:
  - Facebook Ads
  - Instagram Ads
  - Google Ads
  - LinkedIn Ads
  - Email Marketing
  - Offline Campaign
- Campaign objectives (Awareness, Engagement, Leads, Sales)
- Budget tracking
- KPI monitoring (CTR, CPC, Conversions, ROAS, etc.)
- Status management (Planned, Running, Paused, Completed)
- Progress tracking

### 6. **Content Planning Module**

- Content Types:
  - Post
  - Video
  - Article
  - Graphic
  - Email
  - Other
- Content status workflow:
  - Idea
  - In Progress
  - Review
  - Approved
  - Scheduled
  - Published
- Priority management
- Assignee tracking
- Publish date scheduling
- Link to projects and campaigns

### 7. **Social Calendar**

- Monthly calendar view
- Visual representation of all scheduled content and tasks
- Status indicators:
  - ✅ Published/Done (Green)
  - ✏️ In Progress/Review (Blue)
  - ⏳ Delayed (Red)
  - 📅 Planned/Scheduled (Gray)
- Navigate between months
- Day-by-day breakdown

### 8. **Reports & Analytics**

- Comprehensive reporting dashboard
- Filter by Client and Project
- Key metrics:
  - Task completion rates
  - Campaign performance
  - Content status breakdown
  - Team workload distribution
  - Project progress overview
- Visual statistics and charts
- Budget tracking

### 9. **Notifications**

- Real-time notification system
- Notification types:
  - Task assignments
  - Status updates
  - Approaching deadlines
  - New comments
- Unread count indicator
- Mark as read functionality

## 🛠️ Technology Stack

- **Framework**: [Next.js 15.5.4](https://nextjs.org/)
- **UI Library**: [React 19.1.0](https://react.dev/)
- **Styling**: [TailwindCSS 4.0](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript 5+
- **State Management**: React Context API

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd crm-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Run development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🚀 Build for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
crm-app/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── page.tsx           # Dashboard
│   │   ├── clients/           # Clients module
│   │   ├── projects/          # Projects module
│   │   ├── tasks/             # Tasks module
│   │   ├── campaigns/         # Campaigns module
│   │   ├── content/           # Content planning module
│   │   ├── calendar/          # Social calendar
│   │   ├── reports/           # Reports & analytics
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable UI components
│   │   ├── Badge.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── ProgressBar.tsx
│   │   ├── Select.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Table.tsx
│   │   └── Topbar.tsx
│   ├── context/               # React Context providers
│   │   └── DataContext.tsx   # Global state management
│   ├── lib/                   # Utilities and helpers
│   │   └── dummy-data.ts     # Sample data
│   └── types/                 # TypeScript type definitions
│       └── index.ts
├── public/                    # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

## 🎯 Key Components

### Reusable UI Components

- **Badge**: Status and priority indicators
- **Button**: Customizable button with variants (primary, secondary, danger, ghost)
- **Card**: Container component with optional title and actions
- **Input/Textarea**: Form input components with labels and error states
- **Modal**: Dialog component with customizable size
- **ProgressBar**: Visual progress indicator (0-100%)
- **Select**: Dropdown selection component
- **Table**: Data table with sortable columns
- **Sidebar**: Main navigation sidebar
- **Topbar**: Top navigation bar with search and notifications

### Data Management

The application uses React Context API for global state management. All data is stored in-memory and initialized with dummy data. In a production environment, this would be replaced with API calls to a backend service.

## 🎨 Theme Customization

The theme colors are defined in `src/app/globals.css`:

```css
:root {
  --background: #0c081e;
  --foreground: #ffffff;
  --primary: #563eb7;
  --primary-hover: #6d4dd4;
  --primary-dark: #3f2c8a;
}
```

TailwindCSS color palette is configured inline with custom primary colors.

## 📊 Dummy Data

The application comes pre-loaded with sample data including:

- 3 Clients
- 4 Projects
- 8 Tasks
- 4 Campaigns
- 8 Content items
- 5 Users
- 4 Notifications

This data is located in `src/lib/dummy-data.ts` and can be modified or replaced as needed.

## 🔐 User Roles

The system supports four user roles:

- **Admin**: Full system access
- **Project Manager**: Manage projects and teams
- **Team Member**: Execute tasks and create content
- **Client**: View-only access to their projects

## 🚧 Future Enhancements

- [ ] Backend API integration
- [ ] Database persistence (PostgreSQL/MongoDB)
- [ ] User authentication and authorization
- [ ] Real-time collaboration features
- [ ] File upload and storage
- [ ] Email notifications
- [ ] Advanced analytics and reporting
- [ ] Export reports (PDF, Excel)
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] Integrations (Slack, Google Calendar, etc.)

## 🤝 Contributing

This is a demonstration project. For production use, consider:

1. Adding proper authentication
2. Implementing a backend API
3. Adding database persistence
4. Implementing proper error handling
5. Adding comprehensive testing
6. Setting up CI/CD pipeline

## 📝 License

This project is created as a demonstration of a CRM system for marketing agencies.

## 👨‍💻 Developer Notes

- The project uses Next.js 15 with the App Router
- All components are client components (marked with 'use client')
- TypeScript is used throughout for type safety
- TailwindCSS v4 is used with the new inline theme syntax
- The project is fully responsive and optimized for all screen sizes

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

---

**Built with ❤️ using Next.js, React, and TailwindCSS**
