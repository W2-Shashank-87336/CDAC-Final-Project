// src/api/client.jsx
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';


// Use 10.0.2.2 for Android emulator to reference your host machine.
// For iOS simulator, you can usually use localhost.


const client = axios.create({
  baseURL: 'http://172.18.5.31:3030/api/v1/',
  // For HTTPS with a self-signed certificate during development, consider using HTTP
  // or configure your server with a trusted certificate.
});

client.interceptors.request.use(async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
export default client;
