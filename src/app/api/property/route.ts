import { connectToDatabase } from "@/lib/database";
import Property from "@/models/Property";
import { NextRequest, NextResponse } from "next/server";

const connectDb = async () => {
  await connectToDatabase();
};

// POST: Create a new property
export async function POST(req: NextRequest) {
  try {
    await connectDb();

    const body = await req.json(); // Parse the request body
    const { title, description, price, location, propertyType, bedrooms, bathrooms, area, amenities, images, listingType, sellerId } = body;

    if (!sellerId) {  
      return NextResponse.json({ message: "Seller ID is required" }, { status: 400 });
    }

    // Create a new property document with the sellerId
    const newProperty = new Property({
      title,
      description,
      price,
      location,
      propertyType,
      bedrooms,
      bathrooms,
      area,
      amenities,
      images,
      listingType,
      sellerId, // Add the sellerId to the property
    });

    // Save the property to the database
    await newProperty.save();

    return NextResponse.json({ message: "Property created successfully", property: newProperty }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error creating property", error: error.message }, { status: 500 });
  }
}

// GET: Get all properties
export async function GET() {
  try {
    await connectDb();

    const properties = await Property.find(); // Retrieve all properties
    return NextResponse.json(properties, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error fetching properties", error: error.message }, { status: 500 });
  }
}

// PUT: Update an existing property
export async function PUT(req: NextRequest) {
  try {
    await connectDb();

    const { id, title, description, price, location, propertyType, bedrooms, bathrooms, area, amenities, images, listingType, sellerId } = await req.json();

    if (!sellerId) {
      return NextResponse.json({ message: "Seller ID is required" }, { status: 400 });
    }

    // Find the property by ID and update it
    const updatedProperty = await Property.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price,
        location,
        propertyType,
        bedrooms,
        bathrooms,
        area,
        amenities,
        images,
        listingType,
        sellerId, // Update the sellerId as well
      },
      { new: true } // Return the updated document
    );

    if (!updatedProperty) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Property updated successfully", property: updatedProperty }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error updating property", error: error.message }, { status: 500 });
  }
}

// DELETE: Delete a property
export async function DELETE(req: NextRequest) {
  try {
    await connectDb();

    const { id, sellerId } = await req.json();

    if (!sellerId) {
      return NextResponse.json({ message: "Seller ID is required" }, { status: 400 });
    }

    // Delete the property by ID and validate the seller
    const deletedProperty = await Property.findByIdAndDelete(id);

    if (!deletedProperty) {
      return NextResponse.json({ message: "Property not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Property deleted successfully" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: "Error deleting property", error: error.message }, { status: 500 });
  }
}
