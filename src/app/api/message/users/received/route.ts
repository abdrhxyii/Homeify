// File: /app/api/message/users/received/route.ts
import { connectToDatabase } from "@/lib/database";
import Message from "@/models/Message";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const receiverId = searchParams.get("receiverId");

        if (!receiverId) {
            return NextResponse.json({ message: "Missing receiverId" }, { status: 400 });
        }

        // Find all users who have sent messages to this user
        const senderIds = await Message.find({ receiverId }).distinct("senderId");

        const senders = await User.find({ _id: { $in: senderIds } }).select("_id name email");

        return NextResponse.json({ senders }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error fetching senders", error: error.message }, { status: 500 });
    }
}