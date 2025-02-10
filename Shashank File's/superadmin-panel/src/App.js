import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Restaurants from './pages/Restaurants';
import Settings from './pages/Settings';
import Login from './pages/auth/Login';
import Users from './pages/Users';
import RestaurantDetails from './pages/RestaurantDetails'; // Import the restaurant details page

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="restaurants" element={<Restaurants />} />
          <Route path="settings" element={<Settings />} />
          <Route path="restaurant/:id" element={<RestaurantDetails />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
