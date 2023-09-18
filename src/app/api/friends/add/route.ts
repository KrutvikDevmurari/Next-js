import { NextResponse } from "next/server"
import { addFriendController } from "@/helpers/addFriendController"
export async function POST(req: Request) {
    try {
        const response = await addFriendController(req);
        return response;
    }
    catch (error) {
        return NextResponse.json({ error: error, success: false });
    }
}