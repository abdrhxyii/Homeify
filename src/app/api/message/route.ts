import { connectToDatabase } from "@/lib/database";
import Message from "@/models/Message";
import User from "@/models/User"; 
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const { senderId, receiverId, content, propertyId } = await req.json();

        const sender = await User.findById(senderId);
        if (!sender) {
            return NextResponse.json({ message: "Sender not found" }, { status: 404 });
        }

        // if (sender.role !== 'USER') {
        //     return NextResponse.json({ message: "Only users can send messages first." }, { status: 403 });
        // }

        const receiver = await User.findById(receiverId);
        if (!receiver) {
            return NextResponse.json({ message: "Receiver not found" }, { status: 404 });
        }

        // if (receiver.role !== 'SELLER') {
        //     return NextResponse.json({ message: "Receiver must be a seller." }, { status: 403 });
        // }

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

export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);

        const senderId = searchParams.get("senderId");
        const receiverId = searchParams.get("receiverId");

        if (!senderId || !receiverId) {
            return NextResponse.json({ message: "Missing senderId or receiverId" }, { status: 400 });
        }

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