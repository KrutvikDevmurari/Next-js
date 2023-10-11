import CreateGroup from '@/components/UI/createGroup';
import { getSomeUserById, getUserfromSession } from '@/helpers/usermodel';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { FC } from 'react'

const Page: FC = async () => {
    const session = await getServerSession(authOptions)
    const userArray: any = []
    const friend: any = await getUserfromSession(session)
    const friends = JSON.parse(friend)
    return (
        <main className='pt-8'>
            <h1 className='font-bold text-5xl mb-8 pl-4'>Create a Group with your Friends</h1>
            <CreateGroup friends={friends} />
        </main>
    )
}
export default Page