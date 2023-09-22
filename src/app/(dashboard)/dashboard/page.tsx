import { getChatMessages, getUserById } from '@/helpers/usermodel'
import { authOptions } from '@/lib/auth'
import { chatHrefConstructor } from '@/lib/utils'
import { ChevronRight } from 'lucide-react'
import { getServerSession } from 'next-auth'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

const page = async ({ }) => {
    const session = await getServerSession(authOptions)
    if (!session) notFound()

    const friends = await getUserById(session.user.id)

    const friendsWithLastMessage = await Promise.all(
        friends.friends.map(async (friend: any) => {
            const friendid = friend.userId
            const ChatId = `${session.user.id}--${friendid}`
            const recentchats: any = await getChatMessages(ChatId)
            const parsedchat = JSON.parse(recentchats).reverse()
            const lastMessage = parsedchat[parsedchat.length - 1]
            const friendsdata = await getUserById(friend.userId)
            console.log(friendsdata, "friendfriend")
            return {
                friendsdata,
                lastMessage,
            }
        })
    )
    return (
        <div className='container py-12'>
            <h1 className='font-bold text-5xl mb-8'>Recent chats</h1>
            {friendsWithLastMessage.length === 0 ? (
                <p className='text-sm text-zinc-500'>Nothing to show here...</p>
            ) : (
                friendsWithLastMessage.map((friend: any) => (
                    <div
                        key={friend.friendsdata._id}
                        className='relative bg-zinc-50 border border-zinc-200 p-3 rounded-md'>
                        <div className='absolute right-4 inset-y-0 flex items-center'>
                            <ChevronRight className='h-7 w-7 text-zinc-400' />
                        </div>
                        <Link
                            href={`/dashboard/chat/${chatHrefConstructor(
                                session.user.id,
                                friend.friendsdata._id
                            )}`}
                            className='relative sm:flex'>
                            <div className='mb-4 flex-shrink-0 sm:mb-0 sm:mr-4'>
                                <div className='relative h-6 w-6'>
                                    <Image
                                        referrerPolicy='no-referrer'
                                        className='rounded-full'
                                        alt={`${friend.friendsdata.name} profile picture`}
                                        src={friend.friendsdata.image}
                                        fill
                                    />
                                </div>
                            </div>

                            <div>
                                <h4 className='text-lg font-semibold'>{friend.friendsdata.name}</h4>
                                <p className='mt-1 max-w-md'>
                                    <span className='text-zinc-400'>
                                        {friend.lastMessage.senderId === session.user.id
                                            ? 'You: '
                                            : ''}
                                    </span>
                                    {friend.lastMessage.text}
                                </p>
                            </div>
                        </Link>
                    </div>
                ))
            )}
        </div>
    )
}

export default page