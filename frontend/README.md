# College Event Task Manager Frontend

A modern React frontend for managing college events and tasks.

## Tech Stack
- React.js (functional components, hooks)
- Tailwind CSS
- Axios
- React Router

## Features
- Authentication (Login/Register)
- Admin Dashboard: Create events, assign tasks
- Student Dashboard: View and update assigned tasks
- Responsive UI with Tailwind CSS
- JWT token-based authentication

## Installation

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm run dev
   ```

4. Open your browser and go to `http://localhost:5173`

## Backend Integration

Make sure your backend API is running on `http://localhost:3000` (or update the `API_BASE_URL` in `src/services/api.js`).

## Folder Structure
```
src/
├── components/
│   ├── Navbar.jsx
│   ├── Sidebar.jsx
│   ├── EventCard.jsx
│   ├── TaskCard.jsx
│   ├── CreateEventForm.jsx
│   └── CreateTaskForm.jsx
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── AdminDashboard.jsx
│   ├── StudentDashboard.jsx
│   ├── EventsPage.jsx
│   └── TasksPage.jsx
├── routes/
│   └── ProtectedRoute.jsx
├── services/
│   └── api.js
├── App.jsx
├── main.jsx
└── index.css
```