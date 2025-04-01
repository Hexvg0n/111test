import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Musisz zdefiniować MONGODB_URI w środowisku');
}

let cachedConnection = null;

async function connectToDB() {
  if (cachedConnection) {
    return cachedConnection;
  }

  try {
    cachedConnection = await mongoose.connect(process.env.MONGODB_URI);
    console.log('Połączono z MongoDB');
    return cachedConnection;
  } catch (error) {
    console.error('Błąd połączenia z MongoDB:', error);
    throw error;
  }
}

export default connectToDB;