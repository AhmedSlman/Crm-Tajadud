# 🚀 دليل الرفع على السيرفر - Server Deployment Guide

## 🎯 **خطة الرفع على سيرفر خاص**

---

## 📋 **الخيارات المتاحة**

### Option 1: VPS مع PostgreSQL (موصى به) ⭐

```
✅ Full control
✅ No vendor lock-in
✅ Cost-effective ($5-20/month)
✅ Scalable
```

### Option 2: VPS مع SQLite (للبداية)

```
✅ Super simple
✅ No database server needed
✅ Single file database
⚠️ Not for multi-user production
```

---

## 🔧 **Setup للتطوير (الآن)**

### استخدام SQLite (لا يحتاج أي setup!)

```bash
# 1. Create .env file
cp .env.example .env

# .env will have:
DATABASE_URL="file:./dev.db"

# 2. Generate Prisma Client
npm run db:generate

# 3. Create database (automatic!)
npm run db:migrate

# 4. Add sample data
npm run db:seed

# 5. ✅ Done! Database file created: prisma/dev.db
```

**المميزات:**

- ✅ لا يحتاج installation
- ✅ ملف واحد (dev.db)
- ✅ سريع جداً
- ✅ مثالي للتطوير

**للتبديل لـ PostgreSQL لاحقاً:**

- فقط غيّر provider في schema.prisma
- غيّر DATABASE_URL في .env
- Run migrations مرة تانية

---

## 🖥️ **Deployment على السيرفر الخاص**

### المتطلبات:

```
✅ VPS/Server (Ubuntu/Debian)
✅ Node.js 18+
✅ PostgreSQL (if using)
✅ nginx (web server)
✅ PM2 (process manager)
✅ Domain name (optional)
```

---

## 📦 **الخطوات الكاملة**

### Step 1: Setup Server (Ubuntu 22.04)

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# 4. Install nginx
sudo apt install -y nginx

# 5. Install PM2
sudo npm install -g pm2

# 6. Install git
sudo apt install -y git
```

---

### Step 2: Setup PostgreSQL

```bash
# 1. Switch to postgres user
sudo -u postgres psql

# 2. Create database and user
CREATE DATABASE crm_db;
CREATE USER crm_user WITH PASSWORD 'your-strong-password';
GRANT ALL PRIVILEGES ON DATABASE crm_db TO crm_user;
\q

# 3. Allow remote connections (if needed)
sudo nano /etc/postgresql/14/main/postgresql.conf
# Find: listen_addresses = 'localhost'
# Change to: listen_addresses = '*'

sudo nano /etc/postgresql/14/main/pg_hba.conf
# Add: host  all  all  0.0.0.0/0  md5

sudo systemctl restart postgresql
```

---

### Step 3: Deploy Application

```bash
# 1. Clone repository
cd /var/www
sudo git clone https://github.com/your-username/crm-app.git
cd crm-app

# 2. Install dependencies
sudo npm install

# 3. Create .env file
sudo nano .env

# Add:
DATABASE_URL="postgresql://crm_user:your-password@localhost:5432/crm_db"
NEXTAUTH_URL="http://your-domain.com"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXT_PUBLIC_APP_URL="http://your-domain.com"

# 4. Setup Prisma
npm run db:generate
npm run db:migrate
npm run db:seed

# 5. Build application
npm run build

# 6. Test
npm start
# Visit: http://your-server-ip:3000
```

---

### Step 4: Setup PM2 (Process Manager)

```bash
# 1. Create ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'crm-app',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/crm-app',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# 2. Start with PM2
pm2 start ecosystem.config.js

# 3. Setup auto-restart on server reboot
pm2 startup
pm2 save

# 4. Monitor
pm2 status
pm2 logs crm-app
```

---

### Step 5: Setup nginx (Reverse Proxy)

```bash
# 1. Create nginx config
sudo nano /etc/nginx/sites-available/crm-app

# Add:
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# 2. Enable site
sudo ln -s /etc/nginx/sites-available/crm-app /etc/nginx/sites-enabled/

# 3. Test nginx config
sudo nginx -t

# 4. Restart nginx
sudo systemctl restart nginx

# 5. ✅ Visit: http://your-domain.com
```

---

### Step 6: Setup SSL (HTTPS)

```bash
# 1. Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# 2. Get SSL certificate
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 3. Follow prompts (enter email, agree to terms)

