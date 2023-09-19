import FriendRequests from '@/components/UI/FriendRequest'
import { getUserById } from '@/helpers/usermodel'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'

const page = async () => {
    const session = await getServerSession(authOptions)
    if (!session) notFound()
    const friendRequests: IncomingFriendRequest[] = []
    // ids of people who sent current logged in user a friend requests
    const incomingSenderIds = session.user.requests as any[]
    // const incomingFriendRequests: any[] = await incomingSenderIds.map(async (senderId: any) => {
    //     const userID: string = senderId.userId;
    //     // const sender: any = await getUserById(userID) as User
    //     friendRequests.push({
    //         id: senderId,
    //         email: "sender?.email",
    //     })
    // })
    incomingSenderIds.map(async (res) => {
        const senderId = res?.userId
        const sender: any = await getUserById(senderId) as User
        friendRequests.push({
            id: senderId,
            email: sender?.email,
        })
    })
    console.log(incomingSenderIds, "incomingSenderIds")
    return (
        <main className='pt-8'>
            <h1 className='font-bold text-5xl mb-8'>Add a friend</h1>
            <div className='flex flex-col gap-4'>
                <FriendRequests
                    incomingFriendRequests={friendRequests}
                    userId={session.user.id}
                />
            </div>
        </main>
    )
}

export default page