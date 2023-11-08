import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
export const config = {
    api: {
        bodyParser: false,
    },
};

export const userController = async (req: any) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: 'Unauthorized User', success: false }, { status: 401 });
        }
        return NextResponse.json({ data: session, success: true }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error updating user: ' + error.message, success: false }, { status: 500 });
    }
};
