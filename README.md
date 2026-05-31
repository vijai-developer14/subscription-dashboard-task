# Subscription Management Dashboard

A full-stack SaaS admin dashboard for managing user subscriptions.

## Tech Stack

- **Frontend**: React.js (Vite), TailwindCSS, Zustand (state management), Axios
- **Backend**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT stored in **HttpOnly cookies** (secure, not accessible by JS)
- **Validation**: Zod

---

## Security Approach

JWT tokens are stored in **HttpOnly cookies** instead of localStorage:
- Browser automatically sends cookies with every request
- JavaScript cannot read HttpOnly cookies — safe from XSS attacks
- `sameSite: strict` prevents CSRF attacks
- Only the user object is stored in Zustand (no tokens in localStorage)

---

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/subscription-dashboard-task.git
cd subscription-dashboard-task
```

### 2. Backend Setup

```bash
cd server
npm install

cp .env.example .env
```

Edit `server/.env`:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/subscription_dashboard
JWT_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=development
```

**Seed the database** (creates 4 plans + admin user):
```bash
node src/config/seed.js
```

**Start the server:**
```bash
npm run dev
```

Server runs on: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## Test Credentials

| Role  | Email              | Password   |
|-------|--------------------|------------|
| Admin | admin@admin.com    | admin123   |

Register any new account for a regular user.

---

## API Endpoints

| Method | Endpoint                      | Auth     | Description                |
|--------|-------------------------------|----------|----------------------------|
| POST   | /api/auth/register            | Public   | Register new user          |
| POST   | /api/auth/login               | Public   | Login (sets cookies)       |
| POST   | /api/auth/refresh             | Cookie   | Refresh access token       |
| POST   | /api/auth/logout              | Cookie   | Logout (clears cookies)    |
| GET    | /api/plans                    | Public   | Get all plans              |
| POST   | /api/subscribe/:planId        | User     | Subscribe to a plan        |
| GET    | /api/my-subscription          | User     | Get my active subscription |
| GET    | /api/admin/subscriptions      | Admin    | All subscriptions          |

---

## Author

**Your Name**  
Email: your@email.com  
GitHub: github.com/yourusername
