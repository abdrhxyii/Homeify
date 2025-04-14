import { connectToDatabase } from "@/lib/database";
import Message from "@/models/Message"; // Assuming you have a Message model
import User from "@/models/User"; // Import User model
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const { senderId, receiverId, content, propertyId } = await req.json();

        // Check sender's role
        const sender = await User.findById(senderId);
        if (!sender) {
            return NextResponse.json({ message: "Sender not found" }, { status: 404 });
        }

        if (sender.role !== 'USER') {
            return NextResponse.json({ message: "Only users can send messages first." }, { status: 403 });
        }

        // Check receiver's role
        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return NextResponse.json({ message: "Receiver not found" }, { status: 404 });
        }

        if (receiver.role !== 'SELLER') {
            return NextResponse.json({ message: "Receiver must be a seller." }, { status: 403 });
        }

        // Create a new message
        const newMessage = new Message({
            senderId,
            receiverId,
            content,
            propertyId,
            timestamp: new Date(),
        });

        await newMessage.save();

        return NextResponse.json(
            { message: newMessage },
            { status: 201 }
        );
    } catch (error: any) {
        return NextResponse.json(
            { message: "Error sending message", error: error.message },
            { status: 500 }
        );
    }
}

// You can also implement a GET method to fetch messages if needed
export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const { senderId, receiverId } = await req.json();

        const messages = await Message.find({
            $or: [
                { senderId, receiverId },
                { senderId: receiverId, receiverId: senderId }
            ]
        }).sort({ timestamp: 1 });

        return NextResponse.json({ messages }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error fetching messages", error: error.message }, { status: 500 });
    }
}
