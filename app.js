import express from 'express'
import cors from 'cors'
import HelloController
    from "./controllers/hello-controller.js"
import ActorController from "./controllers/actors/actor-controller.js";
import MovieDetailsController from "./controllers/movies/movie-details-controller.js";
import MovieRecommendationsController from "./controllers/movies/movie-recommendations-controller.js";

const app = express()
app.use(cors())
app.use(express.json())
HelloController(app)
ActorController(app)
MovieDetailsController(app)
MovieRecommendationsController(app)

app.listen(4000)

