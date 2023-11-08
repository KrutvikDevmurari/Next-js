'use client'
import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import axios from 'axios'
import { User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'
import { signIn } from 'next-auth/react'

interface FriendRequestSidebarOptionsProps {
    sessionId: string
    initialUnseenRequestCount: number
}

const FriendRequestSidebarOptions: FC<FriendRequestSidebarOptionsProps> = ({
    sessionId,
    initialUnseenRequestCount,
}) => {
    const [unseenRequestCount, setUnseenRequestCount] = useState<number>(
        initialUnseenRequestCount
    )

    const newFriendHandler = (newFriend: User) => {
        setUnseenRequestCount((prev) => prev - 1)
        axios.get('/api/friends/get/requests').then(res => {
            setUnseenRequestCount(res.data.data.friendRequests.length)
        })
    }
    const pathname = usePathname()
    const router = useRouter()
    useEffect(() => {
        pusherClient.subscribe(
            toPusherKey(`user:${sessionId}:incoming_friend_requests`)
        )
        pusherClient.subscribe(
            toPusherKey(`confirm_friend_requests2`)
        )
        pusherClient.subscribe(toPusherKey(`user:friends`))

        const friendRequestHandler = () => {
            setUnseenRequestCount((prev) => prev + 1)
            axios.get('/api/friends/get/requests').then(res => {
                setUnseenRequestCount(res.data.data.friendRequests.length)
            })
        }
        const addedFriendHandler = () => {
            setUnseenRequestCount((prev) => prev - 1)
            axios.get('/api/friends/get/requests').then(res => {
                setUnseenRequestCount(res.data.data.friendRequests.length)
            })
        }

        pusherClient.bind('incoming_friend_requests', friendRequestHandler)
        // pusherClient.bind('new_friend', addedFriendHandler)

        pusherClient.bind('confirm_friend_requests', newFriendHandler)
        return () => {
            pusherClient.unsubscribe(
                toPusherKey(`user:${sessionId}:incoming_friend_requests`)
            )
            pusherClient.unsubscribe(
                toPusherKey(`confirm_friend_requests2`)
            )
            pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:friends`))
            pusherClient.unbind('confirm_friend_requests', newFriendHandler)
            pusherClient.unbind('incoming_friend_requests', friendRequestHandler)
        }
    }, [sessionId, pathname, router, signIn])




    return (
        <Link
            href='/dashboard/requests'
            className='text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold'>
            <div className='text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white'>
                <User className='h-4 w-4' />
            </div>
            <p className='truncate'>Friend requests</p>

            {unseenRequestCount > 0 ? (
                <div className='rounded-full w-5 h-5 text-xs flex justify-center items-center text-white bg-indigo-600'>
                    {unseenRequestCount}
                </div>
            ) : null}
        </Link>
    )
}

export default FriendRequestSidebarOptions