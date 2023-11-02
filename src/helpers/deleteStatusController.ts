// addFriendController.ts
import { NextResponse } from 'next/server';
import { deleteUserStatus } from './usermodel'; // Import necessary functions
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export const deleteStatusController = async (req: Request) => {
    try {
        const session = await getServerSession(authOptions);
        const id = session && session.user.status[0]._id;

        if (!session) {
            return NextResponse.json({ message: "UnAuthorized" }, { status: 401 });
        }
        if (!session.user.status) {
            return NextResponse.json({ message: "No status found!" }, { status: 403 });
        }
        if (session.user.status.length === 0) {
            return NextResponse.json({ message: "No status found!" }, { status: 403 });
        }

        const response = await deleteUserStatus(session.user.id, id);
        if (response) {
            return NextResponse.json(response, { status: 200 });
        } else {
            return NextResponse.json(response, { status: 500 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'Error in deleting status: ' + error, success: false }, { status: 500 });
    }
};
