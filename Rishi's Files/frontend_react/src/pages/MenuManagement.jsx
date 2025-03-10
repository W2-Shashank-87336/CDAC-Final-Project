import React, { useState , useEffect } from 'react'
import { Button, Card, Container , ListGroup , Form } from 'react-bootstrap'
import { authService } from '../services/authService';

const MenuManagement = () => {

  const userData = JSON.parse(localStorage.getItem('user'));
  const restaurantData = JSON.parse(localStorage.getItem('RestaurantDetails'));
  const [menu, setMenu] = useState([]); // Stores menu items
  const [newItem, setNewItem] = useState({ itemName: '', description: '', price: '' });
  const [showAddMenu, setShowAddMenu] = useState(false); // Toggle state for Add Menu card
  const [editItem, setEditItem] = useState(null);


  

  useEffect( () => {
    const fetchMenu = async () => {
          try {
            const menuData = await authService.getMenu(userData.user.id, userData.token);
            setMenu(menuData || []);
          } catch (error) {
            console.error('Error fetching menu:', error);
          }
        };
    
    fetchMenu();
  }, [userData.user.id , userData.token]);

  const handleEditClick = (item) => {
      setEditItem(item.id);
      setEditData({ itemName: item.itemName, description: item.description, price: item.price });
    };
  
  const handleCancelEdit = () => {
      setEditItem(null);
    };
  
  const handleEditSubmit = async (id) => {
      try {
        await authService.updateMenuItem(id, editData, userData.token);
        setMenu(menu.map(item => (item.id === id ? { ...item, ...editData } : item)));
        setEditItem(null);
      } catch (error) {
        console.error('Error updating item:', error);
      }
    };
  
  
    
  const handleDelete = async (id) => {
      // e.preventDefault();
      console.log(id);
      // console.log(menu);
      
      
      try {
        await authService.deleteMenuItem(id, restaurantData.id , userData.token);
        setMenu(menu => menu.filter(item => item.id !== id)); // Update UI after deletion
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    };

  const handleAddMenuItem = async () => {
      // e.preventDefault();
      try {
        const addedItem = await authService.addMenuItem(restaurantData.id , newItem, userData.token); 
        setMenu([...menu, addedItem]); // Update menu list
        setNewItem({ itemName: '', description: '', price: '' }); // Reset form
        setShowAddMenu(false); // Hide form after adding
      } catch (error) {
        console.error('Error adding menu item:', error);
      }
    };

  const handleBackToDashBoard = () => {
  
      window.location.href = '/dashboard';
    
  }

  return (
    <Container>

      {/* Menu Card */}
          <Card className="shadow-sm mb-4 w-100 " >
            <Card.Body>
              <h2 className="mb-3 text-center">Restaurant Menu</h2>
              <Button onClick={handleBackToDashBoard}>Back To Dashboard</Button>
              <ListGroup style={{maxHeight:'400px' , overflow: 'scroll'}}>
                {menu.length > 0 ? (
                  menu.map((item) => (
                    <ListGroup.Item key={item.id} className="d-flex flex-column" >
                      {editItem === item.id ? (
                        <Form>
                          <Form.Group className="mb-2">
                            <Form.Control 
                              type="text" 
                              value={editData.itemName} 
                              onChange={(e) => setEditData({ ...editData, itemName: e.target.value })} 
                            />
                          </Form.Group>
                          <Form.Group className="mb-2">
                            <Form.Control 
                              type="text" 
                              value={editData.description} 
                              onChange={(e) => setEditData({ ...editData, description: e.target.value })} 
                            />
                          </Form.Group>
                          <Form.Group className="mb-2">
                            <Form.Control 
                              type="number" 
                              value={editData.price} 
                              onChange={(e) => setEditData({ ...editData, price: e.target.value })} 
                            />
                          </Form.Group>
                          <Button variant="success" size="sm" onClick={() => handleEditSubmit(item.id)}>Save</Button>{' '}
                          <Button variant="secondary" size="sm" onClick={handleCancelEdit}>Cancel</Button>
                        </Form>
                      ) : (
                        <>
                          <div >
                            <strong>{item.itemName}</strong> - ₹{item.price}
                            <h6>{item.description}</h6>
                          </div>
                          <div>
                            <Button variant="warning" size="sm" onClick={() => handleEditClick(item)}>Edit</Button>{' '}
                            <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>Delete</Button>
                          </div>
                        </>
                      )}
                    </ListGroup.Item>
                  ))
                ) : (
                  <p className="text-center">No menu items available.</p>
                )}
              </ListGroup>
            </Card.Body>
          </Card>

          


          {/* Add Menu Button */}
          <Button 
            variant="primary" 
            className="mb-3" 
            onClick={() => setShowAddMenu(!showAddMenu)}
          >
            {showAddMenu ? 'Hide Add Menu' : 'Add Menu'}
          </Button>

          {/* Add Menu Card (Hidden Initially) */}
          {showAddMenu && (
            <Card className="shadow-sm mb-4 w-100" style={{ }}>
              <Card.Body>
                <h2 className="mb-3 text-center">Add Menu Item</h2>
                <Form onSubmit={handleAddMenuItem}>
                  <Form.Group className="mb-3">
                    <Form.Label>Item Name</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter item name"
                      value={newItem.itemName}
                      onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description</Form.Label>
                    <Form.Control 
                      type="text" 
                      placeholder="Enter description"
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Price (₹)</Form.Label>
                    <Form.Control 
                      type="number" 
                      placeholder="Enter price"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                      required
                    />
                  </Form.Group>

                  <Button variant="success" type="submit" className="w-100">Add Item</Button>
                </Form>
              </Card.Body>
            </Card>
          )}
    </Container>
  )
}

export default MenuManagement;