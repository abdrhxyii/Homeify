import { connectToDatabase } from "@/lib/database";
import Property from "@/models/Property";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req: NextRequest, {params}: {params: {id: string}}) {
  try {
    const id = params.id;

    // Validate if id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid property ID format" },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find the property by ID
    const property = await Property.findById(id);

    if (!property) {
      return NextResponse.json(
        { message: "Property not found" },
        { status: 404 }
      );
    }

    // Find the seller information
    const seller = await User.findById(property.sellerId).select(
      "email name phoneNumber"
    );

    if (!seller) {
      return NextResponse.json(
        { message: "Seller information not found" },
        { status: 404 }
      );
    }

    // Return property with seller info
    return NextResponse.json(
      {
        property,
        seller: {
          id: seller._id,
          email: seller.email,
          name: seller.name,
          phoneNumber: seller.phoneNumber,
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error fetching property:", error);
    return NextResponse.json(
      { message: "Error fetching property", error: error.message },
      { status: 500 }
    );
  }
}
