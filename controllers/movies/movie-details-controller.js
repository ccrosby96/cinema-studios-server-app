
import fetch from "node-fetch";

const MovieDetailsController = (app) => {
    app.get('/api/movie/details/:uid', fetchMovieDetailsById)
    app.get('/api/movie/cast/:mid', fetchMovieCastById)
    app.get('/api/movie/providers/:mid', fetchMovieProvidersById)
    app.get('/api/movie/trending', fetchTrendingMovies)
}


const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYmVmMWFmMmU0MjNiMWJmYmZhMTg0OTdmZjc4NjgyYyIsInN1YiI6IjY0OWM3MDJmOTYzODY0MDBlM2JiYmQzNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BoWbYh_OmN5NotCpDs_emUlVPUJCHvR7YvbeJrV1cCw'
    }
};


const fetchMovieDetailsById = async (req, res) => {
    const MovieId = req.params.uid;
    const url = 'https://api.themoviedb.org/3/movie/' + MovieId +'language=en-US';
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

        console.log(data);

        return res.status(200).json(data);
    }catch (error) {
        return res.status(500).json({error : error.message});

    }
}

const fetchMovieCastById = async (req, res) => {
    const MovieId = req.params.mid;
    const url = 'https://api.themoviedb.org/3/movie/' + MovieId + '/credits?language=en-US';

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error("Failed to fetch movie cast data")
        }
        const data = await response.json();
        //res.json(data);

        return res.status(200).json(data);
    }catch (error) {
        return res.status(500).json({error : error.message});

    }
}





const fetchMovieProvidersById = async (req, res) => {
    const MovieId = req.params.mid;
    const url = 'https://api.themoviedb.org/3/movie/' + MovieId + '/watch/providers';

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error("Failed to fetch movie cast data")
        }
        const data = await response.json();

        return res.status(200).json(data);
    }catch (error) {
        return res.status(500).json({error : error.message});

    }
}

const fetchTrendingMovies = async (req,res) => {
    const url = 'https://api.themoviedb.org/3/trending/movie/week?language=en-US';
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error("Failed to fetch movie cast data")
        }
        const data = await response.json();

        return res.status(200).json(data);
    }catch (error) {
        return res.status(500).json({error : error.message});

    }

}




export default MovieDetailsController;
