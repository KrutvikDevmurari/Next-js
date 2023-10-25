import { NextResponse } from "next/server"
import { LeaveGroupController } from "@/helpers/LeaveGroupController"
export async function POST(req: Request) {
    try {
        const response = await LeaveGroupController(req);
        return response;
    }
    catch (error) {
        return NextResponse.json({ error: error, success: false });
    }
}