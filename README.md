# PCDP Client Application

Enterprise React SPA built with Vite, Tailwind CSS, and Axios for the Placement & Career Development Portal.

## 🛠️ Tech Stack & Dependencies
- **React (v19)**: UI Library
- **Vite**: Build Tooling & Dev Server
- **React Router DOM (v7)**: SPA Client Routing
- **Tailwind CSS (v4)**: Utility-first styling engine
- **Axios**: HTTP Client with interceptors
- **Socket.io Client**: Real-time messaging connection

## 🔑 Key Architecture Components
- **`src/utils/api.js`**: Centralized Axios client configured with automatic JWT Bearer token injection and global error normalization.
- **`src/components/ErrorBoundary.jsx`**: Top-level error boundary preventing unhandled UI crashes.
- **`src/config/constants.js`**: Application configuration, endpoint URLs, and constants.
- **`src/context/AuthContext.jsx`**: Global user session state manager.
