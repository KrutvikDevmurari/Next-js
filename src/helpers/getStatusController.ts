// addFriendController.ts
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';

export const getStatusController = async (req: Request) => {
    try {
        const session = await getServerSession(authOptions);


        if (!session) {
            return NextResponse.json({ message: "UnAuthorized" }, { status: 401 });
        }
        if (!session.user.status) {
            return NextResponse.json({ message: "No status found!" }, { status: 403 });
        }
        if (session.user.status.length === 0) {
            return NextResponse.json({ message: "No status found!" }, { status: 403 });
        }
        return NextResponse.json({ data: session.user.status }, { status: 200 });

    } catch (error) {
        return NextResponse.json({ message: 'Error in getting status: ' + error, success: false }, { status: 500 });
    }
};
