// scripts/createAdmin.js
import 'dotenv/config'; // Dodaj tę linię na początku
import { connectToDB } from '../lib/database.js';
import AdminUser from '../models/AdminUser.js';

// Reszta kodu pozostaje bez zmian

async function createAdmin() {
  try {
    await connectToDB();
    
    const admin = new AdminUser({
      email: 'admin@example.com',
      password: 'temporary_password' // Hasło zostanie zahashowane automatycznie
    });

    await admin.save();
    console.log('🟢 Admin created successfully!');
    process.exit(0);
  } catch (error) {
    console.error('🔴 Error:', error);
    process.exit(1);
  }
}

createAdmin();