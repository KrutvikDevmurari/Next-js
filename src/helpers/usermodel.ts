// userModel.ts
import User from '../models/user';

// Get user by email
export const getUserByEmail = async (email: String) => {
    return User.findOne({ email });
};

export const getUserById = async (id: String) => {
    return User.findOne({ id });
};
// Update user's friend requests
export const updateUserFriendRequests = async (userId: String, friendId: String) => {
    return User.updateOne(
        { _id: userId },
        { $push: { requests: { userId: friendId, userApproved: false } } }
    );
};



// Remove user's friend request
export const removeUserFriendRequest = async (userId: String, friendId: String) => {
    return User.updateOne(
        { _id: userId },
        { $pull: { request: { userId: friendId } } }
    );
};


export const addFriend = async (userId: String, friendId: String) => {
    return User.updateOne(
        { _id: userId },
        { $addToSet: { friends: friendId } }
    );
};


// Add user as a friend
export const addUserFriend = async (userId: String, friendId: String) => {
    return User.updateOne(
        { _id: userId },
        { $addToSet: { request: friendId } }
    );
};

// Confirm friend request
export const confirmFriendRequest = async (userId: String, friendId: String) => {
    addFriend(userId, friendId);
    addFriend(friendId, userId);
    return User.updateOne(
        { _id: userId, 'request.userId': friendId },
        { $set: { 'request.$.userApproved': true } },
    );
};

// Delete friend request
export const deleteFriendRequest = async (userId: String, friendId: String) => {
    return User.updateOne(
        { _id: userId },
        { $pull: { request: { userId: friendId } } }
    );
};
