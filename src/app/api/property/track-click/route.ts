import { connectToDatabase } from "@/lib/database";
import Property from "@/models/Property";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const { propertyId } = await req.json();

    if (!propertyId) {
      return NextResponse.json(
        { message: "Property ID is required" },
        { status: 400 }
      );
    }

    const property = await Property.findByIdAndUpdate(
      propertyId,
      { $inc: { clickCount: 1 } }, // Increment clickCount by 1
      { new: true } // Return the updated document
    );

    if (!property) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Click recorded", clickCount: property.clickCount },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error recording click", error: error.message },
      { status: 500 }
    );
  }
}