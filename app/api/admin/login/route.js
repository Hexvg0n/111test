import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import AdminUser from '@/models/AdminUser'
import { SignJWT } from 'jose'
import { cookies } from 'next/headers'

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  }
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET)

export async function POST(request) {
  try {
    await connectDB()
    
    const { email, password, remember } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email i hasło są wymagane" },
        { status: 400 }
      )
    }

    const user = await AdminUser.findOne({ email: email.toLowerCase() })
    if (!user) {
      return NextResponse.json(
        { message: "Nieprawidłowy email lub hasło" },
        { status: 401 }
      )
    }

    const isValidPassword = await user.comparePassword(password)
    if (!isValidPassword) {
      return NextResponse.json(
        { message: "Nieprawidłowy email lub hasło" },
        { status: 401 }
      )
    }

    const token = await new SignJWT({ 
      id: user._id,
      email: user.email,
      role: 'admin'
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime(remember ? '30d' : '1h')
      .sign(secret)

    cookies().set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: remember ? 30 * 24 * 60 * 60 : 60 * 60,
      path: '/',
    })

    return NextResponse.json(
      { message: "Zalogowano pomyślnie", redirect: "/admin" }, // Dodaj informację o przekierowaniu
      { status: 200 }
    )
  } catch (error) {
    console.error('Błąd logowania:', error)
    return NextResponse.json(
      { message: "Wystąpił błąd serwera" },
      { status: 500 }
    )
  }
}