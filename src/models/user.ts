import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
});

const User = mongoose.model<typeof UserSchema>('User', UserSchema);

export default User;