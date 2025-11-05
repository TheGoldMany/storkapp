import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Animal {
  id: string
  name: string
  type: string
  breed?: string
  age?: number
  images: string[]
  status: string
}

interface AnimalState {
  animals: Animal[]
  currentAnimal: Animal | null
  loading: boolean
  error: string | null
}

const initialState: AnimalState = {
  animals: [],
  currentAnimal: null,
  loading: false,
  error: null,
}

const animalSlice = createSlice({
  name: 'animal',
  initialState,
  reducers: {
    setAnimals: (state, action: PayloadAction<Animal[]>) => {
      state.animals = action.payload
    },
    setCurrentAnimal: (state, action: PayloadAction<Animal>) => {
      state.currentAnimal = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const { setAnimals, setCurrentAnimal, setLoading, setError } = animalSlice.actions
export default animalSlice.reducer
