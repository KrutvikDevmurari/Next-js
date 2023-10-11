// CreatGrouptController.ts
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { addUserGroup, getUserById } from './usermodel';

export const CreateGrouptController = async (req: Request) => {
    try {
        const session: any = getServerSession(authOptions)
        if (!session) {
            return NextResponse.json({ error: "Please Login to Create Group" }, { status: 404 })
        }
        const body = await req.json();
        console.log(body, "body")
        await addUserGroup(session.user.id);

        return NextResponse.json({ message: 'Group Created SucessFully', data: { body }, success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error adding friend: ' + error, success: false }, { status: 500 });
    }
};
