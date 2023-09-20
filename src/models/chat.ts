// userModel.ts
import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
    id: { type: String, required: true },
    messages: { type: Array },
});


export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);
