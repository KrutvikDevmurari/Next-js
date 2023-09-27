
import React from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import UserProfile from '@/components/UserProfile';

interface FormData {
    image: File | null;
    name: string;
    email: string;
}

const Page: React.FC = async () => {
    const session = await getServerSession(authOptions)

    return (
        <UserProfile session={JSON.parse(JSON.stringify(session))} />
    );
}

export default Page;
