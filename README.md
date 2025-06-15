# Swasthya Setu – Backend

🩺 Backend API for the Swasthya Setu healthcare emergency platform, built with Node.js, Express, and MongoDB.

## 🧠 Overview

This is the backend codebase for the **Swasthya Setu** project, part of the Tutedude Buildathon. It powers user authentication, request management (ICU beds & blood), hospital/blood bank dashboards, and real-time approvals.

## 🔧 Tech Stack

- 🟩 Node.js
- ⚙️ Express.js
- 🍃 MongoDB + Mongoose
- 🔐 JWT for Auth
- 🧾 RESTful APIs
- 📦 dotenv, cookie-parser, bcrypt, cors, etc.

## 🔐 Features

- Patient, Hospital, and Blood Bank role management
- Register/Login with secure password encryption
- Create & manage ICU bed and blood unit requests
- Approval/Rejection system by hospitals/blood banks
- CORS & Cookie-based session support

## 🌐 API Endpoints

```http
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

POST   /api/requests/bed
POST   /api/requests/blood
GET    /api/requests/patient
PUT    /api/requests/:id/approve
PUT    /api/requests/:id/reject

GET    /api/hospitals/
GET    /api/bloodbanks/
```

## ⚙️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Tarush5253/swasthya-setu-backend.git
cd swasthya-setu-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/swasthya
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

### 4. Start the server
```bash
npm run dev
```

## 📁 Folder Structure

```
backend/
├── controllers/
│   ├── authController.js
│   ├── requestController.js
│   ├── hospitalController.js
├── models/
│   ├── User.js
│   ├── Request.js
│   ├── Hospital.js
│   └── BloodBank.js
├── routes/
├── middleware/
├── utils/
└── server.js
```

## 🔐 Authentication Flow

- JWT token issued on login
- Stored in HTTP-only cookies
- Middleware protects routes based on roles

## 🧑‍💻 Contributing

Feel free to fork and make improvements. This app has real-world potential to assist in emergencies.

## 🏁 Project Links

- 🌐 [Frontend Repository](https://github.com/Tarush5253/swasthya-setu)
- 🖥️ [Live Website](https://swasthya-setu-nu.vercel.app/)
- 🎬 [Project Demo](https://www.linkedin.com/feed/update/urn:li:activity:7339921892184674304/)
- 🎨 [UI Design](https://www.figma.com/design/d6kSfNc6lvw97mdESElWxb/Untitled?node-id=0-1&p=f&t=vCO6wXQnMV9eZRK3-0)

---

> Backend built with 💡 by Tarush Ruhela during the Tutedude Buildathon
