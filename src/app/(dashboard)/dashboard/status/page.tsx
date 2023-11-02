import UploadStatusButton from '@/components/UI/UploadStatusButton';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { FC } from 'react'

const Page: FC = async () => {
    const session = await getServerSession(authOptions)

    return (
        <main className='pt-8'>
            <h1 className='font-bold text-5xl mb-8 pl-4'>Upload a Status</h1>
            <UploadStatusButton />
        </main>
    )
}
export default Page