import reviewModel from "./review-model.js";
export const findReviews = () => reviewModel.find();
// grab all reviews for a given movie
export const findReviewsByMovieId = (movieId) => reviewModel.find({movieId: movieId})
// grab a specific review by its own _id
export const findReviewsByMovieIdPaginated = async (movieId, page = 1, pageSize = 20) => {
    try {
        const skip = (page - 1) * pageSize;
        // total count of reviews for this movie
        const totalMovieReviews = await reviewModel.countDocuments({movieId : movieId});
        // total number of pages of movie reviews
        const totalPages = Math.ceil(totalMovieReviews / pageSize);
        // fetch requested page
        const paginatedResults = await reviewModel
            .find({movieId: movieId})
            .skip(skip)
            .sort({likes: -1})
            .limit(pageSize)
            .populate({
                path: 'comments',
                populate: {
                    path: 'author replyTo',
                    select: ['username', 'profilePic']
                }
            })

        return {maxPages: totalPages, currentPage: page, reviews: paginatedResults}

    }catch (error) {
        console.error("Error fetching paginated movie reviews")
        throw error;
    }
}
export const findReviewById = async (rid) => {
    return reviewModel.findOne({_id: rid});
}

export const findReviewByIdPopulated = async (rid) => {
    return reviewModel.findOne({_id: rid}).populate({
        path: 'comments',
        populate: {
            path: 'author replyTo',
            select: ['username', 'profilePic']
        }
    }).populate('author', ['username', 'profilePic']);
}
export const findReviewsByUserId = (userId) => reviewModel.find({author: userId});
export const findReviewsByUserIdBodyOnly = (userId) => reviewModel.find(
    { author: userId },
    { comments: 0, likeDislikes: 0 } // Exclude 'comments' and 'likeDislikes' fields
);

export const createReview = (review) => reviewModel.create(review);
export const deleteReview = (rid) => reviewModel.deleteOne({_id: rid});
export const updateReview = async (rid, review) => {
    return reviewModel.findOneAndUpdate(
        { _id: rid },
        { $set: review },
        { new: true } // Return the updated document
    );
};

