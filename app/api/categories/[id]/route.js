import { NextResponse } from 'next/server';
import connectToDB from '@/lib/database';
import Category from '@/models/Category';
import mongoose from 'mongoose';
import Product from '@/models/Product';
export async function PUT(req, { params }) {
  await connectToDB();
  try {
    // Pobieramy i walidujemy ID kategorii
    const awaitedParams = await params;
    const { id } = awaitedParams;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Nieprawidłowy format ID kategorii" },
        { status: 400 }
      );
    }

    // Pobieramy dane z żądania
    const body = await req.json();

    // Walidacja nazwy kategorii
    if (!body.name || body.name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: "Nazwa kategorii musi mieć przynajmniej 2 znaki" },
        { status: 400 }
      );
    }

    // Sprawdzamy czy kategoria istnieje
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, error: "Kategoria nie istnieje" },
        { status: 404 }
      );
    }

    // Aktualizacja kategorii
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name: body.name },
      { new: true, runValidators: true }
    );

    return NextResponse.json(
      { success: true, data: updatedCategory },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  await connectToDB();
  try {
    // Pobieramy i walidujemy ID kategorii
    const awaitedParams = await params;
    const { id } = awaitedParams;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Nieprawidłowy format ID kategorii" },
        { status: 400 }
      );
    }

    // Sprawdzamy istnienie kategorii
    const category = await Category.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, error: "Kategoria nie istnieje" },
        { status: 404 }
      );
    }

    // Sprawdzamy czy kategoria ma przypisane produkty
    const productsCount = await Product.countDocuments({ category: id });
    if (productsCount > 0) {
      return NextResponse.json(
        { success: false, error: "Kategoria zawiera produkty" },
        { status: 400 }
      );
    }

    // Usuwanie kategorii
    const deletedCategory = await Category.findByIdAndDelete(id);
    return NextResponse.json(
      { success: true, data: deletedCategory },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}