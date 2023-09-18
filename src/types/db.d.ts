interface User {
    name: string
    email: string
    image: string
    id: string
    [friends: string]: { id: string }
    [requests: string]: { id: string, userApproved: boolean }
}


interface FriendRequest {
    id: string
    senderId: string
    receiverId: string
}