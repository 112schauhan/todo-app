import React, { useContext } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom"
import { Toaster } from "react-hot-toast"
import CircularProgress from "@mui/material/CircularProgress"
import AuthProvider from "./contexts/AuthContext"
import TodoProvider from "./contexts/TodoContext"
import Register from "./pages/Register"
import Login from "./pages/login"
import Dashboard from "./pages/Dashboard"
import Todos from "./pages/Todos"
import Layout from "./components/Layout"
import "./App.css"
import { AuthContext } from "./contexts/auth"

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext)
  if (loading) {
    return (
      <div>
        <CircularProgress color="success" />
      </div>
    )
  }
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext)
  if (loading) {
    return (
      <div>
        <CircularProgress color="success" />
      </div>
    )
  }

  return !isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/dashboard" replace />
  )
}

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/todos"
          element={
            <ProtectedRoute>
              <Layout>
                <Todos />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  )
}

function App() {
  return (
    <AuthProvider>
      <TodoProvider>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
          <Toaster position="top-right" />
        </div>
      </TodoProvider>
    </AuthProvider>
  )
}

export default App

// import React from "react";

// function App(){
//   return (
//     <div>App</div>
//   )
// }

// export default App;
