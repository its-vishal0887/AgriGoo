# AgriGoo Deployment Setup

This repository contains the complete deployment configuration for the AgriGoo full-stack application.

## Tech Stack & Deployment Platforms

- **Frontend**: React.js → Vercel/Netlify
- **Backend**: Node.js/Express → Railway/Render
- **ML Service**: Python/FastAPI → Railway/DigitalOcean
- **Database**: MongoDB → MongoDB Atlas
- **File Storage**: Cloudinary/Amazon S3
- **CI/CD**: GitHub Actions

## Directory Structure

```
agrigoo-deployment/
├── frontend/           # React build & config
├── backend/            # Node.js deployment
├── ml-service/         # Python ML API
├── database/           # MongoDB setup
└── cicd/               # GitHub Actions
```

## Deployment Instructions

### 1. Frontend Deployment (Vercel/Netlify)

- See `frontend/vercel.json` or `frontend/netlify.toml` for configuration
- Connect your GitHub repository to Vercel or Netlify
- Set environment variables as specified in the config files

### 2. Backend Deployment (Railway/Render)

- See `backend/railway.json` or `backend/render.yaml` for configuration
- Connect your GitHub repository to Railway or Render
- Set environment variables as specified in the config files

### 3. ML Service Deployment (Railway/DigitalOcean)

- See `ml-service/railway.json` or `ml-service/digitalocean-app.yaml` for configuration
- Connect your GitHub repository to Railway or DigitalOcean App Platform
- Set environment variables as specified in the config files

### 4. Database Setup (MongoDB Atlas)

- Follow instructions in `database/mongodb-atlas-guide.md`
- Run the setup script in `database/mongodb-atlas-setup.js`

### 5. File Storage Setup (Cloudinary/Amazon S3)

- For Cloudinary: Use configuration in `frontend/cloudinary-config.js` and `backend/cloudinary-config.js`
- For Amazon S3: Use configuration in `backend/s3-config.js`
- Set appropriate environment variables for your chosen service

### 6. CI/CD Setup (GitHub Actions)

- Add the workflow file from `cicd/.github/workflows/deploy.yml` to your repository
- Set up the required secrets in your GitHub repository settings
- See `cicd/README.md` for detailed instructions

## Environment Variables

Each service requires specific environment variables. Refer to the configuration files in each directory for details.

## Support

For any deployment issues, please open an issue in the repository.