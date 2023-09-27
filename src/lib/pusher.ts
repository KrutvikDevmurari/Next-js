import PusherServer from 'pusher'
import PusherClient from 'pusher-js'
import { getCsrfToken } from "next-auth/react"

console.log("getCsrfToken,", JSON.parse(JSON.stringify(getCsrfToken())))
export const pusherServer = new PusherServer({
    appId: process.env.PUSHER_APP_ID!,
    key: process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    secret: process.env.PUSHER_APP_SECRET!,
    cluster: "ap2",
    useTLS: true,

},)
export const pusherClient = new PusherClient(
    process.env.NEXT_PUBLIC_PUSHER_APP_KEY!,
    {
        cluster: "ap2",
        channelAuthorization: {
            endpoint: "/pusher_auth.php",
            headers: { "X-CSRF-Token": getCsrfToken() },
            transport: "ajax", // Add the required 'transport' property
        },
    },
);