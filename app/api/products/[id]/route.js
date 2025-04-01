// app/api/products/[id]/route.js
import { NextResponse } from 'next/server'
import connectToDB from '@/lib/database'
import Product from '@/models/Product'
import mongoose from 'mongoose'

// UPDATE product
// UPDATE product
export async function PUT(req, { params }) {
  await connectToDB();
  try {
    // Await the params object before destructuring
    const awaitedParams = await params;
    const { id } = awaitedParams;

    // Dodatkowa walidacja ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Nieprawidłowy format ID produktu" },
        { status: 400 }
      );
    }

    const body = await req.json();

    // Aktualizacja z walidacją
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
        runValidators: true,
        context: 'query',
      }
    );

    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: "Produkt nie znaleziony" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedProduct,
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message.includes("Cast to ObjectId failed")
          ? "Nieprawidłowy format ID"
          : error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(req, { params }) {
  await connectToDB();
  try {
    // Await the params object before destructuring
    const awaitedParams = await params;
    const { id } = awaitedParams;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, error: "Nieprawidłowy format ID" },
        { status: 400 }
      );
    }

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return NextResponse.json(
        { success: false, error: "Produkt nie istnieje" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { id: deletedProduct._id },
    });

  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error.message.includes("Cast to ObjectId failed")
          ? "Nieprawidłowy format ID"
          : error.message,
      },
      { status: 500 }
    );
  }
}