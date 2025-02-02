const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret'; // Use a secure secret for production

// Middleware to verify JWT token
exports.authenticate = (req, res, next) => {
    const token = req.headers['authorization']; // Token passed in headers as "Authorization: Bearer <token>"

    if (!token) {
        return res.status(401).json({ error: 'No token provided, authorization denied' });
    }

    // Extract the token after "Bearer"
    const extractedToken = token.split(' ')[1];

    jwt.verify(extractedToken, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }

        req.user = decoded; // Add decoded user information (e.g., id, role) to the request object
        next();
    });
};

// Middleware for role-based access control
exports.authorize = (roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Access denied, insufficient permissions' });
        }
        next();
    };
};
