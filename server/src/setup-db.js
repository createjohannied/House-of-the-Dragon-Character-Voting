import dotenv from 'dotenv';
import { pool } from './db.js';

dotenv.config();

async function setupDatabase() {
  try {
    // Create characters table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS characters (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        house VARCHAR(255),
        votes INTEGER DEFAULT 0,
        image_url TEXT
      )
    `);

    // Check if table is empty and insert sample data
    const result = await pool.query('SELECT COUNT(*) FROM characters');
    const count = parseInt(result.rows[0].count);

    if (count === 0) {
      console.log('Inserting sample characters...');
      await pool.query(`
        INSERT INTO characters (name, house, votes, image_url) VALUES
        ('Daemon Targaryen', 'House Targaryen', 0, NULL),
        ('Rhaenyra Targaryen', 'House Targaryen', 0, NULL),
        ('Alicent Hightower', 'House Hightower', 0, NULL),
        ('Viserys Targaryen', 'House Targaryen', 0, NULL),
        ('Otto Hightower', 'House Hightower', 0, NULL)
      `);
      console.log('Sample characters inserted!');
    } else {
      console.log(`Database already has ${count} characters.`);
    }

    console.log('Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();

