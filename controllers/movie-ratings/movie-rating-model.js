import mongoose from 'mongoose';
import movieRatingSchema from "./movie-rating-schema.js";

const movieRatingModel = mongoose
    .model('MovieRating', movieRatingSchema);
export default movieRatingModel;
