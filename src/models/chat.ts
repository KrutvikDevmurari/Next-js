// userModel.ts
import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
    id: { type: String, required: true },
    messages: [{
        // Define the structure of each object in the 'messages' array
        senderId: { type: String, required: true },
        receiverId: [
            {
                id: { type: String, required: true }
            }
        ],
        text: { type: String, required: true },
        timestamp: { type: Number, required: true },
    }],
});


export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
