# ✅ Deployment Checklist - قائمة الرفع

## 🎯 **قبل الرفع على السيرفر**

### ✅ **Code Ready:**

- [x] All features tested locally
- [x] npm run build succeeds
- [x] No linter errors
- [x] No console errors
- [x] All pages load correctly
- [x] Database schema finalized
- [x] API routes working
- [x] Dummy data available

### ✅ **Configuration Files:**

- [x] .env.example created
- [x] .gitignore updated
- [x] ecosystem.config.js ready
- [x] prisma/schema.prisma ready
- [x] next.config.ts optimized
- [x] package.json scripts complete

### ✅ **Documentation:**

- [x] README.md complete
- [x] SERVER_DEPLOYMENT_GUIDE.md
- [x] BACKEND_COMPLETE_GUIDE.md
- [x] PRODUCTION_READY.md
- [x] All guides written

### ✅ **Repository:**

- [ ] Code pushed to GitHub/GitLab
- [ ] All files committed
- [ ] .env not committed (in .gitignore)
- [ ] README updated

---

## 🖥️ **على السيرفر**

### 1️⃣ **Server Setup:**

- [ ] VPS purchased (Hetzner, DigitalOcean, etc.)
- [ ] SSH access configured
- [ ] Ubuntu 22.04 installed
- [ ] Root/sudo access available

### 2️⃣ **Install Requirements:**

- [ ] Run deploy.sh script
  ```bash
  chmod +x deploy.sh
  sudo ./deploy.sh
  ```
- [ ] Node.js installed
- [ ] PostgreSQL installed
- [ ] nginx installed
- [ ] PM2 installed
- [ ] Git installed

### 3️⃣ **Clone & Install:**

- [ ] Repository cloned to /var/www/crm-app
- [ ] npm install completed
- [ ] No errors during installation

### 4️⃣ **Configure Environment:**

- [ ] .env file created
- [ ] DATABASE_URL set (PostgreSQL)
- [ ] NEXTAUTH_SECRET generated
- [ ] Domain URLs updated
- [ ] NODE_ENV=production

### 5️⃣ **Database Setup:**

- [ ] PostgreSQL database created
- [ ] User created with password
- [ ] Permissions granted
- [ ] Schema switched to postgresql
- [ ] npm run db:generate
- [ ] npm run db:migrate
- [ ] npm run db:seed

### 6️⃣ **Build Application:**

- [ ] npm run build completed
- [ ] No build errors
- [ ] .next folder created

### 7️⃣ **Start Application:**

- [ ] PM2 started (pm2 start ecosystem.config.js)
- [ ] PM2 startup configured
- [ ] PM2 save executed
- [ ] App accessible on port 3000

### 8️⃣ **Configure nginx:**

- [ ] Config file created in sites-available
- [ ] Symlink created in sites-enabled
- [ ] nginx -t passes
- [ ] nginx restarted
- [ ] App accessible via domain (HTTP)

### 9️⃣ **SSL Certificate:**

- [ ] certbot installed
- [ ] SSL certificate obtained
- [ ] HTTPS working
- [ ] Auto-renewal configured
- [ ] App accessible via HTTPS

### 🔟 **Final Checks:**

- [ ] App loads on https://your-domain.com
- [ ] All pages accessible
- [ ] Database operations work
- [ ] Images load
- [ ] No console errors
- [ ] Mobile responsive working
- [ ] PM2 auto-restart working

---

## 🔒 **Security Checklist**

### Basic Security:

- [ ] Firewall enabled (UFW)
- [ ] SSH key authentication
- [ ] Strong database password
- [ ] .env file secured (600 permissions)
- [ ] SSL certificate active

### Advanced Security (Optional):

- [ ] SSH port changed from 22
- [ ] fail2ban installed
- [ ] Rate limiting configured
- [ ] CORS configured
- [ ] Security headers added
- [ ] Regular updates scheduled

---

## 💾 **Backup Checklist**

- [ ] Backup script created
- [ ] Cron job scheduled (daily)
- [ ] Backup directory created
- [ ] Test backup/restore
- [ ] Retention policy set (30 days)

---

## 📊 **Monitoring Checklist**

- [ ] PM2 monitoring active (pm2 monit)
- [ ] Logs accessible (pm2 logs)
- [ ] Disk space monitored (df -h)
- [ ] Database size monitored
- [ ] Error tracking (optional: Sentry)
- [ ] Uptime monitoring (optional: UptimeRobot)

---

