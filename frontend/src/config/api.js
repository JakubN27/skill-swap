// API Configuration
// In production, use environment variable for backend URL
// In development, use localhost

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export { API_BASE_URL }
