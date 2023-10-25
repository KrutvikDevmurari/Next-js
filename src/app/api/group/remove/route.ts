import { NextResponse } from "next/server"
import { RemoveUserController } from "@/helpers/RemoveUserController"
export async function POST(req: Request) {
    try {
        const response = await RemoveUserController(req);
        return response;
    }
    catch (error) {
        return NextResponse.json({ error: error, success: false });
    }
}