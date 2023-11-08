import { NextResponse } from "next/server"
import { userController } from "@/helpers/userController"
export async function GET(req: Request) {
    try {
        const response = await userController(req);
        return response;
    }
    catch (error) {
        return NextResponse.json({ error: error, success: false });
    }
}