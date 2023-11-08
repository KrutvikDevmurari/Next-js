import { NextResponse } from "next/server"
import { userOnlineController } from "@/helpers/userOnlineController"
export async function POST(req: Request) {
    try {
        const response = await userOnlineController(req);
        return response;
    }
    catch (error) {
        return NextResponse.json({ error: error, success: false });
    }
}