import { useState, useEffect } from "react";
import client from "../api/client";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await client.get("/admin/orders");
        setOrders(res.data); // ✅ Updated state with fetched data
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, []);

  // Function to style status badges
  const getStatusStyle = (status) => {
    switch (status) {
      case "PENDING":
        return "bg-yellow-100 text-yellow-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      case "PROCESSING":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Restaurant</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coupon</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rejection Reason</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4 font-medium text-gray-800">#{order.id}</td>
                  <td className="px-4 py-4">{order.customerName}</td>
                  <td className="px-4 py-4">{order.restaurantName}</td>
                  <td className="px-4 py-4 font-semibold">₹{order.total.toFixed(2)}</td>
                  <td className="px-4 py-4">{order.paymentMethod}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-sm rounded-full ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">{order.couponId ? `#${order.couponId}` : "No Coupon"}</td>
                  <td className="px-4 py-4 text-red-600">
                    {order.rejectionReason ? order.rejectionReason : "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-500">
                  No orders found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
