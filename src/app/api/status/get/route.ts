import { getStatusController } from "@/helpers/getStatusController";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    try {
        const response = await getStatusController(req);
        return response;

    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: err }, { status: 500 });
    }
}
