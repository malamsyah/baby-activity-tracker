import { NextResponse } from 'next/server';
import pkg from 'pg';
const { Pool } = pkg;
import { v4 as uuidv4 } from 'uuid';

// Create a pool that is used in all endpoints
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

// Test the pool connection, will log any errors to the console
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully');
  }
});

export async function GET() {
  try {
    const { rows } = await pool.query(`
      SELECT * FROM baby_activities
      ORDER BY timestamp DESC
    `);
    
    // Handle details column - it may already be an object or a string
    const activities = rows.map(row => {
      let parsedDetails = null;
      
      if (row.details) {
        // If it's a string, try to parse it, otherwise use it as is
        if (typeof row.details === 'string') {
          try {
            parsedDetails = JSON.parse(row.details);
          } catch (error) {
            console.error(`Error parsing details for activity ${row.id}:`, error);
            parsedDetails = null;
          }
        } else {
          // Already an object
          parsedDetails = row.details;
        }
      }
      
      return {
        ...row,
        details: parsedDetails
      };
    });
    
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch activities' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { type, timestamp, details, notes } = await request.json();
    
    const id = uuidv4();
    const detailsJson = JSON.stringify(details);
    
    await pool.query(
      `INSERT INTO baby_activities (id, type, timestamp, details, notes)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, type, timestamp, detailsJson, notes]
    );
    
    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error('Error adding activity:', error);
    return NextResponse.json(
      { error: 'Failed to add activity' },
      { status: 500 }
    );
  }
}