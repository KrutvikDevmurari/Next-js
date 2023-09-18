import { NextResponse } from "next/server"
import { deleteFriendRequestController } from "@/helpers/deleteFriendController";
export async function POST(req: Request) {
    try {
        const response = await deleteFriendRequestController(req);
        return response;
    }
    catch (error) {
        return NextResponse.json({ error: error, success: false });
    }
}