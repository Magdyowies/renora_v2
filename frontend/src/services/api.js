// API Service Layer for Renato Vehicle Rental Platform
// This file provides a centralized API interface that can be easily switched from mock to real APIs

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Helper function for making API calls
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  // Add authentication token if available
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || `API Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('API Error:', error)
    throw error
  }
}

// ============================================
// VEHICLE API
// ============================================
export const vehicleAPI = {
  // Get all vehicles with optional filters
  getAll: async (filters = {}) => {
    // PRODUCTION: Uncomment when API is ready
    // const queryParams = new URLSearchParams(filters).toString()
    // return await apiCall(`/vehicles${queryParams ? `?${queryParams}` : ''}`)
    
    // MOCK: Currently using localStorage
    return new Promise((resolve) => {
      setTimeout(() => {
        const vehicles = JSON.parse(localStorage.getItem('vehicles') || '[]')
        resolve({ data: vehicles, success: true })
      }, 300)
    })
  },

  // Get single vehicle by ID
  getById: async (id) => {
    // PRODUCTION: Uncomment when API is ready
    // return await apiCall(`/vehicles/${id}`)
    
    // MOCK: Currently using localStorage
    return new Promise((resolve) => {
      setTimeout(() => {
        const vehicles = JSON.parse(localStorage.getItem('vehicles') || '[]')
        const vehicle = vehicles.find(v => v.id === parseInt(id))
        resolve({ data: vehicle, success: true })
      }, 200)
    })
  },

  // Search vehicles with criteria
  search: async (searchParams) => {
    // PRODUCTION: Uncomment when API is ready
    // return await apiCall('/vehicles/search', {
    //   method: 'POST',
    //   body: JSON.stringify(searchParams),
    // })
    
    return vehicleAPI.getAll(searchParams)
  },

  // Check vehicle availability
  checkAvailability: async (vehicleId, startDate, endDate) => {
    // PRODUCTION: Uncomment when API is ready
    // return await apiCall(`/vehicles/${vehicleId}/availability`, {
    //   method: 'POST',
    //   body: JSON.stringify({ startDate, endDate }),
    // })
    
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ available: true, success: true })
      }, 200)
    })
  },
}

// ============================================
// BOOKING API
// ============================================
export const bookingAPI = {
  // Create new booking
  create: async (bookingData) => {
    // PRODUCTION: Uncomment when API is ready
    // return await apiCall('/bookings', {
    //   method: 'POST',
    //   body: JSON.stringify(bookingData),
    // })
    
    // MOCK: Save to localStorage
    return new Promise((resolve) => {
      setTimeout(() => {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
        const newBooking = {
          ...bookingData,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        }
        bookings.push(newBooking)
        localStorage.setItem('bookings', JSON.stringify(bookings))
        resolve({ data: newBooking, success: true })
      }, 500)
    })
  },

  // Get all bookings for a user
  getUserBookings: async (userEmail) => {
    // PRODUCTION: Uncomment when API is ready
    // return await apiCall(`/bookings/user/${userId}`)
    
    // MOCK: Filter from localStorage
    return new Promise((resolve) => {
      setTimeout(() => {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
        const userBookings = bookings.filter(b => b.customerEmail === userEmail)
        resolve({ data: userBookings, success: true })
      }, 300)
    })
  },

  // Get booking by ID
  getById: async (bookingId) => {
    // PRODUCTION: Uncomment when API is ready
    // return await apiCall(`/bookings/${bookingId}`)
    
    return new Promise((resolve) => {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
      const booking = bookings.find(b => b.id === parseInt(bookingId))
      resolve({ data: booking, success: true })
    })
  },

  // Update booking
  update: async (bookingId, updateData) => {
    // PRODUCTION: Uncomment when API is ready
    // return await apiCall(`/bookings/${bookingId}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(updateData),
    // })
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
        const updatedBookings = bookings.map(b => 
          b.id === bookingId ? { ...b, ...updateData, updatedAt: new Date().toISOString() } : b
        )
        localStorage.setItem('bookings', JSON.stringify(updatedBookings))
        const updated = updatedBookings.find(b => b.id === bookingId)
        resolve({ data: updated, success: true })
      }, 300)
    })
  },

  // Cancel booking
  cancel: async (bookingId) => {
    // PRODUCTION: Uncomment when API is ready
    // return await apiCall(`/bookings/${bookingId}/cancel`, {
    //   method: 'POST',
    // })
    
    return bookingAPI.update(bookingId, { status: 'cancelled' })
  },
}

