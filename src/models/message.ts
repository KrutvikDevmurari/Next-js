// userModel.ts
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    senderId: { type: String, required: true },
    receiverId: [
        {
            id: { type: String, required: true }
        }
    ],
    text: { type: String },
    timestamp: { type: Number },
});


export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
