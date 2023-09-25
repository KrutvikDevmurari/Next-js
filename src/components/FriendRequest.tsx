'use client'

import { pusherClient } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'
import axios from 'axios'
import { Check, Loader2, UserPlus, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { FC, useEffect, useState } from 'react'

interface FriendRequestsProps {
    incomingFriendRequests: IncomingFriendRequest[]
    userId: string
}

const FriendRequests: FC<FriendRequestsProps> = ({
    incomingFriendRequests,
    userId,
}) => {
    const router = useRouter()
    const [friendRequests, setFriendRequests] = useState<IncomingFriendRequest[]>(
        incomingFriendRequests
    )
    const [isLoading, setIsLoading] = useState<boolean>(false)
    console.log("incomingFriendRequests => ", incomingFriendRequests);
    useEffect(() => {
        pusherClient.subscribe(
            toPusherKey(`user:${userId}:incoming_friend_requests`)
        )
        const friendRequestHandler = ({
            id,
            email,
        }: IncomingFriendRequest) => {
            setFriendRequests((prev) => [...prev, { id, email }])
        }

        pusherClient.bind('incoming_friend_requests', friendRequestHandler)

        return () => {
            pusherClient.unsubscribe(
                toPusherKey(`user:${userId}:incoming_friend_requests`)
            )
            pusherClient.unbind('incoming_friend_requests', friendRequestHandler)
        }
    }, [userId])

    const acceptFriend = async (senderId: string) => {
        setFriendRequests((prev) =>
            prev.filter((request) => request.id !== senderId)
        )
        setIsLoading(true)
        !isLoading && await axios.post('/api/friends/confirm', { id: senderId }).then(res => {
            setIsLoading(false)
            window.location.reload()
        })

        router.refresh()
    }

    const denyFriend = async (senderId: string) => {
        setIsLoading(true)
        console.log(senderId, "senderId")
        !isLoading && await axios.post('/api/friends/delete', { id: senderId }).then(res => {
            setIsLoading(false)
            window.location.reload()
        })
        setFriendRequests((prev) =>
            prev.filter((request) => request.id !== senderId)
        )

        router.refresh()
    }
    return (
        <>
            {friendRequests.length === 0 ? (
                <p className='text-sm text-zinc-500'>Nothing to show here...</p>
            ) : (
                friendRequests.map((request: any) => (
                    <div key={request.id} className='flex gap-4 items-center'>
                        <UserPlus className='text-black' />
                        <p className='font-medium text-lg'>{request.email}</p>
                        {isLoading ? <Loader2 className='mr-2 h-4 w-4 animate-spin' /> :
                            <>
                                <button
                                    onClick={() => !isLoading && acceptFriend(request._id)}
                                    aria-label='accept friend'
                                    className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'>
                                    <Check className='font-semibold text-white w-3/4 h-3/4' />
                                </button>

                                <button
                                    onClick={() => !isLoading && denyFriend(request._id)}
                                    aria-label='deny friend'
                                    className='w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'>
                                    <X className='font-semibold text-white w-3/4 h-3/4' />
                                </button>

                            </>}
                    </div >
                ))
            )}
        </>
    )
}

export default FriendRequests