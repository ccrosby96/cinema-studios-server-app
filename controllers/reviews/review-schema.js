import mongoose from 'mongoose';

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
    likes: {
        type: Number,
        default: 0,
    },
    movieId: {
        type: Number,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    comments: [
        {
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User', // Reference to the User model
                required: true,
            },
            text: {
                type: String,
                required: true,
            },
            createdAt: {
                type: Date,
                default: Date.now,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {collection: "movie_reviews"});
export default reviewSchema;
