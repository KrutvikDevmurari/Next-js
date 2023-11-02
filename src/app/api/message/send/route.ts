import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Chat from "@/models/chat";
import { pusherServer } from "@/lib/pusher";
import { toPusherKey } from "@/lib/utils";
import { getSomeUserById } from "@/helpers/usermodel";
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';


export async function POST(req: Request) {
    try {
        const body = await req.formData();
        const uploadDir = path.join(process.cwd(), 'public/uploads/chat');
        const text = body.get('text');
        const chatId: any = body.get('chatId');
        const file: any = body.get('attachment');
        const session = await getServerSession(authOptions);
        const originalFileName = (file.name ? file.name : file); // Generate a unique filename if a file is provided
        if (!session) {
            return NextResponse.json({ message: "UnAuthorized" }, { status: 401 });
        }
        const [userId1, userId2] = chatId && chatId.split("--");
        const isSelfChat = (session.user.id.toString() === userId1.toString() && session.user.id.toString() === userId2.toString())
        const friendId =
            session.user.id.toString() === userId1.toString() ? userId2 : userId1.toString();
        const friendList = await session.user.friends;
        const isfriend = friendList.some((res: any) => res.userId.toString() === friendId.toString());

        const sender: any = await getSomeUserById(session.user.id);
        const groupReciverId =
            (!isSelfChat && !isfriend) ?
                session.user.group.find((res: any) => res._id.toString() === friendId.toString())?.users.map(
                    (item: any) => ({ id: item.id })
                ) : null;

        // Prepare the message object
        const timestamp = Date.now();
        const message: any = {
            senderId: session.user.id,
            receiverId: isSelfChat ? [{ id: session.user.id }] : (isfriend ? [{ id: friendId }] : groupReciverId),
            text: text,
            timestamp: timestamp,
            chatId: chatId,
            attachment: file ? [{
                name: originalFileName,
            }] : null
        };
        if (!file) {
            pusherServer.trigger(toPusherKey(`chat:${chatId}`), `incoming-message`, message);
        }
        // sending message
        const newmessage: any = {
            ...message,
            senderImg: sender.image,
            senderName: sender.name,
            chatId: chatId
        };

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




        const filePath = path.join(uploadDir, originalFileName);
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
        if (file && file.name) {
            if (!file.name.includes("http")) {
                // if (file.type.includes("jpg") || file.type.includes("png")) {
                const fileBuffer = await file.arrayBuffer();
                const fileData = Buffer.from(fileBuffer);
                await fs.writeFile(filePath, fileData);

                // Attempt to add the group

                pusherServer.trigger(toPusherKey(`chat:${chatId}`), `incoming-message`, message);
                return NextResponse.json({ message: "Success", success: true }, { status: 200 });
                // } else {
                //     return NextResponse.json({ message: 'Please provide a valid image here', success: false }, { status: 422 });
                // }
            }
        } else if (file) {
            pusherServer.trigger(toPusherKey(`chat:${chatId}`), `incoming-message`, message);
        }

        return NextResponse.json({ message: "Success" }, { status: 200 });
    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: err }, { status: 500 });
    }
}
