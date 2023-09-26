import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { getChatMessages, getSomeUserById } from '@/helpers/usermodel'
import ChatMain from '@/components/UI/ChatMain'
import { pusherServer } from '@/lib/pusher'
import { toPusherKey } from '@/lib/utils'


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

}

interface PageProps {
    params: {
        chatId: string
    }
}


const page = async ({ params }: PageProps) => {
    const { chatId } = params
    const session = await getServerSession(authOptions)
    if (!session) notFound()

    const { user } = session

    const [userId1, userId2] = JSON.parse(JSON.stringify(chatId.split('--')))
    if (user.id.toString() !== userId1.toString() && user.id.toString() !== userId2.toString()) {
        notFound()
    }

    const chatPartnerId = user.id.toString() === userId1.toString() ? userId2.toString() : userId1.toString()
    // new

    const chatPartners = (await getSomeUserById(chatPartnerId))
    const chatPartner = JSON.parse(JSON.stringify(chatPartners))
    const initialMessage = await getChatMessages(chatId)
    const initialMessages = initialMessage && JSON.parse(initialMessage ?? "")


    return (
        <ChatMain chatId={chatId} chatPartner={chatPartner} initialMessages={initialMessages} session={JSON.parse(JSON.stringify(session))} />
    )
}

export default page