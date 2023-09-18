import { NextResponse } from "next/server"
import { confirmFriendRequestController } from "@/helpers/confirmFriendController";
export async function POST(req: Request) {
    try {
        const response = await confirmFriendRequestController(req);
        return response;
    }
    catch (error) {
        return NextResponse.json({ error: error, success: false });
    }
}