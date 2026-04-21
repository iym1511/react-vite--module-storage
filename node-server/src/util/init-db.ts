import fs from 'fs';
import path from 'path';
import pool from './db';

export const initDatabase = async () => {
  try {
    const sqlPath = path.join(__dirname, '../sql/schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('⏳ Initializing Database Schema...');
    await pool.query(sql);
    console.log('✅ Database Schema Initialized Successfully');
  } catch (err) {
    console.error('❌ Database Initialization Failed:', err);
    process.exit(1);
  }
};
