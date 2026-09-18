# Full-Stack Assignment: Financial Analytics Dashboard

## Overview
A full-stack financial application with dynamic data visualization, advanced filtering, and configurable CSV export functionality.

## Tech Stack

### Frontend
- React.js with TypeScript
- Material-UI (MUI) for UI components
- Recharts for data visualization
- Axios for API calls
- React Router for navigation

### Backend
- Node.js with Express (TypeScript)
- MongoDB with Mongoose
- JWT for authentication
- Custom CSV generation

## Project Structure
Loop-assisment/
backend/ -> Node.js + Express + MongoDB API
frontend/ -> React + TypeScript dashboard UI

## Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder with the following content:
PORT=5000
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<your secret key>
JWT_EXPIRES_IN=1d

Seed the database with sample data:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
```
Backend runs on `http://localhost:5000`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```
Frontend runs on `http://localhost:3000`

### 3. Login Credentials
- Email: `demo@loopr.ai`
- Password: `password123`

## Features Implemented

### Authentication & Security
- JWT-based login system
- Protected API routes with token validation

### Financial Dashboard
- Revenue vs Expense trend chart (line chart)
- Category breakdown (pie chart)
- Summary cards (total revenue, total expense)
- Paginated transaction table

### Filtering & Search
- Filter by category, status, date range
- Real-time search across transaction fields
- Column-based sorting

### CSV Export
- Configurable column selection
- Modal-based UI for choosing export options
- Direct browser download
- Respects currently applied filters

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | User login |
| POST | /api/auth/register | User registration |
| GET | /api/transactions | Get paginated transactions with filters |
| GET | /api/transactions/summary | Get aggregated data for charts |
| GET | /api/transactions/export | Export transactions as CSV |

## Sample Data
The dataset contains 300 sample financial transactions with fields: id, date, amount, category (Revenue/Expense), status (Paid/Pending), user_id, and user_profile.
