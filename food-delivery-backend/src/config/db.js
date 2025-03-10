const mysql = require('mysql2');

const connectionDetails = {
    host: 'localhost',
    user: 'W2_87274_Ritesh',
    password: 'manager',
    
    database: 'food_delivery_db',
    // port: 3307,
};
const conn = mysql.createPool(connectionDetails);
module.exports = { conn };
