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
const findReviewsByMovieId = async (req,res) => {
    try {
        const movieId = req.params.mid;
        const reviews = await reviewDao.findReviewsByMovieId(movieId).populate('author', ['username', 'profilePic'])
        res.json(reviews)
    } catch (error){
        console.error("Error finding movie reviews from movie", error)
        res.status(500).json({message: "finding movie reviews by movieID failed"})
    }
}
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
        const insertedReview = await reviewDao.createReview(newReview);
        console.log(insertedReview);
        res.json(insertedReview)
    } catch (error) {
        // Handle other errors, e.g., database errors
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
}
export default MovieReviewsController;
