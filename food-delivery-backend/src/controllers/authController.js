const { conn } = require('../config/db');
const jwt = require('jsonwebtoken');

// JWT secret key and expiration
const JWT_SECRET = 'your_jwt_secret'; // Use a strong, secure secret in production
const JWT_EXPIRATION = '1h'; // Token validity
const JWT_REFRESH_EXPIRATION = '7d'; // Refresh token validity

// Register a new user
exports.register = (req, res) => {
    const { fullName, email, phone, password, role } = req.body;

    if (!fullName || !email || !phone || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = `
        INSERT INTO users (fullName, email, phone, password, role) 
        VALUES (?, ?, ?, ?, ?);
    `;

    conn.query(query, [fullName, email, phone, password, role], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }
        res.status(201).json({ message: 'User registered successfully', data: result });
    });
};

// User login
exports.login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const query = `
        SELECT * FROM users WHERE email = ? AND password = ?;
    `;

    conn.query(query, [email, password], (error, result) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (result.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const user = result[0];

        // Generate access and refresh tokens
        const token = jwt.sign(
            { id: user.id, role: user.role, email: user.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            JWT_SECRET,
            { expiresIn: JWT_REFRESH_EXPIRATION }
        );

        res.status(200).json({
            message: 'Login successful',
            user: { id: user.id, email: user.email, role: user.role },
            token,
            refreshToken,
        });
    });
};

// Logout user
exports.logout = (req, res) => {
    // Invalidate token: Actual implementation depends on your strategy (e.g., token blacklist)
    res.status(200).json({ message: 'Logout successful' });
};

// Refresh token
exports.refresh = (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required' });
    }

    try {
        const decoded = jwt.verify(refreshToken, JWT_SECRET);

        // Generate a new access token
        const newToken = jwt.sign(
            { id: decoded.id, role: decoded.role, email: decoded.email },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRATION }
        );

        res.status(200).json({
            message: 'Token refreshed successfully',
            token: newToken,
        });
    } catch (error) {
        console.error(error);
        res.status(403).json({ error: 'Invalid or expired refresh token' });
    }
};
