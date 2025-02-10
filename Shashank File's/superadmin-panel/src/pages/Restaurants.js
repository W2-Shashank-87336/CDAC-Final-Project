import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useState, useEffect } from "react";
import axios from "axios";
import client from "../api/client";

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate(); // Initialize the useNavigate hook
  const BASE_URL = "http://172.18.5.31:3030/";

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await client.get("/admin/restaurants");
        setRestaurants(res.data);
      } catch (err) {
        console.error("Error fetching restaurants:", err);
      }
    };
    fetchRestaurants();
  }, []);

  const goToRestaurantDetails = (restaurantId) => {
    navigate(`/restaurant/${restaurantId}`); // Navigate to the restaurant details page
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Restaurants</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.length > 0 ? (
          restaurants.map((restaurant) => {
            const fullImageUrl =
              restaurant.image && restaurant.image.startsWith("http")
                ? restaurant.image
                : `${BASE_URL}${restaurant.image || "/default-restaurant.jpg"}`;

            return (
              <div
                key={restaurant.id}
                className="bg-gray-50 rounded-lg shadow-sm overflow-hidden cursor-pointer"
                onClick={() => goToRestaurantDetails(restaurant.id)} // Handle click to redirect
              >
                <img src={fullImageUrl} alt={restaurant.name} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900">{restaurant.name}</h3>
                  <p className="text-gray-600 text-sm truncate">{restaurant.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500">📍 {restaurant.addressLine1}</span>
                    <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800 rounded-full">
                      {restaurant.distance} km
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 col-span-full">No restaurants found</p>
        )}
      </div>
    </div>
  );
};

export default Restaurants;
