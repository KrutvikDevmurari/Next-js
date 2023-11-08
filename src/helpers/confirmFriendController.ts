// confirmFriendRequestController.ts
import { NextResponse } from 'next/server';
import { confirmFriendRequest, getUserById, getUserfromSession, removeUserFriendRequest } from './usermodel'; // Import necessary function
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
            const alreadyFriends = JSON.parse(friends).some((res: any) => res?._id === friendId)
            if (alreadyFriends) {
                const removerequest = await removeUserFriendRequest(userID, friendId)
                return NextResponse.json({ message: 'Your are already friends...', success: false }, { status: 403 });
            }
            // Confirm the friend request
            const FriendData = {
                FriendData: await getUserById(friendId),
                currentuserData: session.user
            }
            const confirm = await confirmFriendRequest(userID, friendId);
            const removerequest = await removeUserFriendRequest(userID, friendId)
            // const puseherChannel1 = await pusherServer.trigger(
            //   ,
            //     ,
            //    
            // )
            const events = [
                {
                    channel: toPusherKey(`user:${friendId}:confirm_friend_requests`),
                    name: 'confirm_friend_requests',
                    data: FriendData,
                },
                {
                    channel: toPusherKey(`confirm_friend_requests2`),
                    name: 'confirm_friend_requests',
                    data: FriendData,
                },
            ];
            await pusherServer.triggerBatch(events);
            return NextResponse.json({ message: 'Friend request confirmed', success: true }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Error confirming friend request: ' + error, success: false }, { status: 500 });
    }
};
