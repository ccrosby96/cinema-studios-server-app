import * as movieRatingsDao from "./movie-rating-dao.js"
import movieRatingModel from "./movie-rating-model.js";

const MovieRatingController = (app) => {
    app.get('/api/ratings/movies/:mid/:uid', findUserMovieRating)
    app.post('/api/ratings/movies', postMovieRating)
}
const isValidRating  = (rating) => {
    if (rating.user && rating.rating && rating.movieId) {
        return true;
    }
    return false;
}
const findUserMovieRating = async (req,res) => {
    try {
        const movieId = req.params.mid;
        const userId = req.params.uid;
        console.log('in findUserMovieRating with uid, mid', userId, movieId);

        const result =  await movieRatingsDao.findUserMovieRating(userId, movieId);
        console.log('result', result);
        res.json(result);
    }catch (error) {
        throw error;
    }
}
const postMovieRating = async (req, res) => {
    const rating = req.body;

    try {
        // Validate rating data
        if (!isValidRating(rating)) {
            res.status(400).json({ error: 'Invalid rating data' });
            return;
        }

        // Check if a rating with the same userId and movieId already exists
        const existingRating = await movieRatingsDao.findMovieRatingByUserAndMovie(rating.user, rating.movieId);

        if (existingRating) {
            // If it exists, update the existing rating
            const updatedRating = await movieRatingsDao.updateMovieRating(existingRating._id, rating);
            res.status(200).json(updatedRating);
        } else {
            // If it doesn't exist, create a new rating
            const newRating = await movieRatingsDao.postUserMovieRating(rating);
            res.status(200).json(newRating);
        }
    } catch (error) {
        console.error('Error saving/updating movie rating:', error);
        res.status(500).json({ error: 'Failed to save/update movie rating' });
    }
};


export default MovieRatingController;