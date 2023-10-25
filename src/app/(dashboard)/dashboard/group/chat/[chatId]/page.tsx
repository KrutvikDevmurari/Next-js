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

    const [userId1, userId2] = JSON.parse(JSON.stringify(chatId.split('--')))


    const chatPartnerId = session.user.friends?.includes(userId2) ? userId1.toString() : userId2.toString()
    const isUserorGroup = session.user.group?.some((res: any) => res._id.toString() === chatPartnerId.toString())
    // new
    const initialMessage = await getChatMessages(chatId)
    const initialMessages = initialMessage && JSON.parse(initialMessage ?? "")
    const groupData = await session.user.group?.find((res: any) => res._id.toString() === chatPartnerId.toString())
    if (!groupData) {
        notFound()
    }
    const finalGroupData = isUserorGroup && await GetGroupData(groupData)
    return (
        <GroupChatMain chatId={chatId} chatPartner={JSON.parse(JSON.stringify(groupData))} chatpartnerDetail={finalGroupData} initialMessages={initialMessages} session={JSON.parse(JSON.stringify(session))} />
    )
}

export default Page