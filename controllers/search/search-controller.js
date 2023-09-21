import fetch from "node-fetch";
import {generateUrl,generateMultiSearchQueryUrl,separateMultiSearchResults} from "../../helper_functions/functions.js";

const MultiSearchController = (app) => {
    app.get('/api/search/multi/:q', GetMultiSearch)
}

const GetMultiSearch = async (req, res) => {

    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyYmVmMWFmMmU0MjNiMWJmYmZhMTg0OTdmZjc4NjgyYyIsInN1YiI6IjY0OWM3MDJmOTYzODY0MDBlM2JiYmQzNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.BoWbYh_OmN5NotCpDs_emUlVPUJCHvR7YvbeJrV1cCw'
        }
    };


    const query = req.params.q
    console.log('multi query received on server: ',query)

    const cacheUrl = generateMultiSearchQueryUrl(query);
    const queryUrl = cacheUrl +'&page=1'
    console.log('generated queryUrl: ',queryUrl);

    try {
        const response = await fetch(queryUrl, options);

        if (!response.ok) {
            throw new Error("Failed to fetch actor data")
        }

        const data = await response.json();

        const results = separateMultiSearchResults(data)
        data.url = cacheUrl;
        data.results = results;

        //console.log('data returned from generated queryUrl', data)

        return res.status(200).json(data);
    }catch (error) {
        return res.status(500).json({error : error.message});

    }
}
export default MultiSearchController;
