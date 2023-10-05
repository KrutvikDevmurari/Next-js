import { NextResponse } from "next/server"
import { userUpdateController } from "@/helpers/userUpdateController"
export async function POST(req: Request) {
    try {
        const response = await userUpdateController(req);
        return response;
    }
    catch (error) {
        return NextResponse.json({ error: error, success: false });
    }
}