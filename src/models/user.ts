// userModel.ts
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    image: { type: String },
    requests: [
        {
            userId: { type: String, required: true },
            userApproved: { type: Boolean, default: false },
        },
    ],
    group: [
        {
            groupname: { type: String, required: true },
            groupImage: { type: String },
            users: [
                { id: { type: String, required: true } }
            ],
            createdBy: { type: String, required: true },
        },
    ],
    friends: [
        {
            userId: { type: String, required: true },
        },
    ],
});


export default mongoose.models.User || mongoose.model('User', UserSchema);
