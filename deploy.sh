#!/bin/bash

# ============================================
# CRM Agency - Server Deployment Script
# ============================================

set -e  # Exit on error

echo "🚀 Starting CRM Deployment..."
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Functions
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    error "Please run as root (sudo ./deploy.sh)"
    exit 1
fi

# Update System
info "Updating system packages..."
apt update && apt upgrade -y
success "System updated"

# Install Node.js
info "Installing Node.js..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
    apt install -y nodejs
    success "Node.js installed: $(node -v)"
else
    success "Node.js already installed: $(node -v)"
fi

# Install PostgreSQL
info "Installing PostgreSQL..."
if ! command -v psql &> /dev/null; then
    apt install -y postgresql postgresql-contrib
    success "PostgreSQL installed"
else
    success "PostgreSQL already installed"
fi

# Install nginx
info "Installing nginx..."
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
    success "nginx installed"
else
    success "nginx already installed"
fi

# Install PM2
info "Installing PM2..."
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    success "PM2 installed"
else
    success "PM2 already installed"
fi

# Install Git
info "Installing Git..."
apt install -y git
success "Git installed"

# Setup PostgreSQL Database
info "Setting up PostgreSQL database..."
sudo -u postgres psql -c "CREATE DATABASE crm_db;" 2>/dev/null || info "Database already exists"
sudo -u postgres psql -c "CREATE USER crm_user WITH PASSWORD 'ChangeThisPassword123!';" 2>/dev/null || info "User already exists"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE crm_db TO crm_user;" 2>/dev/null
success "PostgreSQL database configured"

# Setup Firewall
info "Configuring firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable
success "Firewall configured"

# Create project directory
info "Creating project directory..."
mkdir -p /var/www
success "Directory created"

echo ""
success "========================================="
success "Server setup complete!"
success "========================================="
echo ""
echo "Next steps:"
echo "1. Clone your repository:"
echo "   cd /var/www"
echo "   git clone YOUR_REPO_URL crm-app"
echo ""
echo "2. Configure application:"
echo "   cd crm-app"
echo "   npm install"
echo "   nano .env  # Add DATABASE_URL and secrets"
echo ""
echo "3. Setup database:"
echo "   npm run db:generate"
echo "   npm run db:migrate"
echo "   npm run db:seed"
echo ""
echo "4. Build and start:"
echo "   npm run build"
echo "   pm2 start ecosystem.config.js"
echo "   pm2 save"
echo ""
echo "5. Configure nginx (see SERVER_DEPLOYMENT_GUIDE.md)"
echo ""
echo "6. Setup SSL with certbot"
echo ""
info "Full guide in: SERVER_DEPLOYMENT_GUIDE.md"

