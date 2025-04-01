import { NextResponse } from 'next/server'
import connectToDB from '@/lib/database';// Dodaj ten import
import History from '@/models/History'        // Dodaj ten import

export async function GET() {
    await connectToDB()
    try {
      const history = await History.find().sort({ date: -1 }).limit(10)
      return NextResponse.json(
        { success: true, data: history }, // Zawsze zwracaj obiekt JSON
        { status: 200 }
      )
    } catch (error) {
      return NextResponse.json(
        { success: false, error: error.message }, // Zwróć strukturę błędów
        { status: 500 }
      )
    }
  }

export async function POST(request) {
  await connectToDB()  // Połączenie z bazą danych
  try {
    const body = await request.json()
    const newEntry = new History(body)
    await newEntry.save()
    return NextResponse.json({ success: true, data: newEntry })
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 })
  }
}