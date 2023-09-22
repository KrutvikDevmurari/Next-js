import { authOptions } from "@/lib/auth"
import chat from "@/models/chat"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import Message from '@/models/message'
import Chat from '@/models/chat'
import { pusherClient, pusherServer } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"
import { getSomeUserById } from "@/helpers/usermodel"

export async function POST(req: Request) {
    try {
        const { text, chatId } = await req.json()
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ message: "UnAuthorized" }, { status: 401 });
        }
        const [userId1, userId2] = chatId.split("--")
        if (session.user.id.toString() !== userId1.toString() && session.user.id.toString() !== userId2.toString()) {
            return NextResponse.json({ message: "UnAuthorized" }, { status: 401 });
        }
        const friendId = session.user.id.toString() === userId1.toString() ? userId2 : userId1.toString();
        const friendList = await session.user.friends
        const isfriend = friendList.some((res: any) => res.userId.toString() === friendId.toString())

        if (!isfriend) {
            return NextResponse.json({ message: "UnAuthorized" }, { status: 401 });
        }

        const sender: any = await getSomeUserById(session.user.id)
        // sending message 
        const timestamp = Date.now()
        const message: any = {
            senderId: session.user.id,
            receiverId: friendId,
            text: text,
            timestamp: timestamp
        }
        console.log(sender, "sender")
        const newmessage: any = {
            ...message,
            senderImg: sender.image,
            senderName: sender.name
        }
        const existingChat = await Chat.findOne({ id: chatId });
        pusherServer.trigger(toPusherKey(`chat:${chatId}`), `incoming-message`, message)
        pusherServer.trigger(toPusherKey(`user:${friendId}:chats`), `new_message`, newmessage)

        if (existingChat) {
            // If the chat exists, update its messages
            existingChat.messages.push(message);
            await existingChat.save();
        } else {
            // If the chat does not exist, create a new one
            const chat = {
                id: chatId,
                messages: message
            };
            const newChat = new Chat(chat);
            await newChat.save();
        }
        return NextResponse.json({ message: "Sucess" }, { status: 200 });
    } catch (err) {
        console.log(err)
        return NextResponse.json({ error: err }, { status: 500 });
    }
}