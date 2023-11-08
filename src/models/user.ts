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
            issActive: { type: Boolean, require: true }
        },
    ],
    status: [
        {
            seen: [
                {
                    id: { type: String },
                    seentimestamp: { type: Number },

                }
            ],
            text: { type: String },
            timestamp: { type: Number },
        }
    ]
});


export default mongoose.models.User || mongoose.model('User', UserSchema);
