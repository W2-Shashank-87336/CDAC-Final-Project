import apiClient from './client';
// Registration function
export const registerUser = async (data) => {
    try {
      const response = await apiClient.post('/auth/register', {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        role: data.role || 'customer' // Default to 'customer' if not provided
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  };
  
  // Login function
  export const loginUser = async (data) => {
    try {
      const response = await apiClient.post('/auth/login', {
        email: data.email,
        password: data.password
      });
      return {
        success: true,
        token: response.data.token,
        refreshToken: response.data.refreshToken,
        user: response.data.user
      };
    } catch (error) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  };