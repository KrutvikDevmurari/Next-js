import FriendRequests from '@/components/UI/FriendRequest'
import { getUserById } from '@/helpers/usermodel'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { FC } from 'react'

const page = async () => {
    const session = await getServerSession(authOptions)
    if (!session) notFound()

    // ids of people who sent current logged in user a friend requests
    const incomingSenderIds = session.user.requests as string[]

    const incomingFriendRequests = await Promise.all(
        incomingSenderIds.map(async (senderId: any) => {
            const userID: string = senderId.userId
            const sender: any = getUserById(userID)

            return {
                senderId,
                senderEmail: sender.email,
            }
        })
    )

    return (
        <main className='pt-8'>
            <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
            <div className='flex flex-col gap-4'>
                <FriendRequests
                    incomingFriendRequests={incomingFriendRequests}
                    sessionId={session.user.id}
                />
            </div>
        </main>
    )
}

export default page