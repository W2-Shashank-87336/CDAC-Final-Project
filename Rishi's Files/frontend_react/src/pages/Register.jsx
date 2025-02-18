import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import './MyStyles.css';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const role = 'RESTAURANT_OWNER';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.register(fullName, email, phone, password, role);
      navigate('/login');
    } catch (err) {
      setError(err.error || 'Registration failed');
    }
  };

  return (
    <Container fluid className="login-container">
      
        <Card className="login-card">
          <h2 className="text-center mb-4">Register</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label>Full Name</Form.Label>
              <Form.Control 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required 
                className="form-input"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control 
                type="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="form-input"
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone</Form.Label>
              <Form.Control 
                type="tel" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)} 
                required 
                className="form-input"
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="form-input"
              />
            </Form.Group>
            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 mt-4"
              style={{ backgroundColor: '#1B1B2F' }}
            >
              Register
            </Button>
            <p className="text-center mt-3">
              Already have an account? <a onClick={() => navigate('/login')} className="text-primary register-link">Login here</a>
            </p>
          </Form>
        </Card>
        <div className="door right-door"></div>
      
    </Container>
  );
};

export default Register;





