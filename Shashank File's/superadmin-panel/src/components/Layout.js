import { Outlet, Link } from 'react-router-dom';
import { FiHome, FiShoppingCart, FiSettings, FiUsers, FiLogOut } from 'react-icons/fi';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice'; 
import { useNavigate } from 'react-router-dom';
const Layout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
      };
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed w-64 bg-white h-screen shadow-lg p-4">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800"> Admin</h1>
          <p className="text-sm text-gray-500">Super Admin Panel</p>
        </div>

        <nav className="space-y-2">
          <Link to="/dashboard" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
            <FiHome className="mr-3" /> Dashboard
          </Link>
          <Link to="/orders" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
            <FiShoppingCart className="mr-3" /> Orders
          </Link>
          <Link to="/restaurants" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
            <FiUsers className="mr-3" /> Restaurants
          </Link>
          <Link to="/users" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
            <FiUsers className="mr-3" /> Users
          </Link>
          <Link to="/settings" className="flex items-center p-2 text-gray-700 hover:bg-gray-100 rounded">
            <FiSettings className="mr-3" /> Settings
          </Link>
        </nav>

        <button className="mt-8 w-full flex items-center p-2 text-red-600 hover:bg-red-50 rounded " onClick={handleLogout}>
          <FiLogOut className="mr-3" /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  );
};
export default Layout;