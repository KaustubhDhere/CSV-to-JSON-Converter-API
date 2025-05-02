import { Pool } from 'pg';
import * as dotenv from 'dotenv';

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: +process.env.PG_PORT! || 5432,
});

export const connectDB = async () => {
  try {
    const client = await pool.connect();
    console.log('Connected to PostgreSQL');
    client.release();
  } catch (err) {
    console.error('Error connecting to PostgreSQL:', err);
  }
};

export const saveUsersToDatabase = async (users: any[]) => {
  const client = await pool.connect();
  try {
    for (const user of users) {
      const { name, age, address, gender } = user;
      const query = `
        INSERT INTO users (name, age, address, gender) 
        VALUES ($1, $2, $3, $4)
      `;
      const values = [JSON.stringify(name), age, JSON.stringify(address), gender];
      await client.query(query, values);
    }
  } catch (err) {
    console.error('Error inserting users into the database:', err);
  } finally {
    client.release(); 
  }
};
