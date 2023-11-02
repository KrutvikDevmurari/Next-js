import { addStatusController } from "@/helpers/addStatusController";
import { NextResponse } from "next/server";


export async function POST(req: Request) {
    try {
        const response = await addStatusController(req);
        return response;

    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: err }, { status: 500 });
    }
}
