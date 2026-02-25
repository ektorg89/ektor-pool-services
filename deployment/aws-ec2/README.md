# AWS EC2 Deployment Guide

## Current Status
 **Deployed and Functional**  
 **Paused for Future Development**

Last Updated: February 25, 2026

---

## Infrastructure Overview

### AWS Resources
- **Provider**: Amazon Web Services (AWS)
- **Service**: EC2 (Elastic Compute Cloud)
- **Instance Type**: t3.micro (Free Tier Eligible)
- **Region**: us-east-1 (US East - N. Virginia)
- **OS**: Ubuntu 24.04 LTS
- **Instance ID**: i-035a8878efa09fa51
- **Current Public IP**: 100.53.186.246  *Changes on restart*

### Security Configuration
- **Security Group**: ektor-pool-sg
- **Inbound Rules**:
  - SSH (22): 0.0.0.0/0
  - HTTP (80): 0.0.0.0/0
  - HTTPS (443): 0.0.0.0/0
  - Custom TCP (8000): 0.0.0.0/0 - FastAPI direct access

### Services Running
- **Backend API**: FastAPI (Python 3.11) on port 8000
- **Database**: MySQL 8.0 (containerized)
- **Container Runtime**: Docker 24.x + Docker Compose

---

## Access Instructions

### SSH Access
```bash
# Connect to server
ssh -i ~/.ssh/ektor-pool-key.pem ubuntu@100.53.186.246

# Navigate to project
cd ~/ektor-pool-api/backend-v2
```

### API Access
- **Documentation**: http://100.53.186.246:8000/docs
- **OpenAPI JSON**: http://100.53.186.246:8000/openapi.json
- **Base URL**: http://100.53.186.246:8000

---

## Managing Services

### Start Services
```bash
cd ~/ektor-pool-api/backend-v2
docker-compose start
```

### Stop Services
```bash
docker-compose stop
```

### View Running Containers
```bash
docker-compose ps
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f api
docker-compose logs -f db
```

---

## Database Access

### Connect to MySQL
```bash
# From server
docker-compose exec db mysql -u ektor_api -p'EktorPool2024!Secure#AWS' ektor_pool_db
```

---

## EC2 Instance Management

### Stop Instance (to avoid charges)
1. SSH into server and stop containers:
```bash
   docker-compose stop
   exit
```
2. AWS Console → Instance state → Stop instance
3.  No charges while stopped (data persists)

### Start Instance (from AWS Console)
1. Go to EC2 → Instances
2. Select instance → Instance state → Start instance
3. Wait 2-3 minutes
4. Note the NEW Public IP address

---

## Next Steps (When Resuming)

### Phase 2: CI/CD Automation
- [ ] GitHub Actions workflow for automated deployment
- [ ] Automated testing pipeline
- [ ] Deployment scripts with rollback capability

### Phase 3: Infrastructure as Code
- [ ] Terraform configuration for EC2, VPC, Security Groups
- [ ] Multi-environment support (dev/staging/prod)

### Phase 4: Production Readiness
- [ ] Nginx reverse proxy
- [ ] Custom domain + HTTPS
- [ ] CloudWatch logs and metrics
- [ ] Automated backups

---

**Developer**: Ektor M. González Ramos  
**Repository**: https://github.com/ektorg89/ektor-pool-services  
**Status**: Active Development (Paused for CI/CD planning)
