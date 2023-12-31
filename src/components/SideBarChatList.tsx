'use client'

import { pusherClient } from '@/lib/pusher'
import { chatHrefConstructor, toPusherKey } from '@/lib/utils'
import { usePathname, useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import UnseenChatToast from './UnseenChatToast'
import { Circle, Loader2, UserMinus } from 'lucide-react'
import { signIn, signOut } from 'next-auth/react'
import axios from 'axios'
import { StatusPreviewModal } from './StatusPreviewModal'
import Link from 'next/link'

interface SidebarChatListProps {
    friends: any[] | null
    sessionId: string,
}

interface ExtendedMessage extends Message {
    senderImg: string
    senderName: string,
    chatId: string
}

const SidebarChatList: FC<SidebarChatListProps> = ({ friends, sessionId }) => {
    const router = useRouter()
    const pathname = usePathname()
    const [unseenMessages, setUnseenMessages] = useState<Message[]>([])
    const [activeChats, setActiveChats] = useState<any>(friends)
    const [userKeys, setUserKeys] = useState<any>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const watchlistEventHandler = (event: any) => {
        console.log(event, "ereveraer")
        // event.user_ids
        // event.name
    };
    useEffect(() => {
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:chats`))
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:friends`))
        pusherClient.subscribe(toPusherKey(`user:${sessionId}:unfriend`))
        pusherClient.user.watchlist.bind('online', watchlistEventHandler);
        pusherClient.user.watchlist.bind('offline', watchlistEventHandler);
        pusherClient.subscribe(
            toPusherKey(`user:${sessionId}:confirm_friend_requests`)
        )
        const newFriendHandler = async (newFriend: any) => {
            if (sessionId !== newFriend.FriendData?._id) {
                setActiveChats((prev: any) => [...prev, newFriend.FriendData])
            } else {
                setActiveChats((prev: any) => [...prev, newFriend.currentuserData])
                axios.get('/api/friends/get/friends').then(res => {
                    setActiveChats(res.data.data.friends)
                })


            }
        }
        const unFriendHandler = (newFriend: User) => {
            setActiveChats((prev: any) => [...prev, newFriend])
            axios.get('/api/friends/get/friends').then(res => {
                setActiveChats(res.data.data.friends)
            })
        }

        const chatHandler = (message: ExtendedMessage) => {
            const [userId1, userId2] = JSON.parse(JSON.stringify(message.chatId.split('--')));
            const chatPartnerId = sessionId === userId1 ? userId2 : userId1;
            const chatHref = chatHrefConstructor(sessionId, message.senderId);
            const shouldNotify = pathname !== `/dashboard/chat/${chatHref}`;

            if (shouldNotify && friends?.some((friend) => friend._id === chatPartnerId)) {
                // Notify the user if the chat is not open and the chat partner is not a friend
                toast.custom((t) => (
                    <UnseenChatToast
                        t={t}
                        sessionId={sessionId}
                        senderId={message.senderId}
                        senderImg={message.senderImg}
                        senderMessage={message.text}
                        senderName={message.senderName}
                    />
                ));

                // Add the message to unseenMessages
                setUnseenMessages((prev) => [...prev, message]);
            }
        };
        pusherClient.bind('new_message', chatHandler)
        pusherClient.bind('new_friend', newFriendHandler)
        pusherClient.bind('un_friend', unFriendHandler)
        pusherClient.bind('confirm_friend_requests', newFriendHandler)

        // return () => {
        //     pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:chats`))
        //     pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))

        //     pusherClient.unbind('new_message', chatHandler)
        //     pusherClient.unbind('new_friend', newFriendHandler)
        //     pusherClient.unbind('un_friend', unFriendHandler)
        //     pusherClient.unbind('confirm_friend_requests', newFriendHandler)
        // }
    }, [signIn, signOut])

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
    const UnFriendHandler = async (senderId: any) => {
        setIsLoading(true)
        !isLoading && await axios.post('/api/friends/unfriend', { id: senderId, cache: 'no-store' }).then(res => {
            setIsLoading(false)
            router.push('/dashboard/add')
            setActiveChats((prev: any) => prev.filter((res: any) => res._id !== senderId));
        })
    }
    const handleStatusDisplay = (seenData: any) => {
        openModal()
        // if (seenData.includes(sessionId)) {
        //     return;
        // }
    }

    return (
        <ul role='list' className='max-h-[25rem] overflow-y-auto -mx-2 space-y-1'>
            {activeChats && activeChats.sort().map((friend: any) => {
                const unseenMessagesCount = unseenMessages.filter((unseenMsg) => {
                    return unseenMsg.senderId === friend._id
                }).length
                return (
                    <>
                        {friend !== null ? <li key={friend._id}>
                            <div
                                className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold justify-between cursor-pointer'>
                                <Link className='group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold' href={`/dashboard/chat/${chatHrefConstructor(
                                    sessionId,
                                    friend?._id
                                )}`}>
                                    {userKeys.includes(friend?._id) ? <Circle className='bg-green-400 border none text-white rounded-full' width={15} height={15} /> : <Circle className='bg-white-400 border none text-white rounded-full' width={15} height={15} />}
                                    <Image src={friend?.image?.includes("http") ? friend?.image : `/uploads/profiles/${friend?.image}`} alt="Friend Zone" width={25} height={25} className={'rounded-full ' + (friend.status.length > 0 ? "border-2 border-green-400" : "")} onClick={() => { friend.status.length > 0 && handleStatusDisplay(friend.status[0].seen) }} />{friend.name}
                                    {unseenMessagesCount > 0 ? (
                                        <div className='bg-indigo-600 font-medium text-xs text-white w-4 h-4 rounded-full flex justify-center items-center'>
                                            {unseenMessagesCount}
                                        </div>
                                    ) : null}
                                </Link>
                                {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> : <UserMinus className='invisible group-hover:visible' width={15} height={15} onClick={() => UnFriendHandler(friend._id)} />}

                            </div>
                        </li > : null}
                        {modalIsOpen && (
                            friend?.status.length > 0 && <StatusPreviewModal onClose={closeModal} text={friend?.status.length > 0 ? friend?.status[0].text : null} timestamp={friend?.status.length > 0 ? friend?.status[0].timestamp : null} />)}
                    </>
                )
            })}
        </ul >
    )
}

export default SidebarChatList