import React, { createContext, useContext, useEffect, useState } from 'react'
import * as authApi from '../api/auth.js'
import { getToken } from '../api/client.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }

    authApi
      .fetchMe()
      .then(setUser)
      .catch(() => authApi.logout())
      .finally(() => setLoading(false))
  }, [])

  async function login(email, password) {
    try {
      const nextUser = await authApi.login(email, password)
      setUser(nextUser)
      return { ok: true, user: nextUser }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }

  async function register(name, email, password) {
    try {
      const nextUser = await authApi.register(name, email, password)
      setUser(nextUser)
      return { ok: true, user: nextUser }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }

  function logout() {
    authApi.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
