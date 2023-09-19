
import User from '../models/user';

// Get user by email
export const getUserByEmail = async (email: String) => {
    return User.findOne({ email });
};

export const getUserById = async (id: String) => {
    try {
        return User.findOne({ _id: id });
    } catch (err) {
        console.log(err)
        return null
    }

};
// Update user's friend requests
export const updateUserFriendRequests = async (userId: String, friendId: String) => {
    return User.updateOne(
        { $push: { requests: { userId: friendId, userApproved: false } } }
    );
};



// Remove user's friend request
export const removeUserFriendRequest = async (userId: String, friendId: String) => {
    return User.updateOne(
        { "_id": userId },
        { $pull: { requests: { userId: friendId } } }
    );
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

// Delete friend request
export const deleteFriendRequest = async (userId: String, friendId: String) => {
    return User.updateOne(
        { $pull: { request: { userId: friendId } } }
    );
};
