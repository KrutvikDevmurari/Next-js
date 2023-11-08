import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { addUserGroup, getUserById } from './usermodel';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';

export const CreateGrouptController = async (req: Request) => {
    try {
        const session: any = await getServerSession(authOptions);
        const uploadDir = path.join(process.cwd(), 'public/uploads/group');
        const body = await req.formData();
        const groupName = body.get('groupName');
        const finalUser = body.getAll('selectedUsers');
        const file: any = body.get('groupImage');
        const createdBy = session.user.id;

        if (!session) {
            return NextResponse.json({ error: "Please Login to Create Group" }, { status: 404 });
        }

        if (!groupName) {
            return NextResponse.json({ error: { message: "Group Name does not exist" } }, { status: 400 });
        }
        if (!file) {
            return NextResponse.json({ error: { message: "Group Image does not exist" } }, { status: 400 });
        }
        if (finalUser.length === 0) {
            return NextResponse.json({ error: { message: "Can't create a group without friends" } }, { status: 400 });
        }

        const originalFileName = uuidv4() + (file ? file.name : '');
        const filePath = path.join(uploadDir, originalFileName);

        if (file && file.name) {
            if (!file.name.includes("http")) {
                if (file.type.includes("jpeg") || file.type.includes("png")) {
                    const fileBuffer = await file.arrayBuffer();
                    const fileData = Buffer.from(fileBuffer);
                    await fs.writeFile(filePath, fileData);

                    // Attempt to add the group
                    const GroupCreated = await addUserGroup(session.user.id, groupName, originalFileName, finalUser, createdBy);

                    return NextResponse.json({ message: 'Group Created Successfully', data: { body }, success: true }, { status: 200 });
                } else {
                    return NextResponse.json({ message: 'Please provide a valid image here', success: false }, { status: 422 });
                }
            }
        }

        return NextResponse.json({ message: 'Group Created Successfully', data: { body }, success: true }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error adding friend: ' + error, success: false }, { status: 500 });
    }
};
