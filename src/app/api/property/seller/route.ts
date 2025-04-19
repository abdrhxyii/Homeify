import { connectToDatabase } from "@/lib/database";
import Property from "@/models/Property";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        
        const { searchParams } = new URL(req.url);
        const sellerId = searchParams.get("sellerId");

        if (!sellerId) {
            return NextResponse.json(
                { message: "sellerId is required" },
                { status: 400 }
            );
        }

        const properties = await Property.find({
            sellerId: sellerId
        });

        if (properties.length === 0) {
            return NextResponse.json(
                { 
                    message: "No properties found for this seller",
                    properties: []
                },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { 
                properties: properties 
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error fetching properties by sellerId:", error);
        return NextResponse.json(
            { 
                message: "Error fetching properties",
                error: error.message 
            },
            { status: 500 }
        );
    }
}