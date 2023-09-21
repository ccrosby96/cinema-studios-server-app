import mongoose from 'mongoose';
import reviewSchema from "./review-schema.js";
const reviewModel = mongoose
    .model('ReviewModel', reviewSchema);
export default reviewModel;