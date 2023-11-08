// confirmFriendRequestController.ts
import { NextResponse } from 'next/server';
import { getUserById } from './usermodel'; // Import necessary function
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const getFriendController = async (req: Request) => {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'User not Authorized ', success: false }, { status: 404 });

        } else {
            const friendId = session.user.friends as any[]
            const friends = await Promise.all(friendId.map(async (res) => {
                const senderId = res?.userId;
                const sender: any = await getUserById(senderId) as User;
                return sender
            }));

            return NextResponse.json({ data: { friends }, success: true }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Something went wrong' + error, success: false }, { status: 500 });
    }
};
