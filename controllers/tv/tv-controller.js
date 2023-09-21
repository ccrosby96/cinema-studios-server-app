
import fetch from "node-fetch";

const TVController = (app) => {
    app.get('/api/tv/:series_id', fetchTvSeriesDetailsById)
    app.get('/api/tv/:series_id/season/:season_number', fetchTvSeasonDetails)
    app.get('/api/tv/:series_id/recommendations', fetchTvSeriesRecommendations)
    app.get('/api/tv/:series_id/cast',fetchTvSeriesCast)
}

const options = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYmVmMWFmMmU0MjNiMWJmYmZhMTg0OTdmZjc4NjgyYyIsInN1YiI6IjY0OWM3MDJmOTYzODY0MDBlM2JiYmQzNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BoWbYh_OmN5NotCpDs_emUlVPUJCHvR7YvbeJrV1cCw'
    }
};
const fetchTvSeriesCast = async (req,res) => {
    const seriesId = req.params.series_id;
    const url = 'https://api.themoviedb.org/3/tv/' + seriesId + '/aggregate_credits?language=en-US';

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
const fetchTvSeriesRecommendations = async (req,res) => {
    const seriesId = req.params.series_id
    const url = 'https://api.themoviedb.org/3/tv/' + seriesId + '/recommendations?language=en-US&page=1';
    console.log('fetching series recs @ ', url);

    try {
        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error("Failed to fetch actor data")
        }

        const data = await response.json();
        console.log('series rec: ', data);



        return res.status(200).json(data);
    }catch (error) {
        return res.status(500).json({error : error.message});
    }
}
const fetchTvSeriesDetailsById = async (req, res) => {
    const seriesId = req.params.series_id;
    console.log("seriesId from req on server side", seriesId)
    const url = 'https://api.themoviedb.org/3/tv/' + seriesId+ '?language=en-US';
    console.log("fetchSeriesDetailsById url: ", url)

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

const fetchTvSeasonDetails = async (req, res) => {
    const seriesId = req.params.series_id;
    const seasonNumber = req.params.season_number;

    const url = 'https://api.themoviedb.org/3/tv/' + seriesId + '/season/' + seasonNumber + '?language=en-US';

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

export default TVController;
