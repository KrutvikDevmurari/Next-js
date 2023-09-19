// confirmFriendRequestController.ts
import { NextResponse } from 'next/server';
import { confirmFriendRequest, removeUserFriendRequest } from './usermodel'; // Import necessary function
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const confirmFriendRequestController = async (req: Request) => {
    try {
        const body = await req.json();
        const friendId = body.id; // You may need to define a request body structure
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ message: 'User not Authorized ', success: false }, { status: 404 });

        } else {
            const userID = await session.user.id   
            console.log(userID, friendId, "Iddds") 
            // Confirm the friend request
            const confirm = await confirmFriendRequest(userID, friendId);
            const removerequest = await removeUserFriendRequest(userID, friendId)
            return NextResponse.json({ message: 'Friend request confirmed', success: true }, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Error confirming friend request: ' + error, success: false }, { status: 500 });
    }
};
