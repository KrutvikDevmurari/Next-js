import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { getGroupById, getUserById, updateUserGroup } from './usermodel';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';

export const UpdateGrouptController = async (req: Request) => {
    try {
        const session: any = await getServerSession(authOptions);
        const uploadDir = path.join(process.cwd(), 'public/uploads/group');
        const body = await req.formData();
        const groupName = body.get('groupName');
        const finalUser = body.getAll('selectedUsers');
        const file: any = body.get('groupImage');
        const createdBy = body.get('createdBy');
        const groupId = body.get('groupId');
        const groupInfo = await getGroupById(groupId, session)
        console.log(groupInfo, "groupInfo")
        if (!session) {
            return NextResponse.json({ error: "Please login to create group" }, { status: 404 });
        }
        if (!groupId) {
            return NextResponse.json({ error: "Group does not exist!" }, { status: 400 });
        }

        if (!groupName) {
            return NextResponse.json({ error: { message: "Group name does not exist" } }, { status: 400 });
        }
        if (!file) {
            return NextResponse.json({ error: { message: "Group image does not exist" } }, { status: 400 });
        }
        if (finalUser.length === 0) {
            return NextResponse.json({ error: { message: "Can't create a group without friends" } }, { status: 400 });
        }

        const originalFileName = (file && file.name) ? (uuidv4() + file.name) : file;  // Generate a unique filename if a file is provided
        const filePath = path.join(uploadDir, originalFileName);

        if (file && file.name) {
            if (!file.name.includes("http")) {
                if (file.type.includes("jpg") || file.type.includes("png")) {
                    const fileBuffer = await file.arrayBuffer();
                    const fileData = Buffer.from(fileBuffer);
                    await fs.writeFile(filePath, fileData);
                    if (groupInfo.groupImage) {
                        const oldFilePath = path.join(uploadDir, groupInfo.groupImage);
                        await fs.unlink(oldFilePath);
                    }
                } else {
                    return NextResponse.json({ message: 'Please provide a valid image here', success: false }, { status: 422 });
                }
            }
        }
        const groupUpdated = await updateUserGroup(session.user.id, groupName, originalFileName, finalUser, createdBy, groupId);
        if (groupUpdated) {
            return NextResponse.json({ message: 'Group Updated Successfully', success: true }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Something went wrong', success: false }, { status: 500 });
        }

    } catch (error) {
        return NextResponse.json({ message: 'Something went wrong ' + error, success: false }, { status: 500 });
    }
};
