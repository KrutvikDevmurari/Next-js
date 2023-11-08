// userModel.ts
import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
    id: { type: String, required: true },
    messages: [{
        senderId: { type: String, required: true },
        receiverId: [
            {
                id: { type: String, required: true }
            }
        ],
        text: { type: String },
        attachment: [
            {
                name: { type: String }
            }
        ] || null,
        timestamp: { type: Number, required: true },
    }],
});


export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
