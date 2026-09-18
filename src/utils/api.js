import axios from 'axios';
import { API_BASE_URL, STORAGE_KEYS } from '../config/constants';

/**
 * Enterprise Axios Instance Configuration
 */
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request Interceptor: Automatically inject JWT Bearer Token if logged in
 */
api.interceptors.request.use(
    (config) => {
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER_INFO);
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser && parsedUser.token) {
                    config.headers.Authorization = `Bearer ${parsedUser.token}`;
                }
            } catch (err) {
                console.error('Failed to parse user info from localStorage:', err);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response Interceptor: Standardize API responses and handle unauthorized errors globally
 */
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Global 401 Unauthorized error handling
        if (error.response && error.response.status === 401) {
            console.warn('Session expired or unauthorized request. Clearing auth state.');
            localStorage.removeItem(STORAGE_KEYS.USER_INFO);
        }

        // Standardize error message payload
        const formattedError = {
            status: error.response?.status || 500,
            message:
                error.response?.data?.message ||
                error.message ||
                'Network connection error. Please try again.',
            data: error.response?.data || null,
        };

        return Promise.reject(formattedError);
    }
);

export default api;
