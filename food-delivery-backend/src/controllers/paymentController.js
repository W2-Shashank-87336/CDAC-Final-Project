const { conn } = require('../config/db');

// Webhook for payment status updates (Razorpay)
exports.razorpayWebhook = (req, res) => {
    const payload = req.body;

    // Verify Razorpay signature here (implementation depends on the library you use)
    // Placeholder: Assume signature verification is done successfully
    const isValidSignature = true;

    if (!isValidSignature) {
        return res.status(400).json({ error: 'Invalid signature' });
    }

    // Handle payment status update
    const { orderId, status } = payload; // Adjust based on Razorpay webhook payload structure

    const query = `UPDATE payments SET status = ? WHERE orderId = ?`;

    conn.query(query, [status, orderId], (error) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.status(200).json({ message: 'Payment status updated successfully' });
    });
};

// Get payment info for a specific order
exports.getPaymentInfo = (req, res) => {
    const { orderId } = req.params;

    const query = `SELECT * FROM payments WHERE orderId = ?`;

    conn.query(query, [orderId], (error, results) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Payment info not found' });
        }

        res.status(200).json(results[0]);
    });
};

// Initiate payment session
exports.initiatePayment = (req, res) => {
    const { orderId, amount } = req.body;

    if (!orderId || !amount) {
        return res.status(400).json({ error: 'Order ID and amount are required' });
    }

    const query = `
        INSERT INTO payments (orderId, amount, status) 
        VALUES (?, ?, 'PENDING')
    `;

    conn.query(query, [orderId, amount], (error) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ error: 'Database query failed' });
        }

        res.status(201).json({ message: 'Payment initiated successfully' });
    });
};
