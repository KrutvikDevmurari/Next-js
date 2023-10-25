import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import { getServerSession } from 'next-auth';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import User from '@/models/user';

export const config = {
    api: {
        bodyParser: false,
    },
};

export const userUpdateController = async (req: any) => {
    try {
        const uploadDir = path.join(process.cwd(), 'public/uploads/profiles');
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ message: 'Unauthorized User', success: false }, { status: 401 });
        }

        const _id = await session.user.id;
        const data = await req.formData();
        const name = data.get('name');
        const email = data.get('email');
        const file = data.get('image');
        const originalFileName = uuidv4() + (file ? file.name : ''); // Generate a unique filename if a file is provided
        const filePath = path.join(uploadDir, originalFileName);
        if (file && file.name) {
            if (!file.name.includes("http")) {
                if (file.type.includes("jpg") || file.type.includes("png")) {
                    const fileBuffer = await file.arrayBuffer();
                    const fileData = Buffer.from(fileBuffer);
                    await fs.writeFile(filePath, fileData);
                    await User.findByIdAndUpdate(_id, { name, email, image: originalFileName });

                } else {
                    return NextResponse.json({ message: 'Please provide a valid image here', success: false }, { status: 422 });
                }
            }
        }
        await User.findByIdAndUpdate(_id, { name, email });
        // Update user data (name and email)

        return NextResponse.json({ message: 'User Updated Successfully', success: true }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ message: 'Error updating user: ' + error.message, success: false }, { status: 500 });
    }
};
