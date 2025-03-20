import { NextResponse } from 'next/server';
import { Pool } from 'pg';

// Create a connection pool that can be reused
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    
    await pool.query(
      `DELETE FROM baby_activities WHERE id = $1`,
      [id]
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting activity:', error);
    return NextResponse.json(
      { error: 'Failed to delete activity' },
      { status: 500 }
    );
  }
}