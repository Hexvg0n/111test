import mongoose from 'mongoose'

const MONGODB_URI = process.env.DATABASE_URL

if (!MONGODB_URI) {
  throw new Error('DATABASE_URL nie jest zdefiniowane w zmiennych środowiskowych')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

export async function connectToDB() {
    if (cached.conn) return cached.conn
  
    if (!cached.promise) {
      cached.promise = mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000,  // Skrócony timeout
        socketTimeoutMS: 45000,
        family: 4 // Wymuś IPv4
      }).then(mongoose => mongoose)
      .catch(err => {
        console.error('Błąd połączenia z MongoDB:', err)
        throw err
      })
    }
  
    try {
      cached.conn = await cached.promise
      console.log('Połączono z MongoDB!')
      return cached.conn
    } catch (err) {
      console.error('Krytyczny błąd połączenia:', err)
      throw err
    }
  }