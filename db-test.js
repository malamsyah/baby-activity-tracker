require('dotenv').config({ path: '.env.local' });
const { Pool } = require('pg');

async function testDbConnection() {
  console.log('Testing database connection with the following settings:');
  console.log('POSTGRES_URL:', process.env.POSTGRES_URL);
  console.log('POSTGRES_HOST:', process.env.POSTGRES_HOST);
  console.log('POSTGRES_USER:', process.env.POSTGRES_USER);
  console.log('POSTGRES_DATABASE:', process.env.POSTGRES_DATABASE);
  
  // Create a connection pool
  const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
  });
  
  try {
    console.log('Attempting to connect to the database...');
    const client = await pool.connect();
    console.log('Successfully connected to the database!');
    
    console.log('Attempting to query the baby_activities table...');
    const { rows } = await client.query('SELECT COUNT(*) FROM baby_activities');
    console.log('Query successful! There are', rows[0].count, 'activities in the database.');
    
    client.release();
    await pool.end();
    console.log('Database connection test completed successfully!');
  } catch (error) {
    console.error('Error connecting to the database:', error);
    console.error('Stack trace:', error.stack);
  }
}

testDbConnection(); 