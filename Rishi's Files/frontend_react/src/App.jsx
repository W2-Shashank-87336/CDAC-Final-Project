import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

// Import components
import PrivateRoute from './components/PrivateRoute';
import MenuPage from './pages/MenuManagement';
import MenuManagement from './pages/MenuManagement';

function App() {
    return (
        <div>
            {/* <NavBar />
            <Outlet /> */}
        <Router>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route 
                    path="/dashboard" 
                    element={
                        <PrivateRoute>
                            <Dashboard />
                        </PrivateRoute>
                    } 
                />
                <Route path="/menu" element={
                    <PrivateRoute>
                        <MenuManagement></MenuManagement>
                    </PrivateRoute>
                }></Route>
                <Route 
                    path="/profile" 
                    element={
                        
                            <Profile />
                        
                    } 
                />

                <Route path='/menuPage' element={<MenuPage></MenuPage>}></Route>
                <Route path="/" element={<Login />} />
            </Routes>
        </Router>
        </div>
    );
}

export default App;