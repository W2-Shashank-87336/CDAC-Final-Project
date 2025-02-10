import { useState, useEffect } from "react";
import client from "../api/client";

const Users = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await client.get("/admin/users");
        // Group orders by orderId
        const groupedOrders = groupOrdersByOrderId(res.data);
        setOrders(groupedOrders); // Set the grouped data to state
        console.log(groupedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, []);


  const groupOrdersByOrderId = (data) => {
    const grouped = {};
    data.forEach((item) => {
      if (!grouped[item.orderId]) {
        grouped[item.orderId] = {
          id: item.orderId,
          customerId: item.customerId,
          fullName: item.fullName,
          email: item.email,
          phone: item.phone,
          restaurantId: item.restaurantId,
          addressId: item.addressId,
          couponId: item.couponId,
          paymentMethod: item.paymentMethod,
          status: item.status,
          rejectionReason: item.rejectionReason,
          total: item.total,
          created_at: item.created_at,
          orderItems: [],
        };
      }
      grouped[item.orderId].orderItems.push({
        itemId: item.itemId,
        quantity: item.quantity,
      });
    });
    return Object.values(grouped);
  };


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
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Orders with Users and Items</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-4 font-medium text-gray-800">#{order.id}</td>
                  <td className="px-4 py-4">{order.fullName}</td>
                  <td className="px-4 py-4">{order.email}</td>
                  <td className="px-4 py-4 font-semibold">₹{order.total.toFixed(2)}</td>
                  <td className="px-4 py-4">{order.paymentMethod}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 text-sm rounded-full ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {order.orderItems.length > 0 ? (
                      <ul className="list-disc list-inside">
                        {order.orderItems.map((item, index) => (
                          <li key={index}>
                            Item ID: {item.itemId} (Qty: {item.quantity})
                          </li>
                        ))}
                      </ul>
                    ) : (
                      "No Items"
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
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

export default Users;