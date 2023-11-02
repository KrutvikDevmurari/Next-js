import { deleteStatusController } from "@/helpers/deleteStatusController";
import { NextResponse } from "next/server";


export async function DELETE(req: Request) {
    try {
        const response = await deleteStatusController(req);
        return response;

    } catch (err) {
        console.log(err);
        return NextResponse.json({ error: err }, { status: 500 });
    }
}
