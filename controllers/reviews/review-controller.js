import * as reviewDao from './review-dao.js'
import {findUserById, findUserByUsername} from "../profile/user-dao.js";
import {isValidReview} from "../../helper_functions/functions.js";
import * as userDao from "../profile/user-dao.js";

const findReviews = async (req, res) => {
    const reviews = await reviewDao.findReviews();
    res.json(reviews);
}
const findReviewsByUser = async (req, res) => {
    try {
        const userId = req.params.uid;
        console.log("in findReviewsByUser, uid is ", userId);
        const reviews = await reviewDao.findReviewsByUserIdBodyOnly(userId)
        console.log('reviews found are', reviews);
        res.json(reviews);
    } catch (error){
        console.error('Error finding reviews by user:', error);
        res.status(500).json({ message: 'Finding user reviews failed'});
    }
}
const findReviewsByUsername = async (req,res) => {
    try {
        const username = req.params.user;
        // first check if a user with this username exists
        console.log('username in findReviewsByUsername is ', username);
        const author = await userDao.findUserByUsername(username);

        if (!author) {
            res.status(500).json({ message: 'Could not find an author with that username'});
            return
        }
        console.log("in findReviewsByUsername author object is", author);
        const userId = author._id;
        console.log("in findReviewsByUsername, username is ", userId);
        // grab reviews by this author
        const reviews = await reviewDao.findReviewsByUserIdBodyOnly(userId)
        // in response object include username, avatar, and reviews for rendering
        const data = {username: author.username,
                        profilePic: author.profilePic,
                        reviews: reviews
                        }
        console.log('reviews found are', reviews);
        res.json(data);
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

const createReview = async (req, res) => {
    try {
        const newReview = req.body;

        // Validate user review first
        if (!isValidReview(newReview)) {
            return res.status(400).json({ error: "Invalid review data" });
        }

        // Upon creation, a review will have no comments =D
        newReview.comments = [];

        // Create the review
        const insertedReview = await reviewDao.createReview(newReview);

        // Populate author username and profile pic
        const populatedReview = await insertedReview
            .populate('author', ['username', 'profilePic'])


        res.json(populatedReview);
    } catch (error) {
        console.error("Error creating review:", error);
        res.status(500).json({ error: "Internal server error" });
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
const updateCommentLikeDislike = async (req, res) => {
    console.log('comment vote on backend', req.body);
    try {
        console.log('comment vote on backend', req.body);
        const { reviewId, commentId, userId, isLike } = req.body;
        console.log('reviewId,commentId,userId,isLike in updateComment...', reviewId,commentId,userId,isLike);

        const review = await reviewDao.findReviewById(reviewId);

        if (!review) {
            console.log('review not found with reviewId', reviewId);
            return res.status(404).json({ error: 'Review not found' });
        }

        const comments = review.comments;
        console.log('comments of review', comments);
        const indexOfTargetComment = comments.findIndex(comment => comment._id.toString() === commentId.toString());
        console.log('index of comment', indexOfTargetComment)

        if (indexOfTargetComment !== -1) {
            const targetComment = comments[indexOfTargetComment];
            const existingLikeDislike = targetComment.likeDislikes.find(ld => ld.user.toString() === userId.toString());

            if (existingLikeDislike) {
                existingLikeDislike.isLike = isLike;
            } else {
                targetComment.likeDislikes.push({ user: userId, isLike });
            }

            const updatedLikes = targetComment.likeDislikes.reduce((total, ld) => (ld.isLike ? total + 1 : total - 1), 0);
            targetComment.likes = updatedLikes;
            const updatedReview = await review.save();

            return res.json(targetComment);
        }

        return res.status(404).json({ error: 'Comment not found' });
    } catch (error) {
        console.error('Error updating likeDislikes of comment:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

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
const getReviewByReviewId = async (req, res) => {
    try {
        const reviewId = req.params.rid;
        const review = await reviewDao.findReviewByIdPopulated(reviewId);

        if (review) {
            res.json(review);
        } else {
            // Return a 404 Not Found status code if the review is not found
            res.status(404).json({ error: 'Review not found' });
        }
    } catch (error) {
        console.error('Error fetching review:', error);
        // Return a 500 Internal Server Error status code and an error message
        res.status(500).json({ error: 'Internal server error' });
    }
};

const deleteReview = async (req, res) => {
    try {
        console.log('in deleteReview with rid', req.params.rid);
        const currentUser = req.session["currentUser"];
        if (!currentUser) {
            return res.status(404).json({ error: 'User not authenticated' });
        }

        const reviewId = req.params.rid;
        const reviewToDelete = await reviewDao.findReviewById(reviewId);
        console.log('trying to delete review', reviewId);
        console.log('review to be deleted: ', reviewToDelete);

        if (!reviewToDelete) {
            return res.status(404).json({ error: 'Review not found' });
        }
        if (currentUser._id.toString() === reviewToDelete.author.toString() || currentUser.role === 'admin') {
            const status = await reviewDao.deleteReview(reviewId);
            if (status) {
                return res.json({ message: 'Review deleted successfully' });
            }
            return res.status(404).json({ error: 'Review not found' });
        }

        // User doesn't have permission
        return res.status(403).json({ error: 'Permission denied' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const MovieReviewsController = (app) => {
    app.post('/api/reviews/movies', createReview);
    app.get('/api/reviews/movies', findReviews);
    app.get('/api/reviews/movies/user/:uid', findReviewsByUser);
    app.get('/api/reviews/movies/user/username/:user',findReviewsByUsername)
    app.get('/api/reviews/movies/movie/:mid', findReviewsByMovieId)
    app.get('/api/reviews/movies/:rid', getReviewByReviewId)
    app.put('/api/reviews/movies', updateReview);
    app.delete('/api/reviews/movies/:rid', deleteReview);
    app.put('/api/reviews/movies/like-dislike', updateLikeDislike)
    app.put('/api/reviews/movies/like-dislike/comment', updateCommentLikeDislike)
    app.put('/api/reviews/movies/:rid/add-comment', addReviewComment)
}
export default MovieReviewsController;
