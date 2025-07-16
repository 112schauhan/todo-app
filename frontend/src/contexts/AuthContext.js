import React, { createContext, useContext, useState, useEffect } from "react"
import { authService } from "../services/authService"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("accessToken")
    if (token) {
      // Verify token is valid by calling profile endpoint
      authService
        .getProfile()
        .then((profile) => {
          setUser(profile)
          setIsAuthenticated(true)
        })
        .catch(() => {
          // Token is invalid, remove it
          localStorage.removeItem("accessToken")
          localStorage.removeItem("refreshToken")
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (credentials) => {
    const response = await authService.signup(credentials)

    // Store tokens
    localStorage.setItem("accessToken", response.accessToken)
    localStorage.setItem("refreshToken", response.refreshToken)

    // Set user state
    setUser(response.user)
    setIsAuthenticated(true)

    return response
  }

  const register = async (userData) => {
    const response = await authService.signup(userData)

      // Store tokens
      localStorage.setItem("accessToken", response.accessToken)
      localStorage.setItem("refreshToken", response.refreshToken)

      // Set user state
      setUser(response.user)
      setIsAuthenticated(true)

      return response
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Clear tokens and state regardless of API call success
      localStorage.removeItem("accessToken")
      localStorage.removeItem("refreshToken")
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
