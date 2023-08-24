import express from 'express'
import HelloController
    from "./controllers/hello-controller.js"
import ActorController from "./controllers/actors/actor-controller.js";
import MovieDetailsController from "./controllers/movies/movie-details-controller.js";
import MovieRecommendationsController from "./controllers/movies/movie-recommendations-controller.js";

const app = express()
HelloController(app)
ActorController(app)
MovieDetailsController(app)
MovieRecommendationsController(app)

app.listen(4000)

