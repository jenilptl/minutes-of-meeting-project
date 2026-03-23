# MOM - Minutes of Meeting Management System

A robust and efficient **Minutes of Meeting (MOM) Management System** designed to help teams and organizations streamline their meeting processes. This project is divided into two separate architectures: a React-based frontend and a Node.js/Express backend. 

## 🏗️ Project Architecture

To ensure separation of concerns and maintainability, the project is structured into two main independent directories. 

- `mom_frontend/`: The Client-side React application.
- `mom_backend/`: The Server-side API and database management.

> **Note:** Do NOT merge these two directories into one. They are meant to operate securely and efficiently apart from one another.

## 🚀 Features
- Complete meeting management lifecycle.
- Role-based authentication (Staff, Admin).
- User and Member management for attendance.
- Easy to use Dashboard.
- Secure REST APIs built with Node.js and Express.
- Persisted data storage with MySQL.

---

## 💻 Frontend (`mom_frontend`)

The frontend of this application is a Single Page Application (SPA) built using React.js. It facilitates the user interface for staff and admins to view, edit, and maintain minutes of meeting and member attendance seamlessly.

### Tech Stack
- **React.js 19** 
- **React Router DOM 7**
- **Standard CSS** for styling
- **Testing Library** (Jest)

### Running the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd mom_frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

---

## ⚙️ Backend (`mom_backend`)

The backend is built using Node.js, Express, and MySQL. It acts as the backbone, handling business logic, authentication, secure JSON responses, and storing user/meeting data securely.

### Tech Stack
- **Node.js & Express.js**
- **Database:** MySQL
- **Authentication:** JWT (`jsonwebtoken`), bcrypt
- **Middlewares:** cors, dotenv

### Running the Backend
1. Navigate to the backend directory:
   ```bash
   cd mom_backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   - Make sure your `.env` file is properly configured in the root of the `mom_backend` directory with your database config and JWT secret.
4. Start the server (Development Mode):
   ```bash
   npm run dev
   ```

---

## 🛠️ Setup Instructions
If you are cloning this repository for the first time:
```bash
git clone <your-repository-url>
cd mom_diff
```
Proceed to set up the **Backend** first, ensure the API is running and the database is configured. Then set up the **Frontend** to communicate with the Backend server.

## 🤝 Contribution
This project was developed and created to solve organization-management redundancies regarding Minutes of Meeting workflows.
