// addFriendController.ts
import { NextResponse } from 'next/server';
import { addFriendValidator } from '@/lib/validations/add-friend';
import { getUserByEmail, updateUserFriendRequests, removeUserFriendRequest, addUserFriend } from './usermodel'; // Import necessary functions
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export const addFriendController = async (req: Request) => {
    try {
        const body = await req.json();
        const { email: emailToAdd } = addFriendValidator.parse(body);
        const session = await getServerSession(authOptions);
        const user = await getUserByEmail(emailToAdd);

        // Check if the user exists
        if (!user) {
            return NextResponse.json({ message: 'User does not exist!', success: false }, { status: 400 });
        }

        // Check if the user is authenticated
        if (!session) {
            return NextResponse.json({ message: 'Unauthorized User', success: false }, { status: 401 });
        }

        // Check if trying to add oneself as a friend
        if (user._id.toString() === session.user.id.toString()) {
            return NextResponse.json({ message: 'You cannot add yourself as a friend', success: false }, { status: 400 });
        }

        // Check if a friend request already exists
        const existingRequest = session.user.friends.find((request: { userId: string }) => request.userId === user._id);

        if (existingRequest) {
            if (existingRequest.userApproved) {
                await removeUserFriendRequest(session.user.id, user._id);
                return NextResponse.json({ message: 'Your are already friends', success: true }, { status: 200 });

            } else {
                return NextResponse.json({ message: 'Friend request already sent', success: false }, { status: 400 });
            }
        }

        // Send a friend request
        await updateUserFriendRequests(user._id, session.user.id);

        return NextResponse.json({ message: 'Friend request sent', success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error adding friend: ' + error, success: false }, { status: 500 });
    }
};
