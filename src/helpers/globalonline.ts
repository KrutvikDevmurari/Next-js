import { pusherClient } from "@/lib/pusher";

export const UserOnline = () => {
    let keys: any = []
    const channel: any = pusherClient.subscribe(`presence-users-online`);
    channel.bind("pusher:subscription_succeeded", (members: any) => {
        var me = channel.members.me;
        var userId = me.id;
        var userInfo = me.info;
    });

    const intervalId = setInterval(() => {
        channel.bind("client-userOnline", (res: any) => {
            const key = Object.keys(channel.members.members);
            keys = key // Update the state with the keys
        });
        channel.trigger("client-userOnline", {
            user: true,
        });

    }, 20000);
    console.log(keys, "keysssss")
    return keys
}


export const UserOffline = () => {
    let keys: any = []
    const channel: any = pusherClient.subscribe(`presence-users-online`);
    channel.bind("pusher:subscription_succeeded", (members: any) => {
        var me = channel.members.me;
        var userId = me.id;
        var userInfo = me.info;
    });

    channel.unbind("client-userOnline", (res: any) => {
        const key = Object.keys(channel.members.members);
        keys = key
    });
    return keys
}