import mongoose from 'mongoose';

const schema = mongoose.Schema({
    firstName: String, lastName: String,
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: String,
    createdAt: {type: Date, default: Date.now},
    isAdmin: {type: Boolean, default: false},
    profilePic: String,
    bio: String,
    location: String,
    dateOfBirth: Date,
    following: Number,
    followers: Number,
    followed: Boolean,
    role: {
        type: String,
        default: "user",
        enum: ["admin", "user", "guest", "moderator"],
      },
    
}, {collection: 'users'});
export default schema;
