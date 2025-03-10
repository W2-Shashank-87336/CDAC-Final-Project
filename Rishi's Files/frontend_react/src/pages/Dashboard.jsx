import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import Profile from './Profile';
import Order from './Order';

import { Routes , Route , Link } from 'react-router-dom';
import { authService } from '../services/authService';
import PrivateRoute from '../components/PrivateRoute';
import DashboardContent from './DashboardContent';



const Dashboard = () => {

  const handleLogout = () => {
      authService.logout();
      window.location.href = '/login';
    };


  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="d-flex flex-column bg-dark text-white vh-100 p-3" style={{ width: '250px' }}>
        <h4 className="mb-4">My Restaurant</h4>
        <ul className="nav flex-column">
          <li className="nav-item"><Link to="/dashboard" className="nav-link text-white">Dashboard</Link></li>
          <li className="nav-item"><Link to="/menu" className="nav-link text-white">Menu</Link></li>
          <li className="nav-item"><Link to="/order" className="nav-link text-white">Orders</Link></li>
          <li className='nav-item'><Link to="/profile" className='nav-link text-white'>Profile</Link></li>
          <li className="nav-item"><Link to="/settings" className="nav-link text-white">Settings</Link></li>
        </ul>

        {/* Push button to the bottom */}
        <div className="mt-auto " >
          <Button className="btn btn-secondary w-100" onClick={handleLogout}>Logout</Button>
        </div>
      </div>


      {/* Main Content */}
      <div className="container-fluid p-4">
        {/* Navbar */}
        <nav className="navbar navbar-light bg-light mb-4">
          <span className="navbar-brand">Dashboard</span>
        </nav>

        
        <Routes>
          <Route path="/" element={ <PrivateRoute><DashboardContent /></PrivateRoute>} />
          <Route path="/" element={<PrivateRoute><Profile /></PrivateRoute>} />
        </Routes>

      </div>
    </div>
  )
};

export default Dashboard;