// ============================================
// PAYMENT API
// ============================================
export const paymentAPI = {
  // Process payment
  process: async (paymentData) => {
    // PRODUCTION: Uncomment when API is ready (Stripe, PayPal, etc.)
    // return await apiCall('/payments/process', {
    //   method: 'POST',
    //   body: JSON.stringify(paymentData),
    // })
    
    // MOCK: Simulate payment processing
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          success: true,
          transactionId: `TXN${Date.now()}`,
          status: 'completed',
          amount: paymentData.amount,
          timestamp: new Date().toISOString(),
        })
      }, 2000)
    })
  },

  // Get payment history for user
  getHistory: async (userEmail) => {
    // PRODUCTION: Uncomment when API is ready
    // return await apiCall(`/payments/user/${userId}`)
    
    return new Promise((resolve) => {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
      const payments = bookings
        .filter(b => b.customerEmail === userEmail)
        .map(b => ({
          id: b.id,
          amount: b.total,
          date: b.createdAt,
          method: b.paymentMethod,
          cardLast4: b.cardLast4,
          status: 'completed',
        }))
      resolve({ data: payments, success: true })
    })
  },

  // Verify payment status
  verify: async (transactionId) => {
    // PRODUCTION: Uncomment when API is ready
    // return await apiCall(`/payments/verify/${transactionId}`)
    
    return new Promise((resolve) => {
      resolve({ verified: true, success: true })
    })
  },
}

// ============================================
// USER API
// ============================================
export const userAPI = {
  // Get user profile
  getProfile: async (email) => {
    // PRODUCTION: Uncomment when API is ready
    // return await apiCall(`/users/profile`)
    
    return new Promise((resolve) => {
      const user = JSON.parse(localStorage.getItem('currentUser') || 'null')
      resolve({ data: user, success: true })
    })
  },

  // Update user profile
  updateProfile: async (userId, profileData) => {
    // PRODUCTION: Uncomment when API is ready
    // return await apiCall(`/users/${userId}`, {
    //   method: 'PUT',
    //   body: JSON.stringify(profileData),
    // })
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = JSON.parse(localStorage.getItem('currentUser') || 'null')
        const updatedUser = { ...user, ...profileData }
        localStorage.setItem('currentUser', JSON.stringify(updatedUser))
        resolve({ data: updatedUser, success: true })
      }, 300)
    })
  },

  // Get user statistics
  getStats: async (userEmail) => {
    // PRODUCTION: Uncomment when API is ready
    // return await apiCall(`/users/${userId}/stats`)
    
    return new Promise((resolve) => {
      const bookings = JSON.parse(localStorage.getItem('bookings') || '[]')
      const userBookings = bookings.filter(b => b.customerEmail === userEmail)
      
      const stats = {
        totalBookings: userBookings.length,
        totalSpent: userBookings.reduce((sum, b) => sum + (b.total || 0), 0),
        activeRentals: userBookings.filter(b => b.status === 'active').length,
        completedRentals: userBookings.filter(b => b.status === 'completed').length,
      }
      
      resolve({ data: stats, success: true })
    })
  },
}

// ============================================
// AUTHENTICATION API
// ============================================
export const authAPI = {
  // User login
  login: async (credentials) => {
    // PRODUCTION: Uncomment when API is ready
    // return await apiCall('/auth/login', {
    //   method: 'POST',
    //   body: JSON.stringify(credentials),
    // })
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const token = `mock_token_${Date.now()}`
        localStorage.setItem('authToken', token)
        resolve({ 
          token, 
          user: { email: credentials.email },
          success: true 
        })
      }, 500)
    })
  },

  // User registration
  register: async (userData) => {
    // PRODUCTION: Uncomment when API is ready
    // return await apiCall('/auth/register', {
    //   method: 'POST',
    //   body: JSON.stringify(userData),
    // })
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const token = `mock_token_${Date.now()}`
        localStorage.setItem('authToken', token)
        resolve({ 
          token,
          user: { email: userData.email, name: userData.name },
          success: true 
        })
      }, 500)
    })
  },

  // User logout
  logout: async () => {
    // PRODUCTION: Uncomment when API is ready
    // return await apiCall('/auth/logout', {
    //   method: 'POST',
    // })
    
    return new Promise((resolve) => {
      localStorage.removeItem('authToken')
      resolve({ success: true })
    })
  },

  // Verify authentication token
  verifyToken: async () => {
    // PRODUCTION: Uncomment when API is ready
    // return await apiCall('/auth/verify')
    
    return new Promise((resolve) => {
      const token = localStorage.getItem('authToken')
      resolve({ valid: !!token, success: true })
    })
  },
}

// Export all APIs as a single object
export default {
  vehicles: vehicleAPI,
  bookings: bookingAPI,
  payments: paymentAPI,
  users: userAPI,
  auth: authAPI,
}