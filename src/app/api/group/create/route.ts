import { NextResponse } from "next/server"
import { CreateGrouptController } from "@/helpers/CreateGrouptController"
export async function POST(req: Request) {
    try {
        const response = await CreateGrouptController(req);
        return response;
    }
    catch (error) {
        return NextResponse.json({ error: error, success: false });
    }
}