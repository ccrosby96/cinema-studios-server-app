import express from 'express'
import cors from 'cors'
import mongoose from "mongoose";
import HelloController
    from "./controllers/hello-controller.js"
import ActorController from "./controllers/actors/actor-controller.js";
import MovieDetailsController from "./controllers/movies/movie-details-controller.js";
import MovieRecommendationsController from "./controllers/movies/movie-recommendations-controller.js";
import MovieSearchController from "./controllers/movies/movie-search-controller.js";
import MultiSearchController from "./controllers/search/search-controller.js";
import TvController from "./controllers/tv/tv-controller.js";
import UsersController from "./controllers/profile/user-controller.js";
import MovieReviewsController from "./controllers/reviews/review-controller.js";
import session from "express-session"

const app = express()
app.use(cors(
    {credentials: true,
        origin: "http://localhost:3000"
    })
);
app.use(express.json())
//const port = process.env.PORT || 4000;
app.use(
    session({
        secret: "any string",
        resave: false,
        saveUninitialized: true
    })
);
HelloController(app)
ActorController(app)
MovieDetailsController(app)
MovieRecommendationsController(app)
MovieSearchController(app);
MultiSearchController(app)
TvController(app)
UsersController(app)
MovieReviewsController(app);
// Connecting to MongoDB cloud hosted db
mongoose.connect("mongodb+srv://crosbycalvin:Joeybob96@cluster0.sqc4syr.mongodb.net/cinema_studios");
app.listen(4000)

