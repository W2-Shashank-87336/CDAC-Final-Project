const mysql = require('mysql2');
const connectionDetails = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'food_delivery_db',
    port: 3307,
};
const conn = mysql.createPool(connectionDetails);
module.exports = { conn };
