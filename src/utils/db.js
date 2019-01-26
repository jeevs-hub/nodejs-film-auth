const { Pool } = require('pg')
var connection;

connection = { connectionString: process.env.DATABASE_URL || "postgres://zybwgrntgkyntc:918626b9efc28cd5d946457f9dd26df3263c1940f7c775131cc5997af1ad9f98@ec2-54-243-228-140.compute-1.amazonaws.com:5432/d25belb9nnjrh7" }
connection.ssl = true;

console.log(`Database Connection: ${JSON.stringify(connection)}`)
var pool = new Pool(connection);

pool.connect();

module.exports = {
    query: (text, params) => pool.query(text, params),
    client: () => pool.connect()
}