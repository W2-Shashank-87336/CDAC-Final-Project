import axios from 'axios';

const API_URL = 'http://localhost:3030/api/v1/auth'; 
const Profile_URL = 'http://localhost:3030/api/v1/profile';

export const authService = {

    profile: async (id , token) => {
        try{
            const response = await axios.get(`${Profile_URL}/${id}` , {
                headers: {
                Authorization: `Bearer ${token}`
            }
            });
            console.log(response.data);
            
            
            return response.data;
        } catch (err) {
            throw err.response.data;
        }
    },

    getCurrentOrders: async (id) => {
        try{
            const response = await axios.get(`http://localhost:3030/api/v1/orders/restaurant/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        }
        catch (err) {
            throw err.response.data;
        }
    },

    getMenu: async (id, token) => {
        try{
            const response = await axios.get(`http://localhost:3030/api/v1/menus/${id}` , {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },

    addMenuItem: async (restaurantId, newItem , token) => {
        try{
            const response = await axios.post(`http://localhost:3030/api/v1/menuItem/${restaurantId}` , {
                itemName: newItem.itemName,
                description: newItem.description,
                price: newItem.price
            } , {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response.data;
        } catch (err) {
            throw err.response.data;
        }
    },

    updateMenuItem: async (id , editData , token) => {
        try {
            const response = await axios.patch(`http://localhost:3030/api/v1/menuItem/${id}`, {
                itemName: editData.itemName,
                description: editData.description,
                price: editData.price
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        }
        catch (err) {
            throw err.response.data;
        }
    },

    deleteMenuItem: async (id, restaurantId , token) => {
        try{
            const response = await axios.delete(`http://localhost:3030/api/v1/menuItem/${id}/${restaurantId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        }
        catch (err) {
            throw err.response.data;
        }
    },


    login: async (email, password) => {
    try {
        const response = await axios.post(`${API_URL}/login`, { email, password });

        if (response.data.token) {
            // Store user details in localStorage
            localStorage.setItem('user', JSON.stringify(response.data));

            const token = response.data.token; // Extract token here
            
            try {
                const restDetails = await axios.get(`http://localhost:3030/api/v1/restaurants/${response.data.user.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                localStorage.setItem('RestaurantDetails', JSON.stringify(restDetails.data)); 
            } catch (err) {
                console.error("Error fetching restaurant details:", err);
            }
        }

        return response.data;
    } catch (error) {
        throw error.response?.data || "Login failed";
    }
},


    register: async (fullName, email, phone, password, role) => {
         
        try {
            console.log("I am here");
            const response = await axios.post(`${API_URL}/register`, { 
                fullName, 
                email, 
                phone, 
                password, 
                role 
            });
            return response.data;
        } catch (error) {
            throw error.response.data;
        }
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },

    isAuthenticated: () => {
        const user = JSON.parse(localStorage.getItem('user'));
        return user && user.token;
    },


    showOrders: () => {
        
    }
};