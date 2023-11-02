// addFriendController.ts
import { NextResponse } from 'next/server';
import { seenUserStatus } from './usermodel'; // Import necessary functions
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export const seenStatusController = async (req: Request) => {
    try {
        const body = await req.json();
        const id = body.id;
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: "UnAuthorized" }, { status: 401 });
        }
        if (!session.user.status) {
            return NextResponse.json({ message: "No status found!" }, { status: 403 });
        }

        const response = await seenUserStatus(session.user.id, id);
        if (response) {
            return NextResponse.json({ message: 'Status added sucessfully', success: true }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Error in adding status', success: false }, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Error in adding status: ' + error, success: false }, { status: 500 });
    }
};
