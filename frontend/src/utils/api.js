import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

// Attach token if present
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('zt_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  r => r,
  err => {
    if (err.response?.status === 401) localStorage.removeItem('zt_token')
    return Promise.reject(err)
  }
)

export default api
