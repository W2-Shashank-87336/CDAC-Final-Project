import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import client from "../api/client";
import { FiPackage, FiClock, FiMapPin, FiDollarSign } from "react-icons/fi";

const RestaurantDetails = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const { id } = useParams(); // Get the restaurant ID from the URL
  const BASE_URL = "http://172.18.5.31:3030/";

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        const res = await client.get(`restaurants/${id}`);
        setRestaurant(res.data);
      } catch (err) {
        console.error("Error fetching restaurant details:", err);
      }
    };

    const fetchRestaurantOrders = async () => {
        try {
            const res = await client.get(`orders/restaurantOrders/${id}`);
            setOrders(res.data);
            console.log(res.data);
        } catch (err) {
            console.error("Error fetching orders:", err);
        }
    };
    
    fetchRestaurantDetails();
    fetchRestaurantOrders();
  }, [id]);


  if (!restaurant) return (
    <div className="animate-pulse p-6 space-y-4">
      <div className="h-8 bg-gray-100 rounded w-1/2"></div>
      <div className="h-4 bg-gray-100 rounded w-3/4"></div>
      <div className="h-4 bg-gray-100 rounded w-2/3"></div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">

      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">{restaurant.name}</h1>
            <p className="text-gray-600 mt-2">{restaurant.description}</p>
          </div>
          <div className="flex items-center space-x-4 text-gray-500">
            <div className="flex items-center space-x-1">
              <FiMapPin className="text-[#6366F1]" />
              <span>{restaurant.location || 'N/A'}</span>
            </div>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-indigo-50 rounded-lg">
              <FiPackage className="text-[#6366F1] text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-lg font-semibold">{orders.length}</p>
            </div>
          </div>
        </div>
      </div>


      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="flex items-center space-x-2">
            <FiClock className="text-[#94A3B8]" />
            <span className="font-medium">Recent Orders</span>
          </h3>
        </div>
        
        {orders.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {orders.map((order) => (
              <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">Order #{order.id}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      order.status === 'completed' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {order.status}
                    </span>
                    <div className="flex items-center space-x-1">

                      <span className="font-medium">₹ {order.total}</span>
                    </div>
                  </div>
                </div>
                {order.items && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-500">Items:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {order.items.map((item, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 bg-gray-100 rounded text-sm text-gray-600"
                        >
                          {item.name} × {item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-gray-500">
            No orders found for this restaurant
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantDetails;