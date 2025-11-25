# Production Deployment Guide

## Quick Start

### 1. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your production values
nano .env
```

### 2. Generate Secrets

```bash
# Generate JWT secrets
openssl rand -base64 32  # For JWT_ACCESS_SECRET
openssl rand -base64 32  # For JWT_REFRESH_SECRET
```

### 3. Deploy with Docker

#### Development

```bash
docker-compose up --build
```

#### Production

```bash
docker-compose -f docker-compose.prod.yml up --build -d
```

### 4. Database Migration

```bash
# Run migrations
docker-compose -f docker-compose.prod.yml exec app npx prisma migrate deploy

# Seed database (optional)
docker-compose -f docker-compose.prod.yml exec app npm run prisma:seed
```

## Endpoints

- **API**: http://localhost:3000
- **Swagger**: http://localhost:3000/swagger
- **Health Check**: http://localhost:3000/health

## Security Checklist

- [ ] Update JWT secrets in `.env`
- [ ] Set CORS_ORIGIN to your domain
- [ ] Use HTTPS in production
- [ ] Set strong database password
- [ ] Review and restrict CORS origins
- [ ] Enable rate limiting (optional)
- [ ] Configure logging (optional)

## Monitoring

Health check endpoint returns:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

## Troubleshooting

### Container won't start

```bash
# Check logs
docker-compose -f docker-compose.prod.yml logs app

# Check health
docker-compose -f docker-compose.prod.yml ps
```

### Database connection issues

```bash
# Verify DATABASE_URL in .env
# Check postgres container is healthy
docker-compose -f docker-compose.prod.yml ps postgres
```

## Production Checklist

- [x] .env.example created
- [x] Production Dockerfile created
- [x] CORS configuration secured
- [x] Health check endpoint added
- [x] .gitignore updated
- [ ] SSL/TLS certificates configured
- [ ] Domain configured
- [ ] Monitoring setup
- [ ] Backup strategy implemented
