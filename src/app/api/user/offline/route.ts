import { NextResponse } from "next/server"
import { userOfflineController } from "@/helpers/userOfflineController"
export async function POST(req: Request) {
    try {
        const response = await userOfflineController(req);
        return response;
    }
    catch (error) {
        return NextResponse.json({ error: error, success: false });
    }
}