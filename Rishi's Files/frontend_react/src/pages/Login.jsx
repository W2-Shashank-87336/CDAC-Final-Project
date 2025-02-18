import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { authService } from '../services/authService';
import { useNavigate } from 'react-router-dom';
import './MyStyles.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await authService.login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.error || 'Login failed');
        }
    };

    const register = () => {
        navigate('/register');
    };

    return (
        <Container fluid className="login-container">
            
                
                <Card className="login-card">
                    <h2 className="text-center mb-4">Login</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form onSubmit={handleSubmit}>
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
                        <Button variant="primary" type="submit" className="w-100 mt-4" style={{backgroundColor: ''}}>Login</Button>
                        <p className="text-center mt-3">
                            New user? <a onClick={register} className="text-primary register-link">Register here</a>
                        </p>
                    </Form>
                </Card>
                
            
        </Container>
    );
};

export default Login;
