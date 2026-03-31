# Deployment Guide - Finance Tracker Web 2.0

Complete guide for deploying the Finance Tracker Web application to production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Configuration](#environment-configuration)
3. [Local Build & Testing](#local-build--testing)
4. [Docker Deployment](#docker-deployment)
5. [Nginx Setup](#nginx-setup)
6. [SSL/TLS Certificate Setup](#ssltls-certificate-setup)
7. [SEO Configuration](#seo-configuration)
8. [Monitoring & Maintenance](#monitoring--maintenance)
9. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- Docker 20.10+ and Docker Compose 1.29+
- Node.js 18+ (for local development)
- Nginx 1.18+ (if using standalone)
- 2GB+ RAM recommended
- 2+ CPU cores recommended

### Domain & DNS
- A registered domain name
- Access to DNS settings
- SSL certificate (Let's Encrypt recommended, free)

### API Backend
- Running backend API service at `NEXT_PUBLIC_API_BASE_URL`
- CORS configured to accept requests from your domain
- Health check endpoint available

## Environment Configuration

### 1. Create `.env.local` file

Copy from `.env.example` and update with your values:

```bash
cp .env.example .env.local
```

### 2. Required Environment Variables

```env
# REQUIRED: Backend API endpoint
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com

# OPTIONAL: Custom Google OAuth URL
# If omitted, will be built from NEXT_PUBLIC_API_BASE_URL
NEXT_PUBLIC_GOOGLE_AUTH_URL=https://api.yourdomain.com/api/auth/google

# Production Settings
NODE_ENV=production

# SEO & Site Configuration
NEXT_PUBLIC_SITE_NAME=Mile
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_DESCRIPTION=Track and manage your investment portfolios with advanced analytics and performance metrics.
```

### 3. Variable Descriptions

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | Yes | Base URL of your backend API |
| `NEXT_PUBLIC_GOOGLE_AUTH_URL` | No | Google OAuth endpoint URL |
| `NEXT_PUBLIC_SITE_NAME` | No | Site name for SEO (default: Mile) |
| `NEXT_PUBLIC_SITE_URL` | No | Public site URL (default: https://yourdomain.com) |
| `NEXT_PUBLIC_SITE_DESCRIPTION` | No | Site description for SEO |
| `NODE_ENV` | No | Set to 'production' for deployments |

## Local Build & Testing

### 1. Install Dependencies

```bash
npm install
```

### 2. Build Application

```bash
npm run build
```

Expected output:
```
✓ Compiled successfully
Collecting page data...
Generating static pages...
```

### 3. Test Production Build Locally

```bash
npm start
```

Navigate to `http://localhost:3000` to verify the build works.

### 4. Run Linting

```bash
npm run lint
```

## Docker Deployment

### Building and Running with Docker Compose

#### 1. Setup Environment Variables

Create `.env` file in the project root:

```env
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_SITE_NAME=Mile
NODE_ENV=production
```

#### 2. Build and Start Services

```bash
# Build the Docker image
docker-compose build

# Start services in background
docker-compose up -d

# View logs
docker-compose logs -f app

# View Nginx logs
docker-compose logs -f nginx
```

#### 3. Verify Deployment

```bash
# Check service status
docker-compose ps

# Test application health
curl http://localhost/health

# Check Nginx status
curl -I http://localhost/
```

#### 4. Stopping Services

```bash
# Stop services
docker-compose stop

# Stop and remove containers
docker-compose down

# Remove all data
docker-compose down -v
```

### Docker Commands Reference

```bash
# Rebuild without cache
docker-compose build --no-cache

# Update and restart specific service
docker-compose up -d app

# View full logs
docker-compose logs

# Execute command in container
docker-compose exec app npm run build

# Remove unused images
docker image prune
```

## Nginx Setup

### Nginx Configuration Structure

The `nginx.conf` file includes:

- **SSL/TLS Configuration**: Secure connections with TLS 1.2+
- **Security Headers**: HSTS, CSP, X-Frame-Options, etc.
- **Performance Optimization**: Gzip compression, caching
- **Rate Limiting**: Protection against abuse
- **Static File Serving**: Optimized caching for assets
- **Proxy Configuration**: Routing to Next.js backend

### Key Nginx Features

#### 1. Static File Caching

```nginx
location ~* ^/(_next|static)/ {
    expires 365d;
    add_header Cache-Control "public, immutable";
}
```

- **_next** folder: 365 days (immutable)
- **Public assets**: 30 days
- **Robots/Sitemap**: 1 day

#### 2. Rate Limiting

```nginx
limit_req_zone $binary_remote_addr zone=api_limit:10m rate=30r/s;
limit_req_zone $binary_remote_addr zone=auth_limit:10m rate=5r/m;
```

- **API requests**: 30 requests/second
- **Auth requests**: 5 requests/minute
- **General requests**: 10 requests/second

#### 3. Security Headers

```nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "DENY" always;
```

#### 4. Gzip Compression

Enabled for text, CSS, JavaScript, and JSON files to reduce bandwidth.

### Customizing Nginx Configuration

Edit `nginx.conf` and update:

1. **Server Name** (line ~98):
   ```nginx
   server_name yourdomain.com www.yourdomain.com;
   ```

2. **SSL Certificate Paths** (line ~102-103):
   ```nginx
   ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
   ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
   ```

3. **Upstream Server** (line ~63):
   ```nginx
   server nextjs:3000 max_fails=3 fail_timeout=30s;
   ```

## SSL/TLS Certificate Setup

### Option 1: Let's Encrypt with Certbot (Recommended)

#### Prerequisites
- Domain must be publicly accessible
- Port 80 (HTTP) must be open

#### Setup Process

1. **Install Certbot**:
   ```bash
   sudo apt-get update
   sudo apt-get install certbot python3-certbot-nginx
   ```

2. **Obtain Certificate**:
   ```bash
   sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
   ```

3. **Verify Certificate**:
   ```bash
   sudo certbot certificates
   ```

4. **Auto-renewal Setup**:
   ```bash
   sudo systemctl enable certbot.timer
   sudo systemctl start certbot.timer
   ```

5. **Update Nginx Configuration**:
   - Update certificate paths in `nginx.conf`
   - Restart Nginx: `docker-compose restart nginx`

#### Automatic Renewal with Docker

Add to `docker-compose.yml`:

```yaml
certbot:
  image: certbot/certbot
  volumes:
    - /etc/letsencrypt:/etc/letsencrypt
    - /var/lib/letsencrypt:/var/lib/letsencrypt
  command: renew --quiet
  entrypoint: /bin/sh -c "while true; do certbot renew --quiet && sleep 12h; done"
```

### Option 2: Self-Signed Certificate (Development Only)

```bash
mkdir -p nginx/ssl

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout nginx/ssl/key.pem \
  -out nginx/ssl/cert.pem
```

## SEO Configuration

### 1. Robots.txt

Automatically served from `/api/robots` route. Controls crawler access:

```
User-agent: *
Allow: /
Disallow: /mainApp/
Disallow: /dashboard
Disallow: /auth/
Disallow: /api/
```

### 2. Sitemap.xml

Dynamically generated from `/api/sitemap` route. Includes:

- Homepage (priority: 1.0)
- Public pages: /legal/* (priority: 0.5)
- Auth pages: /auth/* (priority: 0.8)
- Last modified dates
- Change frequency indicators

### 3. Meta Tags & Open Graph

Configured in `lib/seo.ts`:

```typescript
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata.home();
```

Includes:
- Page title and description
- Open Graph tags for social sharing
- Twitter Card support
- Canonical URLs
- Mobile viewport settings

### 4. Structured Data (Schema.org)

JSON-LD schemas included:

```typescript
import { generateOrganizationSchema, generateWebsiteSchema } from "@/lib/seo";

// In your layout or page
const jsonLd = generateOrganizationSchema();
```

Available schemas:
- Organization
- Website
- Article
- LocalBusiness
- FAQPage
- BreadcrumbList

### 5. Google Search Console Setup

1. Verify domain ownership via DNS
2. Submit sitemap: `https://yourdomain.com/sitemap.xml`
3. Monitor crawl errors and indexing status
4. Check mobile usability
5. Review Core Web Vitals

### 6. Meta Tags by Page

Update in each page's `layout.tsx` or `page.tsx`:

```typescript
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata.home();
```

Available presets:
- `pageMetadata.home()`
- `pageMetadata.login()`
- `pageMetadata.register()`
- `pageMetadata.privacy()`
- `pageMetadata.terms()`
- `pageMetadata.security()`
- `pageMetadata.dashboard()`

## Monitoring & Maintenance

### 1. Health Checks

Nginx health check endpoint:

```bash
curl https://yourdomain.com/health
# Response: healthy
```

### 2. Monitor Logs

```bash
# Nginx access logs
docker-compose logs nginx

# Application logs
docker-compose logs app

# Real-time logs
docker-compose logs -f app --tail 50
```

### 3. Performance Monitoring

Key metrics to track:

- **Response Time**: Aim for < 200ms
- **Error Rate**: Should be < 1%
- **Uptime**: Target 99.9%
- **Core Web Vitals**: LCP < 2.5s, CLS < 0.1, FID < 100ms

### 4. Log Rotation

Configure Nginx log rotation:

```bash
# /etc/logrotate.d/nginx
/var/log/nginx/*.log {
    daily
    rotate 7
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        if [ -f /var/run/nginx.pid ]; then
            kill -USR1 `cat /var/run/nginx.pid`
        fi
    endscript
}
```

### 5. Regular Maintenance

**Weekly**:
- Check error logs
- Monitor disk usage
- Verify SSL certificate expiry

**Monthly**:
- Review performance metrics
- Update dependencies (if available)
- Check for security patches

**Quarterly**:
- Full security audit
- Performance optimization review
- Backup verification

### 6. Updating the Application

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Rebuild Docker image
docker-compose build

# Restart services
docker-compose up -d

# Verify deployment
docker-compose exec app npm run build
```

## Troubleshooting

### Build Issues

#### Error: "Missing required env var NEXT_PUBLIC_API_BASE_URL"

This error means the required environment variable was not set before the app started.

**For Local Development:**

Ensure `.env.local` exists with `NEXT_PUBLIC_API_BASE_URL` set:

```bash
cp .env.example .env.local
# Edit .env.local and set NEXT_PUBLIC_API_BASE_URL to your backend URL
npm run build
npm start
```

**For Docker Deployment:**

Set the environment variable before starting containers:

```bash
# Option 1: Export and use docker-compose
export NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
docker-compose up -d

# Option 2: Pass directly
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com docker-compose up -d

# Option 3: Create .env file in project root (docker-compose reads it automatically)
echo "NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com" > .env
docker-compose up -d
```

Verify the app received the variable:

```bash
docker-compose exec app printenv | grep NEXT_PUBLIC_API_BASE_URL
```

#### Error: "Module not found"

**Solution**: Reinstall dependencies and clear cache.

```bash
rm -rf node_modules .next
npm install
npm run build
```

### Docker Issues

#### Container exits immediately

Check logs:
```bash
docker-compose logs app
```

Common causes:
- Missing environment variables
- Port 3000 already in use
- Insufficient memory

#### Cannot connect to backend API

Verify:
```bash
curl $NEXT_PUBLIC_API_BASE_URL/health
```

Check Nginx logs:
```bash
docker-compose logs nginx | grep "upstream"
```

#### Nginx returns 502 Bad Gateway

**Solution**: Ensure Next.js app is running.

```bash
docker-compose restart app
docker-compose logs app
```

### Performance Issues

#### High response times

1. Check Nginx logs for slow requests
2. Verify Next.js app performance
3. Check system resources (CPU, memory)
4. Analyze Core Web Vitals

#### High memory usage

```bash
# Check container memory
docker stats

# Restart to clear memory
docker-compose restart app
```

### SSL/Certificate Issues

#### Certificate verification fails

```bash
# Check certificate validity
openssl x509 -in /etc/letsencrypt/live/yourdomain.com/cert.pem -text

# Test SSL connection
openssl s_client -connect yourdomain.com:443
```

#### Mixed content warnings

Ensure all resources use HTTPS:
- Check image sources
- Verify API URLs
- Update external resources

### SEO Issues

#### Sitemap not generating

Check that environment variables are set:
```bash
echo $NEXT_PUBLIC_SITE_URL
```

Test sitemap endpoint:
```bash
curl https://yourdomain.com/sitemap.xml
```

#### Pages not indexing

1. Submit to Google Search Console
2. Check robots.txt allows indexing
3. Verify page has proper meta tags
4. Check for noindex directives

## Performance Optimization

### 1. Enable Compression

Already configured in Nginx. Verify:

```bash
curl -I -H "Accept-Encoding: gzip" https://yourdomain.com/
```

### 2. Cache Strategy

- **Immutable assets** (_next/static/): 365 days
- **Public assets** (public/): 30 days
- **HTML pages**: No cache (always fresh)
- **API responses**: Cache per response header

### 3. Image Optimization

Next.js automatically optimizes images. Ensure:
- Use `next/image` component
- Provide width and height
- Consider responsive sizes

### 4. Code Splitting

Automatic via Webpack configuration. Monitor bundle size:

```bash
npm install -g next-bundle-analyzer
ANALYZE=true npm run build
```

## Security Checklist

- [ ] SSL/TLS certificate installed and valid
- [ ] All environment variables set correctly
- [ ] Security headers configured in Nginx
- [ ] Rate limiting enabled
- [ ] CORS properly configured in backend
- [ ] API authentication required for private routes
- [ ] Sensitive data not logged
- [ ] Regular security updates applied
- [ ] Firewall rules configured
- [ ] DDoS protection enabled (if using CDN)

## Backup & Disaster Recovery

### 1. Database Backups

If using a database:
```bash
# Add to crontab for daily backups
0 2 * * * docker-compose exec db mysqldump -u root -p$MYSQL_ROOT_PASSWORD all_databases > /backups/db_$(date +\%Y\%m\%d).sql
```

### 2. Configuration Backups

```bash
# Backup nginx configuration
tar czf nginx-config-$(date +%Y%m%d).tar.gz nginx.conf

# Backup SSL certificates
tar czf ssl-certs-$(date +%Y%m%d).tar.gz /etc/letsencrypt/live/
```

### 3. Disaster Recovery Procedure

1. Restore from latest backup
2. Verify all services start correctly
3. Test application functionality
4. Check external API connectivity
5. Monitor for errors

## Support & Resources

- **Next.js Documentation**: https://nextjs.org/docs
- **Docker Documentation**: https://docs.docker.com
- **Nginx Documentation**: https://nginx.org/en/docs/
- **Let's Encrypt**: https://letsencrypt.org/
- **Search Console**: https://search.google.com/search-console

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Application builds successfully
- [ ] Docker images build without errors
- [ ] Services start and pass health checks
- [ ] SSL/TLS certificate installed
- [ ] Nginx configuration updated for domain
- [ ] Robots.txt accessible and correct
- [ ] Sitemap.xml generating correctly
- [ ] Meta tags present on all pages
- [ ] Security headers set
- [ ] Rate limiting working
- [ ] Logs accessible and monitored
- [ ] Monitoring alerts configured
- [ ] Backup strategy implemented
- [ ] Disaster recovery tested

---

**Last Updated**: 2024
**Version**: 1.0
**Maintained By**: Development Team