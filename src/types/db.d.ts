
interface User {
    name: string
    email: string
    image: string
    id: string
    [friends: string]: { id: string },
    [group: string]: {
        groupname: string,
        groupImage: string,
        [users]: { id: string }
        createdBy: string,
    }
    [status: any[]]: {
        [seen: any[]]: {
            id: string,
            seentimestamp: number
        }
        text: string,
        timestamp: number,
    },
    [requests: string]: { id: string, userApproved: boolean }
}


interface FriendRequest {
    id: string
    senderId: string
    receiverId: any
}

interface Chat {
    id: string
    messages: Message[]
}
interface Message {
    senderId: string
    [receiverId]?: { id: string }
    text: string,
    [attachment]?: { name: string, _id: any }
    timestamp: number
}  