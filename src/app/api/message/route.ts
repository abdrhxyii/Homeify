import { connectToDatabase } from "@/lib/database";
import Message from "@/models/Message";
import { NextRequest, NextResponse } from "next/server";

// POST: Create a new message
export async function POST(req: NextRequest) {
    try {
        await connectToDatabase();
        const body = await req.json();
        const { receiverId, senderId, content, propertyId } = body;

        const newMessage = new Message({
            receiverId,
            senderId,
            content,
            propertyId,
        });

        await newMessage.save();

        return NextResponse.json({ 
            message: "Message sent successfully", 
            data: newMessage 
        }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ message: "Error sending message", error: error.message }, { status: 500 });
    }
}

// GET: Retrieve messages for a specific user
export async function GET(req: NextRequest) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url); // Use URL to access query parameters
        const userId = searchParams.get('userId'); // Get userId from query parameters
        const messages = await Message.find({
            $or: [
                { receiverId: userId },
                { senderId: userId }
            ]
        }).populate('receiverId senderId propertyId'); // Populate to get user and property details

        return NextResponse.json(messages, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error fetching messages", error: error.message }, { status: 500 });
    }
}

// DELETE: Delete a specific message
export async function DELETE(req: NextRequest) {
    try {
        await connectToDatabase();
        const { id } = await req.json(); // Expecting the message ID in the request body
        const deletedMessage = await Message.findByIdAndDelete(id);

        if (!deletedMessage) {
            return NextResponse.json({ message: "Message not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Message deleted successfully" }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: "Error deleting message", error: error.message }, { status: 500 });
    }
}

