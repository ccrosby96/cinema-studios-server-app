import mongoose from 'mongoose';

const likeDislikeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    isLike: {
        type: Boolean,
        required: true,
    },
});

const commentSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    parentComment: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
    },
    replyTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null,
    },
    body: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    likeDislikes: [likeDislikeSchema],
    likes: {
        type: Number,
        default: 0,
    },
});

const reviewSchema = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 0, // Minimum rating value
        max: 10, // Maximum rating value
    },
    containsSpoilers: {
        type: Boolean,
        default: false,
    },
    likes: {
        type: Number,
        default: 0,
    },
    likeDislikes: [likeDislikeSchema],
    movieId: {
        type: Number,
        required: true,
    },
    movieTitle: {
        type: String,
    },
    posterPic: {
        type: String,
    },
    body: {
        type: String,
        required: true,
    },
    comments: [commentSchema],
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {collection: "movie_reviews"});


// Middleware to update totalLikes whenever a like or dislike is added or removed

export default reviewSchema;

