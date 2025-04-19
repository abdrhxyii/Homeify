// import { connectToDatabase } from "@/lib/database";
// import Property from "@/models/Property";
// import { NextRequest, NextResponse } from "next/server";
// import mongoose from 'mongoose';

// export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
//     try {
//         await connectToDatabase();
//         const userId = params.id;
//         console.log(userId, "userId param");

//         // Get all properties first
//         const allProperties = await Property.find({});
//         console.log(`Total properties in database: ${allProperties.length}`);
        
//         // Try direct comparison with the exact sellerId field structure
//         // and filter in JavaScript rather than MongoDB query
//         const matchingProperties = allProperties.filter(prop => 
//             prop.sellerId.toString() === userId
//         );
        
//         console.log(`Properties with matching sellerId: ${matchingProperties.length}`);
        
//         // If there are still no matches, find a property with this seller and log its details
//         if (matchingProperties.length === 0) {
//             // Try raw MongoDB find with a string instead of ObjectId conversion
//             const rawProperties = await Property.find({ 
//                 sellerId: userId 
//             }).lean();
            
//             console.log(`Properties found with raw string query: ${rawProperties.length}`);
            
//             // Check our data for this specific seller to see what's going on
//             const propertyWithThisSeller = allProperties.find(p => 
//                 p.sellerId && p.sellerId.toString() === userId
//             );
            
//             if (propertyWithThisSeller) {
//                 console.log("Found a property with this seller ID!");
//                 console.log("Property _id:", propertyWithThisSeller._id);
//                 console.log("Property title:", propertyWithThisSeller.title);
//             } else {
//                 console.log("No property found with this exact seller ID in any format.");
                
//                 // Let's check if the ID appears as a substring anywhere
//                 const possibleMatches = allProperties.filter(p => 
//                     p.sellerId && p.sellerId.toString().includes(userId.substring(0, 10))
//                 );
                
//                 if (possibleMatches.length > 0) {
//                     console.log(`Found ${possibleMatches.length} properties with partial ID match`);
//                     console.log("Sample possible match sellerId:", possibleMatches[0].sellerId.toString());
//                 }
//             }
//         }

//         // Return either the filtered properties or nothing
//         return NextResponse.json({ 
//             properties: matchingProperties,
//             message: matchingProperties.length === 0 ? "No properties found for this user" : ""
//         }, { status: 200 });
//     } catch (error: any) {
//         console.error("Error fetching properties:", error);
//         return NextResponse.json({ 
//             message: "Error fetching properties", 
//             error: error.message 
//         }, { status: 500 });
//     }
// }

import { connectToDatabase } from "@/lib/database";
import Property from "@/models/Property";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        
        // Get sellerId from query parameters
        const { searchParams } = new URL(req.url);
        const sellerId = searchParams.get("sellerId");

        if (!sellerId) {
            return NextResponse.json(
                { message: "sellerId is required" },
                { status: 400 }
            );
        }

        // Validate sellerId format (MongoDB ObjectId)
        if (!/^[0-9a-fA-F]{24}$/.test(sellerId)) {
            return NextResponse.json(
                { message: "Invalid sellerId format" },
                { status: 400 }
            );
        }

        // Find all properties with the given sellerId
        const properties = await Property.find({ sellerId }).populate('sellerId', 'name email');

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
                message: "Properties retrieved successfully",
                properties 
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