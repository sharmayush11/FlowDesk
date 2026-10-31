# 🚀 FlowDesk — Project Management App

A full-stack task and project management application built with the **MERN stack**. FlowDesk helps users organize projects, manage tasks using a Kanban board, and track work progress.

## ✨ Features

* **Kanban Board:** Organize work into To Do, In Progress, and Done columns.
* **Task Management:** Create and organize tasks on project boards.
* **Board Management:** Create boards with custom titles, descriptions, and background colors.
* **Authentication:** Register and sign in to your workspace.
* **State Management:** Manage frontend application state using Redux Toolkit.
* **Real-time Infrastructure:** Socket.IO is included in the project for real-time communication.

> Additional functionality should be verified in the application before being advertised as fully working.

## 🛠️ Tech Stack

### Frontend

* React.js
* Vite
* Redux Toolkit
* React Router
* Axios
* React Beautiful DnD
* Recharts
* Socket.IO Client

### Backend

* Node.js
* Express.js
* Socket.IO
* Mongoose
* JSON Web Tokens (JWT)
* bcryptjs
* Multer

### Database

* MongoDB
* MongoDB Atlas

## 📁 Project Structure

```text
FlowDesk/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── store/
│   └── package.json
│
├── server/                  # Node.js + Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── socket/
│   └── package.json
│
└── README.md
```

## ⚙️ Getting Started

Follow these steps to set up FlowDesk on your local machine.

### Prerequisites

Make sure you have the following installed:

* [Node.js](https://nodejs.org/)
* npm (included with Node.js)
* [Git](https://git-scm.com/)
* A MongoDB database, such as [MongoDB Atlas](https://www.mongodb.com/atlas)

### 1. Clone the Repository

```bash
git clone https://github.com/sharmayush11/FlowDesk.git
cd FlowDesk
```

### 2. Install Dependencies

**Install backend dependencies:**

```bash
cd server
npm install
```

**Install frontend dependencies:**

Open a new terminal in the project root and run:

```bash
cd client
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `server` directory.

Add the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_own_random_secret
JWT_REFRESH_SECRET=your_own_refresh_secret
CLIENT_URL=http://localhost:5173
```

Replace the placeholder values with your actual configuration.

**Important:**

* Keep your `.env` file private.
* Never commit credentials or secrets to GitHub.
* Ensure the variable names match those used by your backend code.
* If your frontend requires environment variables for the API or Socket.IO URL, configure them according to the project's implementation.

### 4. Start the Backend

Open a terminal and navigate to the `server` directory:

```bash
cd server
npm run dev
```

The backend should start on port `5000` when configured correctly.

> If `npm run dev` does not work, check the `scripts` section of `server/package.json` for the correct development command.

### 5. Start the Frontend

Open a second terminal in the project root and run:

```bash
cd client
npm run dev
```

Open the local URL printed by Vite. It is usually:

```text
http://localhost:5173
```

## 🔌 API Overview

The backend defines routes for authentication, boards, tasks, and users.

| Route Prefix  | Purpose                 |
| :------------ | :---------------------- |
| `/api/auth`   | Authentication          |
| `/api/boards` | Board management        |
| `/api/tasks`  | Task management         |
| `/api/users`  | User-related operations |

For exact endpoints, HTTP methods, and request formats, refer to the route files in `server/routes/`.

> The route prefixes above describe the expected API organization. Verify them against the actual backend implementation.

## 🔐 Security Notes

* Store database credentials and JWT secrets in environment variables.
* Never commit `.env` files or expose sensitive credentials.
* Use your own MongoDB database and credentials.
* Configure CORS appropriately when deploying the frontend and backend.
* Review authentication, authorization, and input validation before deploying publicly.
* Use strong, randomly generated secrets for JWT authentication.

## 🚀 Future Improvements

Potential improvements for future versions include:

* A more polished and responsive user interface.
* Advanced task filtering and search.
* Expanded board and task analytics.
* Improved error handling and loading states.
* Production deployment with environment-specific configuration.

## 👨‍💻 Author

**Ayush Sharma**

🌐 **Portfolio:**
https://ayu-portfolio-zeta.vercel.app/

---

⭐ If you find this project interesting, consider giving the repository a star!
