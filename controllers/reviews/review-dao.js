import reviewModel from "./review-model.js";
export const findReviews = () => reviewModel.find();
export const findReviewsByMovieId = (movieId) => reviewModel.find({movieId: movieId})
export const findReviewsByUserId = (userId) => reviewModel.find({author: userId});
export const createReview = (review) => reviewModel.create(review);
export const deleteReview = (rid) => reviewModel.deleteOne({_id: rid});
export const updateReview = (rid, review) => reviewModel.updateOne({_id: rid}, {$set: review})
