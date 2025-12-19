import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in on mount
    const userRole = localStorage.getItem('userRole')
    const userEmail = localStorage.getItem('userEmail')
    const userName = localStorage.getItem('userName')

    if (userRole && userEmail) {
      setUser({
        email: userEmail,
        name: userName || userEmail.split('@')[0],
        role: userRole,
        isAdmin: userRole === 'admin'
      })
    }
    setIsLoading(false)
  }, [])

  const login = (email, password, name) => {
    // Check if admin
    const isAdmin = email === 'admin@rentora.com'
    const role = isAdmin ? 'admin' : 'user'
    const displayName = name || email.split('@')[0]

    // Save to localStorage
    localStorage.setItem('userRole', role)
    localStorage.setItem('userEmail', email)
    localStorage.setItem('userName', displayName)

    // Update state
    setUser({
      email,
      name: displayName,
      role,
      isAdmin
    })

    return { role, isAdmin }
  }

  const logout = () => {
    localStorage.removeItem('userRole')
    localStorage.removeItem('userEmail')
    localStorage.removeItem('userName')
    setUser(null)
  }

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates }
    setUser(updatedUser)
    
    // Update localStorage
    if (updates.name) localStorage.setItem('userName', updates.name)
    if (updates.email) localStorage.setItem('userEmail', updates.email)
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    isAdmin: user?.isAdmin || false,
    login,
    logout,
    updateUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}