import * as reviewDao from './review-dao.js'
import {findUserByUsername} from "../profile/user-dao.js";
import {isValidReview} from "../../helper_functions/functions.js";

const findReviews = async (req, res) => {
    const reviews = await reviewDao.findReviews();
    res.json(reviews);
}
const findReviewsByUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const reviews = await reviewDao.findReviewsByUserId(userId)
        res.json(reviews);
    } catch (error){
        console.error('Error finding reviews by user:', error);
        res.status(500).json({ message: 'Finding user reviews failed'});
    }
}


const findReviewsByMovieId = async (req, res) => {
    try {
        const movieId = req.params.mid;
        const reviews = await reviewDao.findReviewsByMovieId(movieId).populate({
            path: 'comments',
            populate: {
                path: 'author replyTo',
                select: ['username', 'profilePic']
            }
        }).populate('author', ['username', 'profilePic']);

        res.json(reviews);
    } catch (error) {
        console.error("Error finding movie reviews from movie", error);
        res.status(500).json({ message: "Finding movie reviews by movieID failed" });
    }
}
const populateComments = async (comments) => {
    // Ensure comments is an array
    if (!Array.isArray(comments)) {
        return comments;
    }

    // Map over each comment and populate its author field
    const populatedComments = await Promise.all(comments.map(async (comment) => {
        // Populate top-level author field
        await comment.populate('author', ['username', 'profilePic']).execPopulate();

        // Populate replies recursively
        comment.replies = await populateComments(comment.replies);

        return comment;
    }));

    return populatedComments;
};



const createReview = async (req, res) => {
    try {
        const newReview = req.body;
        console.log("newReview on server", newReview);


        // validate user review first
        if (!isValidReview(newReview)) {
            console.log("the review was invalid")
            return res.status(400).json({ error: "Invalid review data" });
        }
        // upon creation a review will have no comments =D
        newReview.comments = [];
        const insertedReview = await reviewDao.createReview(newReview)
        console.log(insertedReview);
        res.json(insertedReview)
    } catch (error) {
        // Handle other errors, e.g., database errors
    }
};
// Assuming you have a MovieReview model based on the reviewSchema

const updateLikeDislike = async (req,res) =>{
    const { reviewId, userId, isLike } = req.body;
    console.log('in updateLikeDislike on server with rid,uid,isLike', reviewId,userId,isLike);
    try {
        // look up review user voted on
        const review = await reviewDao.findReviewById(reviewId);

        if (!review) {
            throw new Error('Review not found');
        }
        // Check if the user has already liked or disliked the review
        const existingLikeDislike = review.likeDislikes.find(ld => ld.user.toString() === userId.toString());

        if (existingLikeDislike) {
            // If the user has already liked or disliked, update the existing record
            existingLikeDislike.isLike = isLike;
        } else {
            // If the user hasn't liked or disliked, create a new likeDislike record
            review.likeDislikes.push({ user: userId, isLike });
        }
        const updatedLikes = review.likeDislikes.reduce((total, ld) => (ld.isLike ? total + 1 : total - 1), 0);
        // Save the updated review

        console.log('Before save:', review.likes);
        review.likes = updatedLikes;
        const updatedReview = await review.save();
        console.log('After save:', review.likes);
        // Return the updated review
        res.json(updatedReview);
    } catch (error) {
        console.error('Error updating likeDislikes:', error.message);
        throw error;
    }
}
const addReviewComment = async (req, res) => {
    const reviewId = req.params.rid;
    const newComment = req.body;

    try {
        const review = await reviewDao.findReviewById(reviewId);

        if (!review) {
            res.status(404).json({ error: 'Review not found' });
            return;
        }

        // validation
        if (!newComment || !newComment.author || !newComment.body) {
            res.status(400).json({ error: 'Invalid comment data' });
            return;
        }

        review.comments.push(newComment);
        const updatedReview = await review.save();
        res.json(newComment);
    } catch (error) {
        console.error('Error pushing comment to review:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

const updateReview = async (req, res) => {
    const reviewIdToUpdate = req.body.author
    const updates = req.body;
    const status = await reviewDao.updateReview(reviewIdToUpdate, updates);
    res.json(status);

}
const deleteReview = async (req, res) => {
    const ReviewIdToDelete = req.params.rid;
    const status = await reviewDao.deleteReview(ReviewIdToDelete);
    res.json(status);
}
const MovieReviewsController = (app) => {
    app.post('/api/reviews/movies', createReview);
    app.get('/api/reviews/movies', findReviews);
    app.get('/api/reviews/movies/user/:uid', findReviewsByUser);
    app.get('/api/reviews/movies/movie/:mid', findReviewsByMovieId)
    app.put('/api/reviews/movies', updateReview);
    app.delete('/api/reviews/movies/:rid', deleteReview);
    app.put('/api/reviews/movies/like-dislike', updateLikeDislike)
    app.put('/api/reviews/movies/:rid/add-comment', addReviewComment)
}
export default MovieReviewsController;
