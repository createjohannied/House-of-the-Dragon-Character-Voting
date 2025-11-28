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
        ('Otto Hightower', 'House Hightower', 0, NULL),
        ('Aemond Targaryen', 'House Targaryen', 0, NULL),
        ('Aegon Targaryen', 'House Targaryen', 0, NULL),
        ('Helaena Targaryen', 'House Targaryen', 0, NULL),
        ('Criston Cole', 'House Hightower', 0, NULL),
        ('Rhaenys Targaryen', 'House Targaryen', 0, NULL),
        ('Corlys Velaryon', 'House Velaryon', 0, NULL),
        ('Laenor Velaryon', 'House Velaryon', 0, NULL)
      `);
      console.log('Sample characters inserted!');
    } else {
      console.log(`Database already has ${count} characters.`);
      console.log('Adding missing characters...');
      
      // List of all main characters
      const allCharacters = [
        { name: 'Daemon Targaryen', house: 'House Targaryen' },
        { name: 'Rhaenyra Targaryen', house: 'House Targaryen' },
        { name: 'Alicent Hightower', house: 'House Hightower' },
        { name: 'Viserys Targaryen', house: 'House Targaryen' },
        { name: 'Otto Hightower', house: 'House Hightower' },
        { name: 'Aemond Targaryen', house: 'House Targaryen' },
        { name: 'Aegon Targaryen', house: 'House Targaryen' },
        { name: 'Helaena Targaryen', house: 'House Targaryen' },
        { name: 'Criston Cole', house: 'House Hightower' },
        { name: 'Rhaenys Targaryen', house: 'House Targaryen' },
        { name: 'Corlys Velaryon', house: 'House Velaryon' },
        { name: 'Laenor Velaryon', house: 'House Velaryon' }
      ];
      
      // Check which characters exist and add missing ones
      for (const char of allCharacters) {
        const existing = await pool.query(
          'SELECT id FROM characters WHERE name = $1',
          [char.name]
        );
        
        if (existing.rows.length === 0) {
          await pool.query(
            'INSERT INTO characters (name, house, votes, image_url) VALUES ($1, $2, $3, $4)',
            [char.name, char.house, 0, null]
          );
          console.log(`Added: ${char.name}`);
        }
      }
      console.log('Missing characters added!');
    }

    console.log('Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();

