import actors from './actors.js'
import fetch from "node-fetch";
import res from "express/lib/response.js";

let stars = actors;
const ActorController = (app) => {
    app.get('/api/actors', findActors)
    app.get('/api/actors/:aid/details', fetchActorById);
    app.get('/api/actors/:aid/movie_credits', fetchActorMovieCreditsById);
}

const findActors = (req,res) => {
    res.json(stars)
}

const fetchActorById = async (req, res) => {
    const ActorId = req.params.aid;
    const url = 'https://api.themoviedb.org/3/person/' + ActorId + '?language=en-US';
    console.log(url)
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYmVmMWFmMmU0MjNiMWJmYmZhMTg0OTdmZjc4NjgyYyIsInN1YiI6IjY0OWM3MDJmOTYzODY0MDBlM2JiYmQzNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BoWbYh_OmN5NotCpDs_emUlVPUJCHvR7YvbeJrV1cCw'
        }
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error("Failed to fetch actor data")
        }
        const data = await response.json();

        return res.status(200).json(data);
    }catch (error) {
        return res.status(500).json({error : error.message});

    }
}

const fetchActorMovieCreditsById = async (req, res) => {
    const ActorId = req.params.aid;
    const url = 'https://api.themoviedb.org/3/person/' + ActorId + '/movie_credits?language=en-US';
    console.log(url)
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYmVmMWFmMmU0MjNiMWJmYmZhMTg0OTdmZjc4NjgyYyIsInN1YiI6IjY0OWM3MDJmOTYzODY0MDBlM2JiYmQzNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BoWbYh_OmN5NotCpDs_emUlVPUJCHvR7YvbeJrV1cCw'
        }
    };

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error("Failed to fetch actor data")
        }
        const data = await response.json();

        return res.status(200).json(data);
    }catch (error) {
        return res.status(500).json({error : error.message});

    }
}




export default ActorController;