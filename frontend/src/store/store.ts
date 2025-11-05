import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import shelterReducer from './slices/shelterSlice'
import animalReducer from './slices/animalSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    shelter: shelterReducer,
    animal: animalReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
