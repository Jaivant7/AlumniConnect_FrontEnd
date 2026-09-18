/**
 * @file constants.js
 * @description Centralized configuration and constants for the client application.
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const STORAGE_KEYS = {
    USER_INFO: 'userInfo',
    AUTH_TOKEN: 'token',
};

export const USER_ROLES = {
    STUDENT: 'student',
    ALUMNI: 'alumni',
    FACULTY: 'faculty',
    ADMIN: 'admin',
};

export const DEFAULT_PAGINATION = {
    PAGE: 1,
    LIMIT: 10,
};

export default {
    API_BASE_URL,
    STORAGE_KEYS,
    USER_ROLES,
    DEFAULT_PAGINATION,
};
