import { NextResponse } from "next/server"
import { UpdateGrouptController } from "@/helpers/UpdateGrouptController"
export async function POST(req: Request) {
    try {
        const response = await UpdateGrouptController(req);
        return response;
    }
    catch (error) {
        return NextResponse.json({ error: error, success: false });
    }
}