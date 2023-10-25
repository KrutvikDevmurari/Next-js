import { NextResponse } from "next/server"
import { UnFriendController } from "@/helpers/UnFriendController";
export async function POST(req: Request) {
    try {
        const response = await UnFriendController(req);
        return response;
    }
    catch (error) {
        return NextResponse.json({ error: error, success: false });
    }
}