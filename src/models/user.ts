// userModel.ts
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    image: { type: String },
    requests: [
        {
            userId: { type: String, required: true },
            userApproved: { type: Boolean, default: false },
        },
    ],
    friends: [
        {
            userId: { type: String, required: true },
        },
    ],
});

UserSchema.methods.addToFriends = function (friendId: string) {
    const existingFriend = this.friends.find((friend: any) => friend.userId === friendId);
    if (!existingFriend) {
        this.friends.push({ userId: friendId });
    }
};


UserSchema.methods.addToRequests = function (friendId: string) {
    const existingFriend = this.requests.find((friend: any) => friend.userId === friendId);
    if (!existingFriend) {
        this.friends.push({ userId: friendId });
    }
};
export default mongoose.models.User || mongoose.model('User', UserSchema);
