#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { config } = require('dotenv');

// Load environment variables from .env.local
config({ path: '.env.local' });

// Create a PostgreSQL connection pool
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432,
});

async function runMigration(filePath) {
  const client = await pool.connect();
  try {
    const sqlContent = fs.readFileSync(filePath, 'utf8');
    console.log(`Applying migration: ${path.basename(filePath)}`);
    
    // Split the SQL into individual statements (separated by semicolons)
    const statements = sqlContent
      .split(';')
      .filter(statement => statement.trim() !== '')
      .map(statement => statement.trim());
    
    // Execute each statement
    for (const statement of statements) {
      await client.query(statement + ';');
    }
    
    console.log(`✅ Migration ${path.basename(filePath)} successfully applied`);
    return true;
  } catch (error) {
    console.error(`❌ Error applying migration ${path.basename(filePath)}:`, error);
    return false;
  } finally {
    client.release();
  }
}

async function main() {
  try {
    // Get list of migration files sorted by name
    const migrationsDir = path.join(__dirname);
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql') && file !== 'migrate.js')
      .sort();
    
    if (migrationFiles.length === 0) {
      console.log('No migration files found.');
      return;
    }
    
    const client = await pool.connect();
    try {
      // Create migrations table if it doesn't exist
      await client.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
          filename VARCHAR(255) PRIMARY KEY,
          applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `);
      
      // Get list of already applied migrations
      const result = await client.query('SELECT filename FROM schema_migrations;');
      const appliedMigrations = new Set(result.rows.map(row => row.filename));
      
      // Apply each migration that hasn't been applied yet
      for (const file of migrationFiles) {
        if (!appliedMigrations.has(file)) {
          const success = await runMigration(path.join(migrationsDir, file));
          if (success) {
            // Record this migration as applied
            await client.query('INSERT INTO schema_migrations (filename) VALUES ($1);', [file]);
          } else {
            console.error(`Migration ${file} failed. Stopping migration process.`);
            process.exit(1);
          }
        } else {
          console.log(`Migration ${file} already applied, skipping.`);
        }
      }
    } finally {
      client.release();
    }
    
    console.log('All migrations applied successfully.');
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    // Close the pool
    await pool.end();
  }
}

main(); 