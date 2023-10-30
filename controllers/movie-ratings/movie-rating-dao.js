import movieRatingModel from "./movie-rating-model.js";


export const updateMovieRating = async (ratingId, updatedRating) => {
    try {
        // Find the existing rating
        const existingRating = await movieRatingModel.findById(ratingId);

        if (!existingRating) {
            throw new Error('Rating not found');
            return;
        }
        // Update the fields of the existing rating
        existingRating.rating = updatedRating.rating;

        // Save the updated rating back to the database
        const updatedResult = await existingRating.save();
        return updatedResult;
    } catch (error) {
        console.error('Error updating movie rating:', error);
        throw error;
    }
};



export const findUserMovieRating = async (userId, movieId) => {
    try {
        const rating = await movieRatingModel.findOne({ user: userId, movieId });
        if (rating) {
            return { found: true, rating };
        } else {
            return { found: false, rating: null };
        }
    } catch (error) {
        console.error("Error searching for movie rating by user", error);
        throw error;
    }
}
export const findMovieRatingByUserAndMovie = async (userId,movieId) => {
    try {
        const rating = await movieRatingModel.findOne({user:userId, movieId});
        return rating;
    }catch (error){
        console.error('Error finding movie rating by user and movieId')
    }
}
export const postUserMovieRating = async (ratingObject) => {
    try {
        const res = await movieRatingModel.create(ratingObject);
        if (res) {
            return true;
        }
        return false
    }catch (error) {
        throw error;
    }
}
