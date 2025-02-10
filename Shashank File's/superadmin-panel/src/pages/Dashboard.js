import { useEffect, useState } from 'react';
import axios from 'axios';
import { FiUsers, FiShoppingBag, FiCoffee } from 'react-icons/fi';

const Dashboard = () => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/admin/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchStats();
  }, []);

  const StatCard = ({ icon, title, value }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <div className="flex items-center">
        <div className="p-3 bg-blue-100 rounded-lg mr-4">
          {icon}
        </div>
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatCard 
        icon={<FiUsers className="text-blue-600 text-xl" />}
        title="Total Users"
        value={stats.totalUsers?.totalUsers || 0}
      />
      <StatCard
        icon={<FiShoppingBag className="text-green-600 text-xl" />}
        title="Total Orders"
        value={stats.totalOrders?.totalOrders || 0}
      />
      <StatCard
        icon={<FiCoffee className="text-purple-600 text-xl" />}
        title="Total Restaurants"
        value={stats.totalRestaurants?.totalRestaurants || 0}
      />
    </div>
  );
};
export default Dashboard;