
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
    text: string
    timestamp: number
}  