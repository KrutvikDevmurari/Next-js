// deleteFriendRequestController.ts
import { NextResponse } from 'next/server';
import { removeUserFriendRequest } from './usermodel'; // Import necessary function
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';

export const deleteFriendRequestController = async (req: Request) => {
    try {
        const body = await req.json();
        const { id } = body; // You may need to define a request body structure
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'User not Authorized ', success: false }, { status: 404 });

        } else {
            const userID = await session.user.id
            const removerequest = await removeUserFriendRequest(userID, id)
            pusherServer.trigger(toPusherKey(`user:${session.user.id}:unfriend`), `new_friend`, "")
            return NextResponse.json({ message: 'Friend request Rejected', success: true }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Error deleting friend request: ' + error, success: false }, { status: 500 });
    }
};
