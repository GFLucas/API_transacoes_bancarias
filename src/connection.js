const { Pool } = require('pg');

const pool = new Pool({
    host: 'localhost',
    port: 5432,
    user: 'postgres',
    password: 'g0ldw4r',
    database: 'dindin'
})

module.exports = pool