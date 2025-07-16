import React, { createContext, useState, useEffect } from "react"
import { authService } from "../services/authService"

const AuthContext = createContext()

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      authService
        .getProfile()
        .then((profile) => {
          setUser(profile)
          setIsAuthenticated(true)
        })
        .catch(() => {
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
