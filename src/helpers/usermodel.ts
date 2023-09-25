
import Chat from '@/models/chat';
import User from '../models/user';

// Get user by email
export const getUserByEmail = async (email: String) => {
    return User.findOne({ email });
};

export const getUserById = async (id: String) => {
    try {
        const user = await User.findOne({ _id: id });
        return user;
    } catch (err) {
        console.log(err);
        return null;
    }
};
export const getSomeUserById = async (id: String) => {
    try {
        const user = await User.findOne({ _id: id }).select('email name _id image');;
        return user;
    } catch (err) {
        console.log(err);
        return null;
    }
};
export async function getChatMessages(chatId: string) {
    try {
        const results: any = await Chat.findOne({ id: chatId })
        const reversedDbMessages = results.messages.reverse()
        return JSON.stringify(reversedDbMessages)
    } catch (error) {
        console.log("error", error)
        // notFound()
    }
}

export const getUserfromSession = async (session: any) => {
    try {
        const friends = session.user.friends;
        const friendsdata = await Promise.all(friends.map(async (res: any) => {
            const id = res.userId;
            try {
                const user = await User.findOne({ _id: id }).select('email name _id image');
                return user;
            } catch (error) {
                console.error(`Error fetching user with ID ${id}: ${error}`);
                return null; // or handle the error in an appropriate way
            }
        }));
        return JSON.stringify(friendsdata);
    } catch (err) {
        console.error(err);
        return null;
    }
};

// Update user's friend requests
export const updateUserFriendRequests = async (userId: String, friendId: String) => {
    return User.updateOne(
        { "_id": userId },
        { $push: { requests: { userId: friendId, userApproved: false } } }
    );
};



// Remove user's friend request
export const removeUserFriendRequest = async (userId: String, friendId: String) => {
    console.log(friendId, "friendId")
    try {
        const result = await User.updateOne(
            { "_id": userId },
            { $pull: { requests: { userId : friendId, userApproved: false } } }
        );
        return result;
    } catch (error) {
        console.error(error);
        throw error; // Rethrow the error to handle it further up the call stack
    }
};


export const addFriend = async (userId: String, friendId: String) => {
    return await User.updateOne(
        { "_id": userId },
        { $push: { friends: { userId: friendId } } }
    );
};

// Add user as a friend
export const addUserFriend = async (userId: String, friendId: String) => {

};

// Confirm friend request
export const confirmFriendRequest = async (userId: String, friendId: String) => {
    addFriend(userId, friendId);
    addFriend(friendId, userId);
    removeUserFriendRequest(userId, friendId)
    return User.updateOne(
        { 'request.userId': friendId },
        { $set: { 'request.$.userApproved': true } },
    );
};

