import { NextResponse } from 'next/server'
import { connectToDB } from '@/lib/database'
import Category from '@/models/Category'

export async function GET() {
  await connectToDB()
  try {
    const categories = await Category.find({})
    return NextResponse.json(categories)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  await connectToDB()
  try {
    const body = await request.json()
    const newCategory = new Category(body)
    await newCategory.save()
    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}