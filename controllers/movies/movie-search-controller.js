import fetch from "node-fetch";
import {generateUrl, generateMultiSearchQueryUrl} from "../../helper_functions/functions.js";

const MovieSearchController = (app) => {
    app.get('/api/movie/search', searchMovies)
    app.post('/api/movie/discover', searchDiscoverMovies)
    app.post('/api/movie/discover/next_page', getNextPageResults)
}
const searchMovies = async (req, res) => {
    const url = 'https://api.themoviedb.org/3/discover/movie?certification=R|PG-13&include_adult=false&include_video=false&page=1&primary_release_date.gte=2010-01-01&primary_release_date.lte=2020-01-01&sort_by=popularity.desc&vote_average.gte=7&with_genres=27,53&with_original_language=en';
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

       console.log(url);

        return res.status(200).json(data);
    }catch (error) {
        return res.status(500).json({error : error.message});

    }
}

const searchDiscoverMovies = async (req, res) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYmVmMWFmMmU0MjNiMWJmYmZhMTg0OTdmZjc4NjgyYyIsInN1YiI6IjY0OWM3MDJmOTYzODY0MDBlM2JiYmQzNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BoWbYh_OmN5NotCpDs_emUlVPUJCHvR7YvbeJrV1cCw'
        }
    };
    // extract user filters from request

    const body = req.body;
    //console.log('search params received on server: ',body)
    const searchText = body.searchText;
    const filters = body.filters;
   //console.log('filter state received on backend', filters)
    // dynamically generate url for TMDB discover endpoint
    const cacheUrl = generateUrl(filters);
    const queryUrl = cacheUrl +'&page=1'
    //console.log('generated queryUrl: ',queryUrl);

    try {
        const response = await fetch(queryUrl, options);

        if (!response.ok) {
            throw new Error("Failed to fetch actor data")
        }

        const data = await response.json();
        data.url = cacheUrl;
        console.log('total pages', data.total_pages);
        //console.log('data returned from generated queryUrl', data)

        return res.status(200).json(data);
    }catch (error) {
        return res.status(500).json({error : error.message});

    }
}

const getNextPageResults = async (req,res) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYmVmMWFmMmU0MjNiMWJmYmZhMTg0OTdmZjc4NjgyYyIsInN1YiI6IjY0OWM3MDJmOTYzODY0MDBlM2JiYmQzNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BoWbYh_OmN5NotCpDs_emUlVPUJCHvR7YvbeJrV1cCw'
        }
    };
    const body = req.body;
    const nextPage = body.currentPage + 1
    const url = body.url

    // the url for the next page
    const queryUrl = url + "&page=" + nextPage.toString()
    try {
        const response = await fetch(queryUrl, options);

        if (!response.ok) {
            throw new Error("Failed to fetch actor data")
        }

        const data = await response.json();
        //console.log('data returned from generated queryUrl', data)
        data.nextPage = nextPage;

        return res.status(200).json(data);
    }catch (error) {
        return res.status(500).json({error : error.message});

    }
}

export default MovieSearchController;