import axios from 'axios'
import useAuthStore from '../store/authStore'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true, // tells browser to send cookies with every request automatically
})

// No request interceptor needed anymore!
// The browser automatically attaches the HttpOnly cookie to every request

// If access token expires (401), silently call /refresh and retry
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        // Refresh endpoint sets a new accessToken cookie automatically
        await axios.post('/api/auth/refresh', {}, { withCredentials: true })
        // Retry the original failed request — cookie is now updated
        return api(original)
      } catch {
        // Refresh also failed — log the user out
        useAuthStore.getState().logout()
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export default api
