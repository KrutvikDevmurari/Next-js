'use client'

import { pusherClient } from '@/lib/pusher'
import { chatHrefConstructor, toPusherKey } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import { signIn } from 'next-auth/react'
import UnseenGroupChatToast from './UnseenGroupChatToast'

interface SidebarChatListProps {
    friends: any[] | null
    sessionId: string,
}

interface ExtendedMessage extends Message {
    senderImg: string
    senderName: string,
    chatId: any
}

const SidebarGroupChatList: FC<SidebarChatListProps> = ({ friends, sessionId }) => {
    const router = useRouter()
    const pathname = usePathname()
    const [unseenMessages, setUnseenMessages] = useState<Message[]>([])
    const [activeChats, setActiveChats] = useState<any>(friends)


    useEffect(() => {
        var presenceChannel = pusherClient.subscribe(toPusherKey(`group:chats`))
        // pusherClient.subscribe(toPusherKey(`group:${sessionId}:friends`))
        console.log(presenceChannel, "presenceChannel")
        const newFriendHandler = (newFriend: User) => {
            setActiveChats((prev: any) => [...prev, newFriend])
        }
        const chatHandler = (message: ExtendedMessage) => {
            const [userId1, userId2] = JSON.parse(JSON.stringify(message.chatId.split('--')));
            const chatPartnerId = sessionId === userId1 ? userId2 : userId1;
            const isChatOpen = pathname === `/dashboard/group/chat/${message.chatId}`;
            const ChatGroup = activeChats.find((user: any) => user._id === chatPartnerId)
            console.log(ChatGroup, "ChatGroup")
            // if (!isChatOpen && friends?.some((friend) => friend._id === chatPartnerId)) {
            // Notify user if the chat is not open and the chat partner is not a friend
            if (ChatGroup) {
                toast.custom((t) => (
                    <UnseenGroupChatToast
                        t={t}
                        senderImg={message.senderImg}
                        senderMessage={message.text}
                        senderName={message.senderName}
                        chatId={message.chatId}
                        activeChats={ChatGroup}
                    />
                ));
            }


            // Add the message to unseenMessages
            setUnseenMessages((prev) => [...prev, message]);
            // }
        };

        pusherClient.bind('new_message', chatHandler)
        pusherClient.bind('new_friend', newFriendHandler)

        return () => {
            pusherClient.unsubscribe(toPusherKey(`group:chats`))
            // pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))

            pusherClient.unbind('new_message', chatHandler)
            pusherClient.unbind('new_friend', newFriendHandler)
        }
    }, [pathname, sessionId, router, signIn])

    useEffect(() => {
        if (pathname?.includes('chat')) {
            setUnseenMessages((prev) => {
                return prev.filter((msg) => !pathname.includes(msg.senderId))
            })
        }
    }, [pathname])

    return (
        <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
            {activeChats !== null && activeChats.sort().map((friend: any) => {
                const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
                    return unseenMsg.senderId === friend._id
                }).length
                return (
                    <li key={friend._id}>
                        <a
                            href={`/dashboard/group/chat/${chatHrefConstructor(
                                friend.createdBy,
                                friend._id
                            )}`}
                            className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>


                            <Image src={friend.groupImage?.includes("http") ? friend.groupImage : `/uploads/group/${friend.groupImage}`} alt="Friend Zone" width={25} height={25} className='rounded-full' />{friend.groupname}
                            {unseenMessagesCount > 0 ? (
                                <div className='bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
                                    {unseenMessagesCount}
                                </div>
                            ) : null}
                        </a>
                    </li>
                )
            })}
        </ul>
    )
}

export default SidebarGroupChatList