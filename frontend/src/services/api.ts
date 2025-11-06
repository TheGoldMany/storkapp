import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
}

// Shelter API
export const shelterAPI = {
  getShelters: (params?: any) => api.get('/shelters', { params }),
  getShelterById: (id: string) => api.get(`/shelters/${id}`),
  getMyShelter: () => api.get('/shelters/my'),
  createShelter: (data: any) => api.post('/shelters', data),
  updateShelter: (id: string, data: any) => api.put(`/shelters/${id}`, data),
  deleteShelter: (id: string) => api.delete(`/shelters/${id}`),
}

// Animal API
export const animalAPI = {
  getAnimals: (params?: any) => api.get('/animals', { params }),
  getAnimalById: (id: string) => api.get(`/animals/${id}`),
  createAnimal: (data: any) => api.post('/animals', data),
  updateAnimal: (id: string, data: any) => api.put(`/animals/${id}`, data),
  deleteAnimal: (id: string) => api.delete(`/animals/${id}`),
}

// Lost Pet API
export const lostPetAPI = {
  getLostPets: (params?: any) => api.get('/lost-pets', { params }),
  getLostPetById: (id: string) => api.get(`/lost-pets/${id}`),
  createLostPet: (data: any) => api.post('/lost-pets', data),
  updateLostPet: (id: string, data: any) => api.put(`/lost-pets/${id}`, data),
}

// Found Pet API
export const foundPetAPI = {
  getFoundPets: (params?: any) => api.get('/found-pets', { params }),
  getFoundPetById: (id: string) => api.get(`/found-pets/${id}`),
  createFoundPet: (data: any) => api.post('/found-pets', data),
  updateFoundPet: (id: string, data: any) => api.put(`/found-pets/${id}`, data),
}

// Subscription API
export const subscriptionAPI = {
  createSubscription: (data: any) => api.post('/subscriptions', data),
  getSubscriptions: () => api.get('/subscriptions'),
  cancelSubscription: (id: string) => api.delete(`/subscriptions/${id}`),
}

// Donation API
export const donationAPI = {
  createDonation: (data: any) => api.post('/donations', data),
  getDonations: () => api.get('/donations'),
  getShelterDonations: (shelterId: string) => api.get(`/donations/shelter/${shelterId}`),
}

// Health Info API
export const healthInfoAPI = {
  getHealthInfo: (params?: any) => api.get('/health-info', { params }),
  getHealthInfoById: (id: string) => api.get(`/health-info/${id}`),
}

export default api
