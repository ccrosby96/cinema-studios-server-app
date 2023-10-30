import mongoose from "mongoose";

const movieRatingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    movieId: {
        type: Number,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        validate: {
            validator: function(value) {
                return value >= 0 && value <= 10;
            },
            message: "Rating must be between 0 and 10."
        }
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
}, {collection: "movie_ratings"});

export default movieRatingSchema;
