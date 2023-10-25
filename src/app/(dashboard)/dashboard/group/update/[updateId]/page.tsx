import CreateGroup from '@/components/UI/createGroup';
import { getGroupById, getUserfromSession } from '@/helpers/usermodel';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { FC } from 'react'
import { notFound } from 'next/navigation'


export async function generateMetadata({
    params,
}: {
    params: { updateId: string }
}) {
    const session = await getServerSession(authOptions)
    if (!session) notFound()
}

const Page: FC = async (params: any) => {
    const session = await getServerSession(authOptions)
    if (!session) notFound()

    const friend: any = await getUserfromSession(session)
    const friends = JSON.parse(friend)
    const groupInfo: any = await getGroupById(params.params.updateId, session)
    if (!groupInfo) notFound()
    return (
        <main className='pt-8'>
            <h1 className='font-bold text-2xl md:text-4xl lg:text-5xl m-0 md:mb-6 lg:mb-8 pl-4'>
                Update your Friends Group
            </h1>
            <CreateGroup friends={friends} session={JSON.parse(JSON.stringify(session))} groupInfo={JSON?.parse(JSON.stringify(groupInfo))} />

        </main>
    )
}
export default Page