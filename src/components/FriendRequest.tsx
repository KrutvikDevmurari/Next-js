'use client'

// import { pusherClient } from '@/lib/pusher'
// import { toPusherKey } from '@/lib/utils'
import axios from 'axios'
import { Check, UserPlus, X } from 'lucide-react'
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

    // useEffect(() => {
    //     pusherClient.subscribe(
    //         toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    //     )

    //     const friendRequestHandler = ({
    //         id,
    //         email,
    //     }: IncomingFriendRequest) => {
    //         setFriendRequests((prev) => [...prev, { id, email }])
    //     }

    //     pusherClient.bind('incoming_friend_requests', friendRequestHandler)

    //     return () => {
    //         pusherClient.unsubscribe(
    //             toPusherKey(`user:${sessionId}:incoming_friend_requests`)
    //         )
    //         pusherClient.unbind('incoming_friend_requests', friendRequestHandler)
    //     }
    // }, [sessionId])

    const acceptFriend = async (senderId: string) => {
        await axios.post('/api/friends/confirm', { id: senderId })

        setFriendRequests((prev) =>
            prev.filter((request) => request.id !== senderId)
        )
        router.refresh()
    }

    const denyFriend = async (senderId: string) => {
        await axios.post('/api/friends/delete', { id: senderId })
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
                friendRequests.map((request) => (
                    <div key={request.id} className='flex gap-4 items-center'>
                        <UserPlus className='text-black' />
                        <p className='font-medium text-lg'>{request.email}</p>
                        <button
                            onClick={() => acceptFriend(request.id)}
                            aria-label='accept friend'
                            className='w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-items-center rounded-full transition hover:shadow-md'>
                            <Check className='font-semibold text-white w-3/4 h-3/4' />
                        </button>

                        <button
                            onClick={() => denyFriend(request.id)}
                            aria-label='deny friend'
                            className='w-8 h-8 bg-red-600 hover:bg-red-700 grid place-items-center rounded-full transition hover:shadow-md'>
                            <X className='font-semibold text-white w-3/4 h-3/4' />
                        </button>
                    </div>
                ))
            )}
        </>
    )
}

export default FriendRequests