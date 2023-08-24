
import fetch from "node-fetch";

const MovieRecommendationsController = (app) => {
    app.get('/api/movie/recommendations/:mid', fetchMovieRecommendationsById)
}

const url = 'https://api.themoviedb.org/3/movie/713704/recommendations?language=en-US&page=1';
const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYmVmMWFmMmU0MjNiMWJmYmZhMTg0OTdmZjc4NjgyYyIsInN1YiI6IjY0OWM3MDJmOTYzODY0MDBlM2JiYmQzNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BoWbYh_OmN5NotCpDs_emUlVPUJCHvR7YvbeJrV1cCw'
    }
};

const fetchMovieRecommendationsById = async (req, res) => {
    const MovieId = req.params.mid;
    const url = 'https://api.themoviedb.org/3/movie/' + MovieId +'/recommendations?language=en-US&page=1';
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
            throw new Error("Failed to fetch movie recommendations")
        }
        const data = await response.json();

        return res.status(200).json(data);
    }catch (error) {
        return res.status(500).json({error : error.message});

    }
}

export default MovieRecommendationsController;
