
import React, { useState, useEffect } from 'react';
import { Container, Card, Button, ListGroup, Form } from 'react-bootstrap';
import { authService } from '../services/authService';
import "./MyStyles.css"

const Profile = () => {
  const userData = JSON.parse(localStorage.getItem('user'));
  // const restaurantData = JSON.parse(localStorage.getItem('RestaurantDetails'))
  const [profile, setProfile] = useState({ name: '', number: '' });
  // const [menu, setMenu] = useState([]); // Stores menu items
  // const [newItem, setNewItem] = useState({ itemName: '', description: '', price: '' });
  // const [showAddMenu, setShowAddMenu] = useState(false); // Toggle state for Add Menu card
  // const [editItem, setEditItem] = useState(null);
  // const [editData, setEditData] = useState({ itemName: '', description: '', price: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await authService.profile(userData.user.id, userData.token);
        if (profileData) {
          setProfile({ name: profileData.fullName, number: profileData.phone });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    const fetchMenu = async () => {
      try {
        const menuData = await authService.getMenu(userData.user.id, userData.token);
        setMenu(menuData || []);
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
    };

    fetchProfile();
    fetchMenu();
  }, [userData.user.id, userData.token]);

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  const handleBackToDashBoard = () => {

    window.location.href = '/dashboard';
  
  }

  return (
    <div className='container-fluid p-4'>
    <Container className="menu-container">

      <Card className='menu-card'>
      
          {/* Profile Card */}
          <Card className="shadow-sm w-100 mb-4" style={{ }}>
            <Card.Body className="text-center">
              <h1 className="mb-4">Profile</h1>
              <img src="" alt="Profile Img" />
              <h4>Owner's Id: {userData.user.id}</h4>
              <h4>Owner Name: {profile.name}</h4>
              <h4>Number: {profile.number}</h4>
            </Card.Body>
          </Card>

          <Button onClick={handleBackToDashBoard}>Back To Dashboard</Button>
          

          {/* Logout Button */}
          <Card className="shadow-sm mb-4 w-100" style={{}}>
            <Card className="text-center">
              <Button variant="danger" onClick={handleLogout}>LOGOUT</Button>
            </Card>
          </Card>

      </Card>
      
    </Container>
    </div>
  );
};

export default Profile;
