import { uploadImages } from "@/lib/cloudinaryUtil";
import { connectToDatabase } from "@/lib/database";
import Property from "@/models/Property";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const { title, description, price, location, propertyType, bedrooms, bathrooms, area, amenities, images, listingType, sellerId } = body;

        // Validate images
        if (!images || images.length < 4 || images.length > 6) {
            return NextResponse.json({ message: "You must upload between 4 to 6 images." }, { status: 400 });
        }

        // Upload images to Cloudinary
        const uploadedImageUrls = await uploadImages(images);

        // Create a new property instance
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
            images: uploadedImageUrls, // Use the uploaded image URLs
            listingType,
            sellerId, // Foreign key for the seller
        });

        // Save the property to the database
        await newProperty.save();

        return NextResponse.json({ 
            message: "Property created successfully", 
            property: newProperty 
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ message: "Error creating property", error: error.message }, { status: 500 });
    }
}

// GET: Get all properties
export async function GET() {
    try {
        await connectToDatabase();
        const properties = await Property.find();
        return NextResponse.json(properties, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error fetching properties", error: error.message }, { status: 500 });
    }
}

// PUT: Update an existing property
export async function PUT(req: NextRequest) {
    try {
        await connectToDatabase();
        const { id, ...updateFields } = await req.json();
        const updatedProperty = await Property.findByIdAndUpdate(id, updateFields, { new: true });

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
        await connectToDatabase();
        const { id } = await req.json();
        const deletedProperty = await Property.findByIdAndDelete(id);

        if (!deletedProperty) {
            return NextResponse.json({ message: "Property not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Property deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error deleting property", error: error.message }, { status: 500 });
    }
}
