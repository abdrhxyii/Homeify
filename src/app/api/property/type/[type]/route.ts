import { connectToDatabase } from "@/lib/database";
import Property from "@/models/Property";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params}: {params: {type: string}}) {
    const listinType = params.type
    try {
        await connectToDatabase();
        const properties = await Property.find({
            listingType: listinType
        });
        return NextResponse.json({properties: properties}, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error fetching properties", error: error.message }, { status: 500 });
    }
}
