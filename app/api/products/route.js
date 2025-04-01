// app/api/products/route.js
import { NextResponse } from 'next/server'
import connectToDB from '@/lib/database'
import Product from '@/models/Product'
import mongoose from 'mongoose'

// GET all products
export async function GET() {
  try {
    await connectToDB()
    const products = await Product.find({}).lean()
    
    return NextResponse.json({
      success: true,
      count: products.length,
      data: products
    })
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: `Błąd serwera: ${error.message}`
    }, { status: 500 })
  }
}

// CREATE new product
export async function POST(request) {
  await connectToDB()
  try {
    const body = await request.json()
    
    // Manual validation example
    if (!body.name || body.name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Nazwa produktu musi mieć minimum 2 znaki" },
        { status: 400 }
      )
    }

    const newProduct = new Product(body)
    await newProduct.validate() // Trigger model validation
    
    const savedProduct = await newProduct.save()

    return NextResponse.json({
      success: true,
      data: savedProduct
    }, { status: 201 })

  } catch (error) {
    let status = 500
    let errorMessage = error.message
    
    if (error instanceof mongoose.Error.ValidationError) {
      status = 400
      errorMessage = Object.values(error.errors).map(e => e.message).join(', ')
    }
    
    return NextResponse.json({
      success: false,
      error: errorMessage
    }, { status })
  }
}