// confirmFriendRequestController.ts
import { NextResponse } from 'next/server';
import { confirmFriendRequest, getUserfromSession, removeUserFriendRequest } from './usermodel'; // Import necessary function
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';

export const confirmFriendRequestController = async (req: Request) => {
    try {
        const body = await req.json();
        const friendId = body.id; // You may need to define a request body structure
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'User not Authorized ', success: false }, { status: 404 });

        } else {
            const userID = await session.user.id
            const friends: any = await getUserfromSession(session)
            console.log(JSON.parse(friends), "friendssss")
            const alreadyFriends = JSON.parse(friends).some((res: any) => res.userID === friendId)
            if (alreadyFriends) {
                return NextResponse.json({ message: 'Your are already friends...', success: false }, { status: 400 });
            }
            console.log(alreadyFriends, "alreadyFriends")
            // Confirm the friend request
            const confirm = await confirmFriendRequest(userID, friendId);
            const removerequest = await removeUserFriendRequest(userID, friendId)
            pusherServer.trigger(toPusherKey(`user:${session.user.id}:friends`), `new_friend`, "")
            return NextResponse.json({ message: 'Friend request confirmed', success: true }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Error confirming friend request: ' + error, success: false }, { status: 500 });
    }
};
