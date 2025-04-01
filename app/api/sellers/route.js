import { NextResponse } from "next/server";
import connectToDB from "@/lib/database";
import Seller from "@/models/Sellers";

export async function GET() {
  await connectToDB();
  try {
    const sellers = await Seller.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: sellers }, { status: 200 });
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
    const newSeller = new Seller(body);
    await newSeller.save();
    return NextResponse.json(
      { success: true, data: newSeller },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}