// addFriendController.ts
import { NextResponse } from 'next/server';
import { addFriendValidator } from '@/lib/validations/add-friend';
import { getUserByEmail, updateUserFriendRequests, removeUserFriendRequest, updateUserStatus } from './usermodel'; // Import necessary functions
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { pusherServer } from '@/lib/pusher';
import { toPusherKey } from '@/lib/utils';

export const addStatusController = async (req: Request) => {
    try {
        const body = await req.json();
        const text = body.text;
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "UnAuthorized" }, { status: 401 });
        }
        if (!text) {
            return NextResponse.json({ message: "please provide status text" }, { status: 422 });
        }
        if (text.length > 100) {
            return NextResponse.json({ message: "Too long!" }, { status: 414 });
        }
        if (session.user.status.length > 0) {
            return NextResponse.json({ message: "You have already uploaded status, Please try after 24 hours." }, { status: 403 });
        }

        const response = await updateUserStatus(session.user.id, text);
        if (response) {
            return NextResponse.json({ message: 'Status added sucessfully', success: true }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Error in adding status', success: false }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Error in adding status: ' + error, success: false }, { status: 500 });
    }
};
