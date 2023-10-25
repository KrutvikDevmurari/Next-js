import { NextResponse } from 'next/server';
import { UnFriend, getUserfromSession } from './usermodel';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { toPusherKey } from '@/lib/utils';
import { pusherServer } from '@/lib/pusher';

export const UnFriendController = async (req: Request) => {
    try {
        const body = await req.json();
        const friendId = body.id;
        console.log("friendId", friendId);
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'User not Authorized ', success: false }, { status: 404 });

        } else {
            const userID = await session.user.id
            const friends: any = await getUserfromSession(session)
            const notAlreadyFriends = JSON.parse(friends).some((res: any) => res.userId?.toString() === friendId.toString())
            if (notAlreadyFriends) {
                return NextResponse.json({ message: 'Your are not  friends...', success: false }, { status: 400 });
            }

            const confirm = await UnFriend(userID, friendId);
            pusherServer.trigger(toPusherKey(`user:unfriend`), friendId, "")
            return NextResponse.json({ message: 'Friend request confirmed', success: true }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Error confirming friend request: ' + error, success: false }, { status: 500 });
    }
};
