# MongoDB Atlas Setup Guide

## 1. Create MongoDB Atlas Account
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up or log in to your account
3. Create a new project named "AgriGoo"

## 2. Create a Cluster
1. Click "Build a Database"
2. Choose the free tier (M0)
3. Select your preferred cloud provider and region
4. Name your cluster "agrigoo-cluster"
5. Click "Create Cluster"

## 3. Set Up Database Access
1. Go to "Database Access" in the security menu
2. Add a new database user with password authentication
3. Set a secure username and password
4. Give the user "Read and Write to Any Database" permissions
5. Add user

## 4. Configure Network Access
1. Go to "Network Access" in the security menu
2. Add a new IP address
3. For development, you can allow access from anywhere (0.0.0.0/0)
4. For production, add specific IP addresses of your deployment services

## 5. Get Connection String
1. Go to "Databases" and click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user's password

## 6. Run Setup Script
1. Connect to your cluster using MongoDB Compass or mongo shell
2. Run the `mongodb-atlas-setup.js` script to create collections and indexes

## 7. Update Environment Variables
1. Add the connection string to your backend and ML service environment variables
2. Format: `mongodb+srv://<username>:<password>@agrigoo-cluster.mongodb.net/agrigoo?retryWrites=true&w=majority`