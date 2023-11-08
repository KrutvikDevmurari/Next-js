import { NextResponse } from "next/server"
import { getFriendController } from "@/helpers/getFriendController";
export async function GET(req: Request) {
    try {
        const response = await getFriendController(req);
        return response;
    }
    catch (error) {
        return NextResponse.json({ error: error, success: false });
    }
}