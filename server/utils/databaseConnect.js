const mysql = require("mysql2");

let pool = null;

const createPool = () => {
  pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
    multipleStatements: true,
    connectionLimit: 10, // Adjust the number of connections as needed
  });
};

const connectDB = () => {
  return new Promise((resolve, reject) => {
    if (!pool) {
      createPool();
    }
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      } else {
        console.log("Connected to MYSQL DB");
        resolve(connection);
      }
    });
  });
};

module.exports = { connectDB };
