# E-commerce Web Application

A full-stack e-commerce web application featuring a responsive, dynamic frontend and a robust backend API.

## 🚀 Tech Stack

### Frontend
- **Framework:** React 19 (via Vite)
- **Styling:** Tailwind CSS (v4)
- **UI Components:** Radix UI, Shadcn UI
- **Icons:** Lucide React
- **Fonts:** Geist (Fontsource)

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js 5
- **Middleware:** CORS, dotenv

## 📁 Folder Structure

```
E-commerce/
├── backend/          # Express.js backend application
│   ├── controllers/  # Route controllers (logic)
│   ├── models/       # Database models
│   ├── routes/       # API routes
│   ├── services/     # Business logic
│   └── server.js     # Entry point for the backend
├── frontend/         # React frontend application
│   ├── public/       # Static assets
│   ├── src/          # Source code for React (Components, Pages, etc.)
│   ├── index.html    # Entry HTML file
│   └── vite.config.js# Vite configuration
└── README.md         # Full project documentation
```

## 🛠️ Prerequisites

Make sure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

## 📦 Installation

To get started with this project locally, clone the repository and install the dependencies for both the frontend and backend applications.

1. **Install Frontend Dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   npm install
   ```

## 🏃‍♂️ Running Locally

You will need two separate terminal windows/tabs to run the frontend and backend simultaneously.

### 1. Start the Backend Server

In your first terminal:
```bash
cd backend
npm run dev
```
The backend server will start running on `http://localhost:3000`. It utilizes `nodemon` to automatically restart upon file changes.

### 2. Start the Frontend Development Server

In your second terminal:
```bash
cd frontend
npm run dev
```
The React frontend will start running, typically on `http://localhost:5173` (refer to your terminal output for the exact local URL).

## 🔌 API Endpoints (Backend)

The backend exposes the following test endpoints:

- `GET /` - Server status check. Returns `Server is running 🚀`
- `GET /api/test` - API connection test. Returns `{"message": "API is working ✅"}`

Further endpoints (such as those handling products, users, or orders) are structured within the `backend/routes` and `backend/controllers` directories.
