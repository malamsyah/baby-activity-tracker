// Authentication utilities

// Hardcoded credentials from environment variables
const AUTH_USERNAME = process.env.APP_USERNAME;
const AUTH_PASSWORD = process.env.APP_PASSWORD;

// Check if credentials are valid
export const validateCredentials = (username, password) => {
  return username === AUTH_USERNAME && password === AUTH_PASSWORD;
};

// For client-side auth check
export const isAuthenticated = () => {
  // Check if user is logged in by checking localStorage
  if (typeof window !== 'undefined') {
    return localStorage.getItem('isAuthenticated') === 'true';
  }
  return false;
};

// Login function
export const login = (username, password) => {
  if (validateCredentials(username, password)) {
    if (typeof window !== 'undefined') {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', username);
    }
    return true;
  }
  return false;
};

// Logout function
export const logout = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
  }
};

// Get username of logged in user
export const getUsername = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('username');
  }
  return null;
}; 