import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { authAPI } from '../../services/api'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

interface RegisterData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
}

interface LoginData {
  email: string
  password: string
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
}

// Async thunks
export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(data)
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

export const loginUser = createAsyncThunk(
  'auth/login',
  async (data: LoginData, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(data)
      return response.data.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const fetchUserProfile = createAsyncThunk(
  'auth/profile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getProfile()
      return response.data.data.user
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profile')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
      state.error = null
      localStorage.removeItem('token')
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Register
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      localStorage.setItem('token', action.payload.token)
    })
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Login
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
      localStorage.setItem('token', action.payload.token)
    })
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    // Fetch Profile
    builder.addCase(fetchUserProfile.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchUserProfile.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload
      state.isAuthenticated = true
    })
    builder.addCase(fetchUserProfile.rejected, (state) => {
      state.loading = false
      state.user = null
      state.token = null
      state.isAuthenticated = false
      localStorage.removeItem('token')
    })
  },
})

export const { logout, clearError } = authSlice.actions
export default authSlice.reducer
