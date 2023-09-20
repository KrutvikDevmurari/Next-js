import ChatInput from '@/components/ChatInput'
import Messages from '@/components/Messages'
// import { fetchRedis } from '@/helpers/redis'
import { authOptions } from '@/lib/auth'
import { messageArrayValidator } from '@/lib/validations/message'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import Message from '@/models/message'
import Image from 'next/image'
import { getSomeUserById } from '@/helpers/usermodel'

// The following generateMetadata functiion was written after the video and is purely optional
export async function generateMetadata({
    params,
}: {
    params: { chatId: string }
}) {
    const session = await getServerSession(authOptions)
    if (!session) notFound()
    const [userId1, userId2] = params.chatId.split('--')
    const { user } = session

    const chatPartnerId = user.id === userId1 ? userId2 : userId1
    // const chatPartnerRaw = (await fetchRedis(
    //     'get',
    //     `user:${chatPartnerId}`
    // )) as string
    // const chatPartner = JSON.parse(chatPartnerRaw) as User

    // return { title: `FriendZone | ${chatPartner.name} chat` }
}

interface PageProps {
    params: {
        chatId: string
    }
}

async function getChatMessages(chatId: string) {
    try {
        const results: string[] = await Message.find({ chatId })

        const dbMessages = results.map((message) => JSON.parse(message) as Message)

        const reversedDbMessages = dbMessages.reverse()

        const messages = messageArrayValidator.parse(reversedDbMessages)
        console.log(Message, "messages")
        return messages
    } catch (error) {
        notFound()
    }
}

const page = async ({ params }: PageProps) => {
    const { chatId } = params
    const session = await getServerSession(authOptions)
    if (!session) notFound()

    const { user } = session

    const [userId1, userId2] = chatId.split('--')
    if (user.id.toString() !== userId1.toString() && user.id.toString() !== userId2.toString()) {
        notFound()
    }

    console.log(user.name, "user.id")
    const chatPartnerId = user.id.toString() === userId1.toString() ? userId2.toString() : userId1.toString()
    // new

    const chatPartner = (await getSomeUserById(chatPartnerId))
    const initialMessages = await getChatMessages(chatId)
    console.log(chatPartner, "chatPartner", chatId, "chatId", session.user.image, "session.user.image", session.user.id, "session.user.id", initialMessages, "initialMessages")
    return (
        <div className='flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]'>
            <div className='flex sm:items-center justify-between py-3 border-b-2 border-gray-200'>
                <div className='relative flex items-center space-x-4'>
                    <div className='relative'>
                        <div className='relative w-8 sm:w-12 h-8 sm:h-12'>
                            <Image
                                fill
                                referrerPolicy='no-referrer'
                                src={chatPartner.image}
                                alt={`${chatPartner.name} profile picture`}
                                className='rounded-full'
                            />
                        </div>
                    </div>

                    <div className='flex flex-col leading-tight'>
                        <div className='text-xl flex items-center'>
                            <span className='text-gray-700 mr-3 font-semibold'>
                                {chatPartner.name}
                            </span>
                        </div>

                        <span className='text-sm text-gray-600'>{chatPartner.email}</span>
                    </div>
                </div>
            </div>
            <Messages
                chatId={chatId}
                chatPartner={chatPartner}
                sessionImg={session.user.image}
                sessionId={session.user.id}
                initialMessages={initialMessages}
            />
            <ChatInput chatId={chatId} chatPartner={chatPartner} />

        </div>
    )
}

export default page