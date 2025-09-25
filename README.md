# Crop Doctor

AgriGoo - AI Crop Health Detection

## Overview

Crop Doctor is an AI-powered application that helps farmers detect and diagnose crop diseases with high accuracy. The application provides real-time analysis, disease outbreak mapping, and actionable recommendations to protect crops.

## Tech Stack

### Frontend
- **Next.js** - React framework for server-side rendering and static site generation
- **TypeScript** - Typed JavaScript for better developer experience
- **Shadcn UI** - Component library for building modern UI
- **TailwindCSS** - Utility-first CSS framework

### Backend
- **Node.js** - JavaScript runtime for server-side applications
- **Express.js** - Web application framework for Node.js

### ML Service
- **Python** - Programming language for machine learning
- **TensorFlow/Keras** - Machine learning framework for crop disease detection
- **Docker** - Containerization for ML service deployment

### Database
- **MongoDB** - NoSQL database for storing application data

## Environment Setup

### Prerequisites
- Node.js (v16+)
- npm or pnpm
- Python 3.9+
- Docker and Docker Compose (for ML service)

### Frontend & Backend Setup
1. Clone the repository
   ```
   git clone <repository-url>
   cd Agri
   ```

2. Install dependencies
   ```
   # or
   pnpm install
   ```

3. Run the development server
   ```
   npm run dev
   # or
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### ML Service Setup

#### Using Docker (Recommended)
1. Navigate to the ML service directory
   ```
   cd ml-crop-disease
   ```

2. Build and run the Docker container
   ```
   docker-compose up
   ```

3. The ML service will be available at [http://localhost:8000](http://localhost:8000)

#### Manual Setup
1. Navigate to the ML service directory
   ```
   cd ml-crop-disease
   ```

2. Create a virtual environment
   ```
   python -m venv venv
   venv\Scripts\activate  # Windows
   source venv/bin/activate  # Linux/Mac
   ```

3. Install dependencies
   ```
   pip install -r requirements.txt
   ```

4. Run the ML service
   ```
   python -m app.api.main
   ```