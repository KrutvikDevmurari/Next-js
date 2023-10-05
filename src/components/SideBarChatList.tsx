'use client'

import { pusherClient } from '@/lib/pusher'
import { chatHrefConstructor, toPusherKey } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { FC, SetStateAction, useContext, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import UnseenChatToast from './UnseenChatToast'
import { Circle } from 'lucide-react'
import { signIn } from 'next-auth/react'
import { Channel, Members } from 'pusher-js'

interface SidebarChatListProps {
    friends: any[] | null
    sessionId: string
}

interface ExtendedMessage extends Message {
    senderImg: string
    senderName: string
}

const SidebarChatList: FC<SidebarChatListProps> = ({ friends, sessionId }) => {
    const router = useRouter()
    const pathname = usePathname()
    const [unseenMessages, setUnseenMessages] = useState<Message[]>([])
    const [activeChats, setActiveChats] = useState<any>(friends)
    const [userKeys, setUserKeys] = useState<any>([]);
    // const user = useContext(UserContext);
    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`))
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))


        const newFriendHandler = (newFriend: User) => {
            setActiveChats((prev: any) => [...prev, newFriend])
        }

        const chatHandler = (message: ExtendedMessage) => {
            const shouldNotify =
                pathname !==
                `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`

            if (!shouldNotify) return

            // should be notified
            toast.custom((t) => (
                <UnseenChatToast
                    t={t}
                    sessionId={sessionId}
                    senderId={message.senderId}
                    senderImg={message.senderImg}
                    senderMessage={message.text}
                    senderName={message.senderName}
                />
            ))

            setUnseenMessages((prev) => [...prev, message])
        }

        pusherClient.bind('new_message', chatHandler)
        pusherClient.bind('new_friend', newFriendHandler)

        return () => {
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`))
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))

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
    useEffect(() => {
        const channel = pusherClient.subscribe(`presence-online`);

        // Function to handle member removal
        const handleMemberRemoved = (member: { id: any }) => {
            setUserKeys((prevUserKeys: any[]) => prevUserKeys.filter((key) => key !== member.id));
        };

        // Bind the event handlers
        channel.bind("pusher:subscription_succeeded", (members: { each: (arg0: (member: any) => void) => void }) => {
            // Initialize userKeys with the current member IDs
            members.each((member) => {
                // For example
                setUserKeys((prevUserKeys: any) => [...prevUserKeys, member.id]);
            });
        });

        channel.bind("pusher:member_added", (member: { id: any }) => {
            // Add a new member to userKeys
            setUserKeys((prevUserKeys: any) => [...prevUserKeys, member.id]);
        });

        channel.bind("pusher:member_removed", handleMemberRemoved);

        // Cleanup function
        return () => {
            // Unbind event handlers
            channel.unbind("pusher:member_removed", handleMemberRemoved);

            // Unsubscribe from the channel when the component unmounts
            pusherClient.unsubscribe(`presence-online`);
        };
    }, []);
    console.log(userKeys, "userkeys")
    return (
        <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
            {activeChats !== null && activeChats.sort().map((friend: any) => {
                const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
                    return unseenMsg.senderId === friend._id
                }).length
                return (
                    <li key={friend._id}>
                        <a
                            href={`/dashboard/chat/${chatHrefConstructor(
                                sessionId,
                                friend._id
                            )}`}
                            className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
                            {userKeys.includes(friend._id) ? <Circle className='bg-green-400 border none text-green-400 rounded-full' width={15} height={15} /> : <Circle className='bg-red-400 border none text-red-400 rounded-full' width={15} height={15} />}

                            <Image src={friend.image?.includes("http") ? friend.image : `/uploads/profiles/${friend.image}`} alt="Friend Zone" width={25} height={25} className='rounded-full' />{friend.name}
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

export default SidebarChatList