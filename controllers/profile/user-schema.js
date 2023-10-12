import mongoose from 'mongoose';

const movieFavorite = new mongoose.Schema({
    movieTitle: {
        type: String,
        required: true
    },
    movieId: {
        type: String,
        required: true,
        unique: true
    },
    posterPic: {
        type: String,
        default: "https://media.istockphoto.com/id/1039351052/vector/movie-and-film-festival-poster-template-design-modern-retro-vintage-style.jpg?s=612x612&w=0&k=20&c=aPVSLX7VlJj7DYBZ8afyj9ca15qoZEeZkLj_1exaUfE="
    },
    dateAdded: {
        type: Date,
        default: Date.now,
    },
});

const schema = mongoose.Schema({
    firstName: String, lastName: String,
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: String,
    createdAt: {type: Date, default: Date.now},
    isAdmin: {type: Boolean, default: false},
    profilePic: String,
    favoriteMovies: [movieFavorite],
    bio: String,
    location: String,
    dateOfBirth: Date,
    following: Number,
    followers: Number,
    followed: Boolean,
    watchlist: [
        {
            movieTitle: {
                type: String,
                required: true
            },
            movieId: {
                type: String,
                required: true,
                unique: true
            },
            posterPic: {
                type: String,
                default: "https://i.pinimg.com/736x/8b/99/ac/8b99ac9d4c6ab33de35a775e527d2fae--film-popcorn-film-reels.jpg"
            },
            movieDescription: {
                type: String,
                default: ""
            },
            releaseDate: {
                type: Date,
                default: Date.now,
            },
        }
    ],
    role: {
        type: String,
        default: "user",
        enum: ["admin", "user", "guest", "moderator"],
      },
    
}, {collection: 'users'});
export default schema;
