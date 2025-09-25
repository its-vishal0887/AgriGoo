# CI/CD Pipeline for AgriGoo

This directory contains GitHub Actions workflows for continuous integration and deployment of the AgriGoo application.

## Setup Instructions

1. Add the following secrets to your GitHub repository:

### Vercel (Frontend)
- `VERCEL_TOKEN`: API token from Vercel
- `VERCEL_ORG_ID`: Organization ID from Vercel
- `VERCEL_PROJECT_ID`: Project ID from Vercel

### Railway (Backend)
- `RAILWAY_TOKEN`: API token from Railway

### DigitalOcean (ML Service)
- `DIGITALOCEAN_ACCESS_TOKEN`: Personal access token from DigitalOcean
- `DIGITALOCEAN_APP_ID`: App ID from DigitalOcean App Platform

## Workflow

The CI/CD pipeline performs the following steps:
1. Runs tests on every push and pull request to the main branch
2. If tests pass and the event is a push to main:
   - Deploys the frontend to Vercel
   - Deploys the backend to Railway
   - Deploys the ML service to DigitalOcean App Platform