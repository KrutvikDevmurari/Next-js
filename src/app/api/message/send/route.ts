import { authOptions } from "@/lib/auth";
import chat from "@/models/chat";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Message from "@/models/message";
import Chat from "@/models/chat";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { getSomeUserById } from "@/helpers/usermodel";

export async function POST(req: Request) {
    try {
        const { text, chatId } = await req.json();
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "UnAuthorized" }, { status: 401 });
        }
        const [userId1, userId2] = chatId.split("--");
        const isSelfChat = (session.user.id.toString() === userId1.toString() && session.user.id.toString() === userId2.toString())
        const friendId =
            session.user.id.toString() === userId1.toString() ? userId2 : userId1.toString();
        const friendList = await session.user.friends;
        const isfriend = friendList.some((res: any) => res.userId.toString() === friendId.toString());

        const sender: any = await getSomeUserById(session.user.id);
        const groupReciverId =
            (!isSelfChat && !isfriend) ?
                session.user.group.find((res: any) => res._id.toString() === friendId.toString()).users.map(
                    (item: any) => ({ id: item.id })
                ) : null;

        // Prepare the message object
        const timestamp = Date.now();
        const message: any = {
            senderId: session.user.id,
            receiverId: isSelfChat ? [{ id: session.user.id }] : (isfriend ? [{ id: friendId }] : groupReciverId),
            text: text,
            timestamp: timestamp,
            chatId: chatId
        };

        // sending message
        const newmessage: any = {
            ...message,
            senderImg: sender.image,
            senderName: sender.name,
            chatId: chatId
        };

        pusherServer.trigger(toPusherKey(`chat:${chatId}`), `incoming-message`, message);

        if (!isSelfChat && isfriend) {
            pusherServer.trigger(toPusherKey(`user:${friendId}:chats`), `new_message`, newmessage)
        }


        if (!isSelfChat && groupReciverId !== null && !isfriend) {
            pusherServer.trigger(toPusherKey(`group:chats`), `new_message`, newmessage)
        }


        if (isSelfChat) {
            message.receiverId = [{ id: session.user.id }]
        };
        if (!isSelfChat && !isfriend) {
            message.receiverId = groupReciverId;
        }


        const existingChat = await Chat.findOne({ id: chatId });

        if (existingChat) {
            // If the chat exists, update its messages
            existingChat.messages.push(message);
            await existingChat.save();
        } else {
            // If the chat does not exist, create a new one
            const chat = {
                id: chatId,
                messages: [message], // Make sure to create an array of messages
            };
            const newChat = new Chat(chat);
            await newChat.save();
        }

        return NextResponse.json({ message: "Success" }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: err }, { status: 500 });
    }
}
