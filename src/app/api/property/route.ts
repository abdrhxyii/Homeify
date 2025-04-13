import { uploadImages } from "@/lib/cloudinaryUtil";
import { connectToDatabase } from "@/lib/database";
import Property from "@/models/Property";
import { NextRequest, NextResponse } from "next/server";

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const formData = await req.formData();

        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const price = parseFloat(formData.get("price") as string);
        const location = formData.get("location") as string;
        const propertyType = formData.get("propertyType") as string;
        const bedrooms = parseInt(formData.get("bedrooms") as string);
        const bathrooms = parseInt(formData.get("bathrooms") as string);
        const area = parseFloat(formData.get("area") as string);
        const amenities = JSON.parse(formData.get("amenities") as string);
        const listingType = formData.get("listingType") as string;
        const sellerId = formData.get("sellerId") as string;

        const images = formData.getAll("images") as File[];

        console.log('Received images count:', images.length);

        if (!images || images.length < 2 || images.length > 6) {
            return NextResponse.json(
                { message: "You must upload between 2 to 6 images." },
                { status: 400 }
            );
        }

        const imageBuffers = await Promise.all(
            images.map(async (image) => ({
                buffer: Buffer.from(await image.arrayBuffer()),
            }))
        );

        const uploadedImageUrls = await uploadImages(imageBuffers);

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
            images: uploadedImageUrls,
            listingType,
            sellerId,
        });

        await newProperty.save();

        return NextResponse.json(
            {
                message: "Property created successfully",
                property: newProperty,
            },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: "Error creating property", error: error.message },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        await connectToDatabase();
        const properties = await Property.find();
        return NextResponse.json({properties: properties}, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error fetching properties", error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        await connectToDatabase();
        
        // Handle FormData for PUT requests
        const formData = await req.formData();
        
        const id = formData.get("id") as string;
        const title = formData.get("title") as string;
        const description = formData.get("description") as string;
        const price = parseFloat(formData.get("price") as string);
        const location = formData.get("location") as string;
        const propertyType = formData.get("propertyType") as string;
        const bedrooms = parseInt(formData.get("bedrooms") as string);
        const bathrooms = parseInt(formData.get("bathrooms") as string);
        const area = parseFloat(formData.get("area") as string);
        const amenities = JSON.parse(formData.get("amenities") as string);
        const listingType = formData.get("listingType") as string;
        
        // Check if images were modified
        const imagesModified = formData.get("imagesModified") === "true";
        
        // Find the existing property
        const existingProperty = await Property.findById(id);
        
        if (!existingProperty) {
            return NextResponse.json({ message: "Property not found" }, { status: 404 });
        }

        // Prepare the update data
        const updateData: any = {
            title,
            description,
            price,
            location,
            propertyType,
            bedrooms,
            bathrooms,
            area,
            amenities,
            listingType
        };
        
        // Handle images if they were modified
        if (imagesModified) {
            let finalImages: string[] = [];
            
            // Check if we should keep any existing images
            const keepExistingImagesStr = formData.get("keepExistingImages");
            if (keepExistingImagesStr) {
                const keepExistingImages = JSON.parse(keepExistingImagesStr as string);
                finalImages = [...keepExistingImages];
            }
            
            // Check if new images were uploaded
            const newImages = formData.getAll("images") as File[];
            
            if (newImages && newImages.length > 0) {
                const imageBuffers = await Promise.all(
                    newImages.map(async (image) => ({
                        buffer: Buffer.from(await image.arrayBuffer()),
                    }))
                );
                
                const uploadedImageUrls = await uploadImages(imageBuffers);
                finalImages = [...finalImages, ...uploadedImageUrls];
            }
            
            // Validate final image count
            if (finalImages.length < 2 || finalImages.length > 6) {
                return NextResponse.json(
                    { message: "You must have between 2 to 6 images." },
                    { status: 400 }
                );
            }
            
            // Add images to update data
            updateData.images = finalImages;
        }
        
        // Update the property
        const updatedProperty = await Property.findByIdAndUpdate(id, updateData, { new: true });
        
        return NextResponse.json({ 
            message: "Property updated successfully", 
            property: updatedProperty 
        }, { status: 200 });
    } catch (error: any) {
        console.error("Error updating property:", error);
        return NextResponse.json({ 
            message: "Error updating property", 
            error: error.message 
        }, { status: 500 });
    }
}


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
