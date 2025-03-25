import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/database'
import Product from '@/models/Product'

export async function GET() {
    try {
      await connectToDB()
      const products = await Product.find({})
      return NextResponse.json(products)
    } catch (error) {
      console.error('GET Error:', error)
      return NextResponse.json(
        { error: error.message || 'Database error' },
        { status: 500 }
      )
    }
  }

export async function POST(request) {
  await connectToDB()
  try {
    const body = await request.json()
    const newProduct = new Product(body)
    await newProduct.save()
    return NextResponse.json(newProduct, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}