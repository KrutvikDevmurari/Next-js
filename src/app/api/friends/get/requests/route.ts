import { NextResponse } from "next/server"
import { getFriendRequestController } from "@/helpers/getFriendRequestController";
export async function GET(req: Request) {
    try {
        const response = await getFriendRequestController(req);
        return response;
    }
    catch (error) {
        return NextResponse.json({ error: error, success: false });
    }
}