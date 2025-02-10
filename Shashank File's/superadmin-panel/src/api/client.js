import axios from "axios";


const client = axios.create({
  baseURL: "http://172.18.5.31:3030/api/v1/", 
});


client.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem("token"); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client;
