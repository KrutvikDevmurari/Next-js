import { NextResponse } from 'next/server';
import { getGroupById, getUserById } from './usermodel';
import User from '../models/user';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export const LeaveGroupController = async (req: Request) => {
    try {
        const session = await getServerSession(authOptions)
        const body: any = await req.json()
        const id = body.id
        const groupId = body.groupId

        const query = {
            _id: id,
        };

        const update = {
            $pull: {
                group: { _id: groupId }, // Specify the group to remove by its ID
            },
        };

        if (!id) {
            return NextResponse.json({ message: 'Please Provide id', success: false }, { status: 400 });
        }
        if (!groupId) {
            return NextResponse.json({ message: 'Please Provide id', success: false }, { status: 400 });
        }
        const groupInfo = await getGroupById(groupId, session)
        if (!groupInfo) {
            return NextResponse.json({ message: 'You are not allowed to access this group', success: false }, { status: 400 });
        }

        const update2 = {
            $pull: {
                'group.$[group].users': { id: id },
            },
        };
        const arrayFilters = [
            { 'group._id': groupId },
        ];

        const query2 = {
            _id: { $in: groupInfo.users.map((user: any) => user.id) },
        };


        const result = await User.updateOne(query, update);
        const result2 = await User.updateMany(query2, update2, { arrayFilters });

        if (result && result2) {
            return NextResponse.json({ message: 'User removed sucessfully', success: true }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Something went wrong ', success: false }, { status: 500 });
        }
        // NextResponse.json({ message: 'User removed sucessfully', success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Something went wrong ' + error, success: false }, { status: 500 });
    }
};
