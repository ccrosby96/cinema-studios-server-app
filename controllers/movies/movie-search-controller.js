import fetch from "node-fetch";
import {generateUrl, generateMultiSearchQueryUrl} from "../../helper_functions/functions.js";

const MovieSearchController = (app) => {
    app.get('/api/movie/search', searchMovies)
    app.post('/api/movie/discover', searchDiscoverMovies)
    app.post('/api/movie/discover/next_page', getNextPageResults)
    app.post('/api/movie/discover/page', getPageResults)
    app.get('/api/movie/popular',getPopularMovies)
}

const getPopularMovies = async (req,res) => {
    const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US';
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYmVmMWFmMmU0MjNiMWJmYmZhMTg0OTdmZjc4NjgyYyIsInN1YiI6IjY0OWM3MDJmOTYzODY0MDBlM2JiYmQzNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BoWbYh_OmN5NotCpDs_emUlVPUJCHvR7YvbeJrV1cCw'
        }
    }
    try {
        const responseA = await fetch(url + '&page=1', options);
        const responseB = await fetch(url +'&page=2', options);
        const responseC = await fetch(url +'&page=3', options);
        const responseD = await fetch(url +'&page=4', options);


        if (!responseA.ok || !responseB.ok || !responseC.ok || !responseD.ok) {
            throw new Error("Failed to fetch actor data")
        }

        const data = await responseA.json();
        const dataB = await responseB.json();
        const dataC = await responseC.json();
        const dataD = await responseD.json();

        // Using concat method
        const combinedArray = data.results.concat(dataB.results, dataC.results, dataD.results);
        data.results = combinedArray

        return res.status(200).json(data);
    }catch (error) {
        return res.status(500).json({error : error.message});
    }
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
    const filters = body.filters;
   //console.log('filter state received on backend', filters)
    // dynamically generate url for TMDB discover endpoint
    const cacheUrl = generateUrl(filters);
    const queryUrl = cacheUrl +'&page=1';
    const queryUrlTwo = cacheUrl + '&page=2';
    //console.log('generated queryUrl: ',queryUrl);

    try {
        const response = await fetch(queryUrl, options);
        const responseTwo = await fetch(queryUrlTwo,options)

        if (!response.ok) {
            throw new Error("Failed to fetch actor data")
        }

        const data = await response.json();
        const dataNextPage = await responseTwo.json();
        const combinedResults = data.results.concat(dataNextPage.results);
        data.url = cacheUrl;
        data.results = combinedResults
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
const getPageResults = async (req,res) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYmVmMWFmMmU0MjNiMWJmYmZhMTg0OTdmZjc4NjgyYyIsInN1YiI6IjY0OWM3MDJmOTYzODY0MDBlM2JiYmQzNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BoWbYh_OmN5NotCpDs_emUlVPUJCHvR7YvbeJrV1cCw'
        }
    };
    const requestedPage = req.body.requestedPage;
    const url = req.body.url

    // get two underlying pages to build up requestedPage
    const pageA = (requestedPage * 2) - 1
    const pageB = pageA + 1
    console.log("pages to make page",requestedPage,pageA,pageB);

    // the url for the next page
    const queryUrlA = url + "&page=" + pageA.toString()
    const queryUrlB = url + "&page=" + pageB.toString()
    try {
        const responseA = await fetch(queryUrlA, options);
        const responseB = await fetch(queryUrlB,options);

        if (!responseA.ok || !responseB.ok) {
            throw new Error("Failed to fetch actor data")
        }

        const data = await responseA.json();
        const dataB = await responseB.json()
        //console.log('data returned from generated queryUrl', data)
        data.requestedPage = requestedPage;
        const combinedResults = data.results.concat(dataB.results);
        data.results = combinedResults;

        return res.status(200).json(data);
    }catch (error) {
        return res.status(500).json({error : error.message});

    }
}

export default MovieSearchController;