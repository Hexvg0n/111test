import { NextResponse } from "next/server";
import connectToDB from "@/lib/database";
import Seller from "@/models/Sellers";
import mongoose from "mongoose";

export async function PUT(request, { params }) {
  await connectToDB();
  try {
    const { id } = await params;
    const body = await request.json();
    const updatedSeller = await Seller.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    );
    if (!updatedSeller) {
      return NextResponse.json(
        { success: false, error: "Sprzedawca nie istnieje" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: true, data: updatedSeller },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  await connectToDB();
  try {
    const { id } = await params;
    const deletedSeller = await Seller.findByIdAndDelete(id);
    if (!deletedSeller) {
      return NextResponse.json(
        { success: false, error: "Sprzedawca nie istnieje" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}