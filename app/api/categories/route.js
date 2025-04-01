import { NextResponse } from 'next/server';
import connectToDB from '@/lib/database';
import Category from '@/models/Category';

export async function GET() {
  await connectToDB();
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    return NextResponse.json(
      { success: true, data: categories },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  await connectToDB();
  try {
    const body = await request.json();

    // Walidacja nazwy kategorii
    if (!body.name || body.name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Nazwa kategorii musi mieć przynajmniej 2 znaki" },
        { status: 400 }
      );
    }

    // Sprawdzenie unikalności nazwy
    const existingCategory = await Category.findOne({ name: body.name });
    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: "Kategoria o tej nazwie już istnieje" },
        { status: 409 }
      );
    }

    // Zapis nowej kategorii
    const newCategory = new Category(body);
    await newCategory.save();
    return NextResponse.json(
      { success: true, data: newCategory },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}