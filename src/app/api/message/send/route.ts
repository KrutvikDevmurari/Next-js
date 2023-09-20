import { authOptions } from "@/lib/auth"
import chat from "@/models/chat"
import { nanoid } from "nanoid"
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"
import Message from '@/models/message'
import Chat from '@/models/chat'

export async function POST(req: Request) {
    try {
        const { text, chatId } = await req.json()
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ message: "UnAuthorized" }, { status: 401 });
        }
        const [userId1, userId2] = chatId.split("--")
        console.log(userId1.toString(), userId2.toString(), session.user.id.toString(), "sessison")
        if (session.user.id.toString() !== userId1.toString() && session.user.id.toString() !== userId2.toString()) {
            return NextResponse.json({ message: "UnAuthorized" }, { status: 401 });
        }
        const friendId = session.user.id.toString() === userId1.toString() ? userId2 : userId1.toString();
        const friendList = await session.user.friends
        const isfriend = friendList.some((res: any) => res.userId.toString() === friendId.toString())

        if (!isfriend) {
            return NextResponse.json({ message: "UnAuthorized" }, { status: 401 });
        }

        const sender = await session.user.id
        // sending message 
        const timestamp = Date.now()

        const message: Message = {
            senderId: session.user.id,
            receiverId: friendId,
            text: text,
            timestamp: timestamp
        }
        // const chat: Chat = {
        //     id: chatId,
        //     messages: [text]
        // }
        // const newChat = await Chat.create(Chat)
        const newmessage = await Message.create(message)
        newmessage.save()
        return NextResponse.json({ message: "Sucess" }, { status: 200 });
    } catch (err) {
        console.log(err)
        return NextResponse.json({ error: err }, { status: 500 });
    }
}