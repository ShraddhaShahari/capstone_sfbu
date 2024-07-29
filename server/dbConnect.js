const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'database-2.ctqs28momceq.us-east-2.rds.amazonaws.com',
    database: 'postgres',
    password: 'Mangesh12345',
    port: 5432,
  });

module.exports = pool;
