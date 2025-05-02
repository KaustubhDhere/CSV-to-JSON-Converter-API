import * as fs from 'fs';
import * as readline from 'readline';
import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: +process.env.PG_PORT! || 5432,
});


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

// Custom logic CSV reader function
const readCSV = (filePath: string): Promise<string[][]> => {
  return new Promise((resolve, reject) => {
    const fileContent: string[][] = [];
    const readStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: readStream,
      crlfDelay: Infinity,
    });

    rl.on('line', (line: string) => {
     
      fileContent.push(line.split(','));
    });

    rl.on('close', () => resolve(fileContent));
    rl.on('error', (err: Error) => reject(err));
  });
};

export const parseCSV = async (filePath: string): Promise<any[]> => {
  const users: any[] = [];
  const fileContent = await readCSV(filePath);
  const headers = fileContent[0]; 

 
  for (let i = 1; i < fileContent.length; i++) {
    const row = fileContent[i];
    const user: any = {};

    headers.forEach((header: string, index: number) => {
      const value = row[index];

      
      if (header.startsWith('name')) {
        if (header === 'name.firstName') {
          user.name = user.name || {};
          user.name.firstName = value;
        }
        if (header === 'name.lastName') {
          user.name = user.name || {};
          user.name.lastName = value;
        }
      } 
     
      else if (header.startsWith('address')) {
        if (header === 'address.line1') {
          user.address = user.address || {};
          user.address.line1 = value;
        }
        if (header === 'address.line2') {
          user.address = user.address || {};
          user.address.line2 = value;
        }
        if (header === 'address.city') {
          user.address = user.address || {};
          user.address.city = value;
        }
        if (header === 'address.state') {
          user.address = user.address || {};
          user.address.state = value;
        }
      } 
     
      else {
        user[header] = value;
      }
    });

    users.push(user);
  }

  return users;
};