# 4. Test auto-renewal
sudo certbot renew --dry-run

# 5. ✅ Visit: https://your-domain.com
```

---

## 🔄 **Update Workflow**

### عند عمل تحديثات:

```bash
# 1. SSH to server
ssh user@your-server

# 2. Navigate to project
cd /var/www/crm-app

# 3. Pull latest code
git pull origin main

# 4. Install new dependencies (if any)
npm install

# 5. Run migrations (if database changed)
npm run db:migrate

# 6. Rebuild
npm run build

# 7. Restart PM2
pm2 restart crm-app

# 8. ✅ Updated!
```

---

## 💰 **Server Cost Estimation**

### Budget Options:

#### Small Agency (< 20 users):

```
VPS: DigitalOcean Droplet $6/month
   - 1 GB RAM
   - 1 vCPU
   - 25 GB SSD

or Hetzner $4/month
   - 2 GB RAM
   - 1 vCPU
   - 20 GB SSD

Total: $4-6/month ✨
```

#### Medium Agency (20-100 users):

```
VPS: DigitalOcean $12/month
   - 2 GB RAM
   - 1 vCPU
   - 50 GB SSD

or Hetzner $8/month
   - 4 GB RAM
   - 2 vCPU
   - 40 GB SSD

Total: $8-12/month
```

#### Large Agency (100+ users):

```
VPS: DigitalOcean $24/month
   - 4 GB RAM
   - 2 vCPU
   - 80 GB SSD

