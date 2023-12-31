import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { GetGroupData, getChatMessages, getSomeUserById } from '@/helpers/usermodel'
import ChatMain from '@/components/UI/ChatMain'
import GroupChatMain from '@/components/UI/GroupChatMain'


export async function generateMetadata({
    params,
}: {
    params: { chatId: string }
}) {
    const session = await getServerSession(authOptions)
    if (!session) notFound()
}

interface PageProps {
    params: {
        chatId: string
    }
}


const Page = async ({ params }: PageProps) => {
    const { chatId } = params
    const session = await getServerSession(authOptions)
    if (!session) notFound()

    const { user } = session
    const [userId1, userId2] = JSON.parse(JSON.stringify(chatId.split('--')))


    const chatPartnerId = session.user.id.toString() === userId1.toString() ? userId2 : userId1
    console.log(chatPartnerId, session.user.id, "chatPartnerId")
    // new
    const chatPartners = (await getSomeUserById(chatPartnerId))
    const chatPartner = JSON.parse(JSON.stringify(chatPartners))
    const initialMessage = await getChatMessages(chatId)
    const initialMessages = initialMessage && JSON.parse(initialMessage ?? "")

    return (
        <ChatMain chatId={chatId} chatPartner={chatPartner} initialMessages={initialMessages} session={JSON.parse(JSON.stringify(session))} />

    )
}

export default Page