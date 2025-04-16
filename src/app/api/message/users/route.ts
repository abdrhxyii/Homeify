import { connectToDatabase } from "@/lib/database";
import Message from "@/models/Message";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const senderId = searchParams.get("senderId");

        if (!senderId) {
            return NextResponse.json({ message: "Missing senderId" }, { status: 400 });
        }

        const receiverIds = await Message.find({ senderId }).distinct("receiverId");

        const receivers = await User.find({ _id: { $in: receiverIds } }).select("_id name email");

        return NextResponse.json({ receivers }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error fetching conversations", error: error.message }, { status: 500 });
    }
}
