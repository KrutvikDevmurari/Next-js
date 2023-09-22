// userModel.ts
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
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
            userId: { type: String, required: true, unique: true },
        },
    ],
});


export default mongoose.models.User || mongoose.model('User', UserSchema);