## 🎯 **Performance Checklist**

- [ ] nginx gzip enabled
- [ ] Static file caching
- [ ] Database indexes added
- [ ] Image optimization working
- [ ] Code compression enabled
- [ ] Load time < 3s

---

## 📱 **Domain & DNS Checklist**

- [ ] Domain purchased (optional)
- [ ] A record pointing to server IP
- [ ] www subdomain configured
- [ ] DNS propagated (check: nslookup)
- [ ] nginx configured with domain
- [ ] SSL certificate for domain

---

## 🧪 **Testing Checklist**

### Functional Testing:

- [ ] Homepage loads
- [ ] Dashboard shows data
- [ ] Clients CRUD works
- [ ] Projects CRUD works
- [ ] Tasks CRUD works
- [ ] Campaigns CRUD works
- [ ] Content CRUD works
- [ ] Calendar displays
- [ ] Reports generate
- [ ] Search works
- [ ] Filters work
- [ ] Export works
- [ ] Bulk actions work
- [ ] Quick actions (Ctrl+K) work

### Performance Testing:

- [ ] Page load < 3s
- [ ] API response < 500ms
- [ ] No memory leaks
- [ ] PM2 stable

### Security Testing:

- [ ] HTTPS enforced
- [ ] No sensitive data exposed
- [ ] Database secured
- [ ] API endpoints validated

---

## 📝 **Post-Deployment**

### Immediate (Day 1):

- [ ] Test all features
- [ ] Monitor logs for errors
- [ ] Check PM2 status
- [ ] Verify database working
- [ ] Test from mobile
- [ ] Share with team

### Week 1:

- [ ] Monitor performance
- [ ] Check disk space
- [ ] Review logs
- [ ] Test backups
- [ ] User feedback collected

### Month 1:

- [ ] Performance review
- [ ] Security audit
- [ ] Backup verification
- [ ] Cost analysis
- [ ] Plan improvements

---

## 🎊 **Success Criteria**

### ✅ **Deployment Successful When:**

```
✅ App accessible via HTTPS
✅ All features working
✅ Database persisting data
✅ No critical errors
✅ PM2 auto-restart working
✅ Backups running
✅ SSL valid
✅ Performance acceptable
```

---

## 🚀 **Quick Start Commands**

### Development (Now):

```bash
npm run dev
# ✅ Works with SQLite
```

### Production (On Server):

```bash
# 1. Setup
sudo ./deploy.sh

# 2. Clone & Install
cd /var/www
git clone YOUR_REPO crm-app
cd crm-app
npm install

# 3. Configure
nano .env  # Add DATABASE_URL

# 4. Database
npm run db:generate
npm run db:migrate
npm run db:seed

# 5. Build & Start
npm run build
pm2 start ecosystem.config.js
pm2 save

# 6. nginx + SSL
# (see SERVER_DEPLOYMENT_GUIDE.md)

# ✅ Live!
```

---

## 📞 **Troubleshooting**

### Problem: Build fails

```bash
# Check logs
npm run build 2>&1 | tee build.log

# Common fixes:
npm install
rm -rf .next
npm run build
```

### Problem: Database connection fails

```bash
# Test connection
psql -U crm_user -d crm_db

# Check .env
cat .env | grep DATABASE_URL

# Check PostgreSQL status
sudo systemctl status postgresql
```

### Problem: PM2 not starting

```bash
# Check logs
pm2 logs crm-agency

# Restart
pm2 restart crm-agency

# Check node
which node
node -v
```

### Problem: nginx 502

```bash
# Check app is running
pm2 status

# Check nginx config
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log
```

---

## 🎯 **Files to Update on Server**

### 1. prisma/schema.prisma

```prisma
// Change from:
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

// To:
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 2. .env

```env
DATABASE_URL="postgresql://crm_user:YourPassword@localhost:5432/crm_db"
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NODE_ENV="production"
```

### 3. ecosystem.config.js

```javascript
// Update path:
cwd: '/var/www/crm-app',  // Your actual path
```

---

## 🎉 **Summary**

### ✅ **Ready for Development:**

```bash
npm run dev
# SQLite automatic
# No setup needed
```

### ✅ **Ready for Production:**

```bash
# All files ready
# Scripts ready
# Documentation ready
# Just deploy!
```

### 📊 **Timeline:**

```
Development: ✅ Ready now
Deployment: 1-2 hours
Total: Ready when you are!
```

---

**🎊 المشروع جاهز 100% للرفع! ✨**
