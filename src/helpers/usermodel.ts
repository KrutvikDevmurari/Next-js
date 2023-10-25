
import Chat from '@/models/chat';
import User from '../models/user';
import mongoose from 'mongoose';
import { chatHrefConstructor } from '@/lib/utils';

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

export const getGroupById = async (id: any, session: any) => {
    try {
        const user = await session.user.group.find((res: any) => res.id.toString() === id.toString())
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
        // notFound()
    }
}

export async function GetGroupData(groupData: any) {
    const array: any = []
    const promises = groupData.users.map(async (res: any) => {
        // Assuming getSomeUserById is working as expected and returns user data
        const val = await getSomeUserById(res.id);
        res.userData = val;
        array.push(val)
        return res;
    });

    const updatedUsers = await Promise.all(promises);

    // Update groupData.users with the updatedUsers array
    groupData.users = updatedUsers;

    return array;
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
                return error; // or handle the error in an appropriate way
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



export const addUserGroup = async (userId: { toString: () => any; }, groupName: FormDataEntryValue, groupImage: string, users: any, createdBy: any) => {
    try {
        // Convert userId, createdBy, and user IDs to strings (if not already)
        userId = userId.toString();
        createdBy = createdBy.toString();
        users = JSON.parse(users);

        // Generate a unique ID for the group
        const groupId = new mongoose.Types.ObjectId();

        const groupData = {
            _id: groupId, // Assign the generated unique ID to the group
            groupname: groupName,
            groupImage,
            users,
            createdBy,
        };

        const query = {
            _id: { $in: users.map((user: any) => user.id) },
        };

        const update = {
            $push: {
                group: groupData,
            },
        };

        const result = await User.updateMany(query, update);

        return result;
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};



export const updateUserGroup = async (userId: { toString: () => any; }, groupName: FormDataEntryValue, groupImage: string, users: any, createdBy: any, groupId: any) => {
    try {
        // Convert userId, createdBy, and user IDs to strings (if not already)
        userId = userId.toString();
        createdBy = createdBy.toString();
        users = JSON.parse(users);

        const groupData = {
            groupname: groupName,
            groupImage,
            users,
            createdBy,
            _id: groupId
        };

        const update = {
            $set: {
                group: groupData,
            },
        };

        // Construct the query to update multiple users
        const query = {
            _id: { $in: users.map((user: any) => user.id) },
        };

        // Use the updateMany method to update multiple users at once
        const result = await User.updateMany(query, update);

        return result
    } catch (error: any) {
        return { success: false, message: error.message };
    }
};


// Remove user's friend request
export const removeUserFriendRequest = async (userId: String, friendId: String) => {
    try {
        const result = await User.updateOne(
            { "_id": userId },
            { $pull: { requests: { userId: friendId, userApproved: false } } }
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
export const removeFriend = async (userId: String, friendId: String) => {
    return await User.updateOne(
        { "_id": userId },
        { $pull: { friends: { userId: friendId } } }
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

export const UnFriend = async (userId: string, friendId: string) => {
    removeFriend(userId, friendId);
    removeFriend(friendId, userId);
    const chatId = chatHrefConstructor(
        userId,
        friendId
    )
    const results: any = await Chat.findOneAndDelete({ id: chatId })
    return User.updateOne(
        { 'request.userId': friendId },
        { $set: { 'request.$.userApproved': true } },
    );
};