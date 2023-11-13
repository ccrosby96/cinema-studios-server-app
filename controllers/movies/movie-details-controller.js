
import fetch from "node-fetch";
import {extractTrailer} from "../../helper_functions/functions.js";

const MovieDetailsController = (app) => {
    app.get('/api/movie/details/:uid', fetchMovieDetailsById)
    app.get('/api/movie/details/title/:title', fetchMovieDetailsByTitle)
    app.get('/api/movie/cast/:mid', fetchMovieCastById)
    app.get('/api/movie/providers/:mid', fetchMovieProvidersById)
    app.get('/api/movie/trending', fetchTrendingMovies)
    app.get('/api/movie/:mid/videos', fetchMovieTrailersById)
    app.get('/api/movie/upcoming', fetchUpcomingMovies)
    app.post('/api/movie/details/suggestions', fetchMovieDetailsFromSuggestions)
}

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYmVmMWFmMmU0MjNiMWJmYmZhMTg0OTdmZjc4NjgyYyIsInN1YiI6IjY0OWM3MDJmOTYzODY0MDBlM2JiYmQzNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BoWbYh_OmN5NotCpDs_emUlVPUJCHvR7YvbeJrV1cCw'
    }
};

const fetchMovieTrailersById = async (req,res) => {
    const movieId = req.params.mid;
    const url = 'https://api.themoviedb.org/3/movie/' + movieId + '/videos?language=en-US';
    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error("Failed to fetch actor data")
        }
        const data = await response.json();
        const results = extractTrailer(data)
        const returnObject = {"trailers": results}

        return res.status(200).json(returnObject);
    }catch (error) {
        return res.status(500).json({error : error.message});

    }
}

const fetchMovieDetailsById = async (req, res) => {
    const MovieId = req.params.uid;
    const url = 'https://api.themoviedb.org/3/movie/'+ MovieId + '?append_to_response=release_dates%2Ccredits%2Crecommendations%2Cvideos&language=en-US';
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
        // extracting trailers from videos results on server
        const data = await response.json();
        const trailers = extractTrailer(data)
        data.trailers = trailers
        return res.status(200).json(data);
    }catch (error) {
        return res.status(500).json({error : error.message});

    }
}
const fetchMovieDetailsFromSuggestions = async (req,res) => {
    console.log("called fetchMovieDetailsFromSuggestions with req body", req.body);
    let results = [];
    let resultDict = {}
    const suggestions = req.body.suggestions;
    // up to 10 suggestions to iterate over
    try {
        for (let i = 0; i < suggestions.length; i++) {
            try {
                const title = suggestions[i].movieTitle;
                const releaseYear = suggestions[i].releaseYear;

                if (title && releaseYear) {
                    const url = `https://api.themoviedb.org/3/search/movie?query=${title}&include_adult=false&language=en-US&primary_release_year=${releaseYear}&page=1`;
                    console.log('generated url for title', title, url);
                    const response = await fetch(url, options);
                    const data = await response.json();
                    console.log('individual results from suggestion title', title, data);
                    if (data){
                        results = [...results, data.results];
                        resultDict[title] = data.results;
                    }
                }
            }catch (error){
                console.error(error)
            }
        }
        const returnObject = {
            resultDict: resultDict
        }
        return res.status(200).json(returnObject);
    }catch (error){
        return res.status(500).json({error : error.message});
    }
}
const fetchMovieDetailsByTitle = async (req,res) => {
    const title = req.params.title;
    const url = `https://api.themoviedb.org/3/search/movie?query=${title}&include_adult=false&sort_by=popularity.desc&language=en-US&page=1`

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
const fetchUpcomingMovies = async (req,res) => {

    const url = 'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1';
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