Total: $24/month
```

**Additional:**

```
Domain: $10-15/year (~$1/month)
SSL: Free (Let's Encrypt)
Backups: $2-5/month (optional)

Total: $5-30/month
```

---

## 🎯 **VPS Providers Comparison**

| Provider         | Price | RAM | Storage | Recommended       |
| ---------------- | ----- | --- | ------- | ----------------- |
| **Hetzner**      | $4/mo | 2GB | 20GB    | ✅ Best Value     |
| **DigitalOcean** | $6/mo | 1GB | 25GB    | ✅ Easy to use    |
| **Linode**       | $5/mo | 1GB | 25GB    | ✅ Good           |
| **Vultr**        | $6/mo | 1GB | 25GB    | ✅ Fast           |
| **Contabo**      | $5/mo | 8GB | 200GB   | ✅ Huge resources |

**توصيتي: Hetzner** 🏆

- أرخص سعر
- موارد ممتازة
- سريع جداً
- Support جيد

---

## 📝 **Server Setup Script (Automated)**

Create `setup-server.sh`:

```bash
#!/bin/bash

echo "🚀 Setting up CRM Server..."

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL
sudo apt install -y postgresql postgresql-contrib

# Install nginx
sudo apt install -y nginx

# Install PM2
sudo npm install -g pm2

# Install Git
sudo apt install -y git

# Setup PostgreSQL
sudo -u postgres psql -c "CREATE DATABASE crm_db;"
sudo -u postgres psql -c "CREATE USER crm_user WITH PASSWORD 'ChangeThis123!';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE crm_db TO crm_user;"

# Setup firewall
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

echo "✅ Server setup complete!"
echo "Next steps:"
echo "1. Clone your repository"
echo "2. Configure .env"
echo "3. Run migrations"
echo "4. Build app"
echo "5. Setup nginx"
```

**Usage:**

```bash
chmod +x setup-server.sh
./setup-server.sh
```

---

## 🔥 **Quick Start (Development with SQLite)**

### الآن - للتطوير المحلي:

```bash
# 1. Create .env
echo 'DATABASE_URL="file:./dev.db"' > .env

# 2. Generate & Migrate
npm run db:generate
npm run db:migrate

# 3. Seed
npm run db:seed

# 4. Start
npm run dev

# ✅ Database: prisma/dev.db (file-based)
```

**المميزات:**

- ✅ لا يحتاج PostgreSQL installation
- ✅ سريع جداً
- ✅ ملف واحد (dev.db)
- ✅ مثالي للتطوير

---

## 🖥️ **للسيرفر الخاص**

### Step 1: تجهيز السيرفر

```bash
# SSH to your server
ssh root@your-server-ip

# Run setup
bash <(curl -s https://raw.githubusercontent.com/your-repo/setup-server.sh)
```

### Step 2: Deploy المشروع

```bash
# Clone
cd /var/www
git clone your-repo-url crm-app
cd crm-app

# Install
npm install --production

# Configure
nano .env
# Add:
DATABASE_URL="postgresql://crm_user:password@localhost:5432/crm_db"
NEXTAUTH_SECRET="your-secret"

# Setup database
npm run db:generate
npm run db:migrate
npm run db:seed

# Build
npm run build

# Start with PM2
pm2 start npm --name "crm-app" -- start
pm2 save
pm2 startup
```

### Step 3: Configure nginx

```bash
sudo nano /etc/nginx/sites-available/crm

# Add config (see above)

sudo ln -s /etc/nginx/sites-available/crm /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 4: SSL Certificate

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

**✅ Done! Visit: https://your-domain.com**

---

## 🔄 **Database Migration Path**

```
Development:
  SQLite (file:./dev.db)
  ↓
Testing/Staging:
  PostgreSQL (on staging server)
  ↓
Production:
  PostgreSQL (on production server)
```

**للتبديل:**

```prisma
// schema.prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

```bash
# Update .env
DATABASE_URL="postgresql://user:pass@server:5432/db"

# Re-migrate
npm run db:migrate
```

---

## 📊 **Recommended Server Specs**

### Development/Testing:

```
- 1 GB RAM
- 1 vCPU
- 10 GB Storage
- Cost: $4-6/month
```

### Small Production (< 50 users):

```
- 2 GB RAM
- 2 vCPU
- 20 GB Storage
- Cost: $8-12/month
```

### Medium Production (50-200 users):

```
- 4 GB RAM
- 2 vCPU
- 40 GB Storage
- Cost: $20-30/month
```

---

## 🎯 **Complete Deployment Checklist**

### Pre-deployment:

```
✅ Code tested locally
✅ Database schema finalized
✅ Environment variables documented
✅ Build succeeds
✅ No console errors
```

### Server Setup:

```
✅ VPS created
✅ SSH access configured
✅ Node.js installed
✅ PostgreSQL installed (or using SQLite)
✅ nginx installed
✅ PM2 installed
✅ Firewall configured
```

### Application Deploy:

```
✅ Code cloned
✅ Dependencies installed
✅ .env configured
✅ Database migrated
✅ App built
✅ PM2 started
✅ nginx configured
✅ SSL enabled
```

### Post-deployment:

```
✅ App accessible via domain
✅ HTTPS working
✅ Database accessible
✅ PM2 auto-restart enabled
✅ Backups configured
✅ Monitoring setup
```

---

## 🔒 **Security Checklist**

```
✅ SSL Certificate (HTTPS)
✅ Firewall enabled (UFW)
✅ SSH key authentication (disable password)
✅ Change default ports
✅ Database password strong
✅ Environment variables secured
✅ Regular updates
✅ Backup strategy
✅ Rate limiting (nginx)
✅ CORS configuration
```

---

## 💾 **Backup Strategy**

### Database Backup:

```bash
# Create backup script
cat > /var/www/backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/var/backups/crm"
mkdir -p $BACKUP_DIR

# Backup database
pg_dump -U crm_user crm_db > $BACKUP_DIR/db_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "db_*.sql" -mtime +7 -delete

echo "Backup completed: db_$DATE.sql"
EOF

chmod +x /var/www/backup.sh

# Schedule daily backup (cron)
crontab -e
# Add:
0 2 * * * /var/www/backup.sh
```

### For SQLite:

```bash
# Simply copy the db file
cp prisma/dev.db backups/dev_$(date +%Y%m%d).db
```

---

## 🎓 **Development vs Production**

### Development (Local):

```yaml
Database: SQLite (file:./dev.db)
Server: npm run dev (port 3000)
Hot Reload: Yes
Debug: Enabled
Auth: Optional
HTTPS: Not needed
```

### Production (Server):

```yaml
Database: PostgreSQL (on server)
Server: PM2 + nginx (port 80/443)
Hot Reload: No
Debug: Disabled
Auth: Required (add later)
HTTPS: Required (Let's Encrypt)
```

---

## 🚀 **Quick Commands Reference**

### Local Development:

```bash
npm run dev              # Start dev
npm run db:studio        # View database
npm run db:migrate       # Update schema
npm run db:seed          # Add data
```

### On Server:

```bash
pm2 start crm-app        # Start app
pm2 stop crm-app         # Stop app
pm2 restart crm-app      # Restart app
pm2 logs crm-app         # View logs
pm2 monit                # Monitor resources
```

### Database:

```bash
# Backup
pg_dump -U crm_user crm_db > backup.sql

# Restore
psql -U crm_user crm_db < backup.sql

# Connect
psql -U crm_user -d crm_db
```

---

## 🎯 **Monitoring & Maintenance**

### Setup Monitoring:

```bash
# Install htop
sudo apt install htop

# Monitor resources
htop

# PM2 monitoring
pm2 monit

# Disk space
df -h

# Database size
sudo -u postgres psql -c "SELECT pg_size_pretty(pg_database_size('crm_db'));"
```

### Log Management:

```bash
# PM2 logs
pm2 logs crm-app --lines 100

# nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

---

## 🔥 **Performance Optimization**

### nginx:

```nginx
# Enable gzip compression
gzip on;
gzip_types text/plain text/css application/json application/javascript;

# Cache static files
location /_next/static {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### PostgreSQL:

```sql
-- Add indexes for better performance
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to_id);
CREATE INDEX idx_projects_client ON projects(client_id);
```

### Next.js:

```typescript
// next.config.ts
const nextConfig = {
  output: "standalone", // Smaller build
  compress: true, // Enable compression
};
```

---

## 📱 **Domain Setup**

### If you have a domain:

```bash
# 1. Point A record to your server IP
#    In your domain registrar (Namecheap, GoDaddy, etc.):
#    A Record: @ → your-server-ip
#    A Record: www → your-server-ip

# 2. Wait for DNS propagation (5-30 mins)

# 3. Update nginx config with your domain

# 4. Get SSL
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 5. ✅ Done!
```

---

## 🎊 **Final Production Checklist**

```
Pre-Launch:
✅ All features tested
✅ Database backed up
✅ Environment variables set
✅ Build successful
✅ SSL certificate obtained
✅ Domain configured
✅ Monitoring setup

Post-Launch:
✅ Health check passed
✅ Performance acceptable
✅ Backups running
✅ Logs being collected
✅ Team trained
✅ Documentation shared
```

---

## 💡 **Tips للسيرفر الخاص**

### Security:

```
1. غيّر SSH port من 22
2. استخدم SSH keys بدل passwords
3. Install fail2ban
4. Update regularly
5. Backup يومياً
```

### Performance:

```
1. استخدم CDN للملفات الثابتة
2. Enable nginx caching
3. Optimize database queries
4. Monitor resources
5. Scale when needed
```

### Reliability:

```
1. PM2 للـ auto-restart
2. nginx للـ load balancing
3. Database replication (advanced)
4. Health checks
5. Alerting system
```

---

## 🎯 **Quick Decision**

### للتطوير الآن:

```bash
# SQLite - No Setup Needed!
DATABASE_URL="file:./dev.db"
npm run db:migrate
npm run db:seed
npm run dev
# ✅ Works immediately!
```

### للسيرفر الخاص:

```
1. Rent VPS (Hetzner $4/month)
2. Follow deployment steps above
3. Use PostgreSQL
4. Setup nginx + SSL
5. Deploy!
```

---

## 🎉 **Summary**

### ✅ **Development:**

```
SQLite
  ↓
No installation needed
  ↓
file:./dev.db
  ↓
npm run db:migrate
  ↓
✅ Ready!
```

### ✅ **Production:**

```
VPS Server ($4-30/month)
  ↓
PostgreSQL
  ↓
nginx + SSL
  ↓
PM2
  ↓
✅ Production Ready!
```

---

**🚀 للبداية الآن (SQLite):**

```bash
echo 'DATABASE_URL="file:./dev.db"' > .env
npm run db:generate
npm run db:migrate
npm run db:seed
npm run dev
```

**🖥️ للسيرفر الخاص:**

- اتبع خطوات Deployment أعلاه
- استخدم PostgreSQL
- $4-30/month حسب الحجم

**🎊 النظام جاهز للطريقتين! ✨**
