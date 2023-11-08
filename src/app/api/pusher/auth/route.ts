import { authOptions } from "@/lib/auth";
import { pusherServer } from "@/lib/pusher";
import { getServerSession } from "next-auth";
import { NextResponse, NextRequest } from "next/server";

// const allowlist = ['http://localhost:3000/', 'https://example2.com']; // Define your allowed origins here

export async function POST(req: NextRequest, res: any) {
    try {
        const body = await req.formData();
        const socketId = body.get('socket_id');
        const channelName = body.get('channel_name')?.toString();
        const session: any = await getServerSession(authOptions);
        const user = {
            id: session.user.id.toString(),
            user_info: {
                name: session.user.name,
            },
            watchlist: ['another_id_1', 'another_id_2']
        };
        const userData = {
            user_id: session.user.id.toString(),
            user_info: {
                name: session.user.name,
            },
            watchlist: []
        };
        const authResponse = pusherServer.authenticateUser(socketId as string, user);
        const authChannel = pusherServer.authorizeChannel(socketId as string, channelName as string, userData);


        // Set CORS headers
        // res.setHeader('Access-Control-Allow-Origin', req.headers.origin || ''); // Allow the requesting origin
        // res.setHeader('Access-Control-Allow-Methods', 'POST'); // Allow only the POST method
        // res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow the Content-Type header
        // res.setHeader('Access-Control-Allow-Credentials', 'true'); // Allow credentials (cookies, headers)

        return NextResponse.json(authChannel)
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
