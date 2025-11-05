import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Shelter {
  id: string
  name: string
  city: string
  description?: string
  logo?: string
  verified: boolean
}

interface ShelterState {
  shelters: Shelter[]
  currentShelter: Shelter | null
  loading: boolean
  error: string | null
}

const initialState: ShelterState = {
  shelters: [],
  currentShelter: null,
  loading: false,
  error: null,
}

const shelterSlice = createSlice({
  name: 'shelter',
  initialState,
  reducers: {
    setShelters: (state, action: PayloadAction<Shelter[]>) => {
      state.shelters = action.payload
    },
    setCurrentShelter: (state, action: PayloadAction<Shelter>) => {
      state.currentShelter = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { setShelters, setCurrentShelter, setLoading, setError } = shelterSlice.actions
export default shelterSlice.reducer
