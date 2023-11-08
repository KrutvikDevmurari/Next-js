import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import User from '@/models/user';

export const config = {
    api: {
        bodyParser: false,
    },
};

export const userOfflineController = async (req: any) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: 'Unauthorized User', success: false }, { status: 401 });
        }
        const _id = await session.user.id;
        const isOnline = false;
        await User.findByIdAndUpdate(_id, { isOnline });
        return NextResponse.json({ message: 'User Updated Successfully', success: true }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error updating user: ' + error.message, success: false }, { status: 500 });
    }
};
