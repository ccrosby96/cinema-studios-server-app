import Fuse from 'fuse.js'

const genreMap = {
    "Action": "28",
    "Adventure": "12",
    "Animation": "16",
    "Comedy": "35",
    "Crime": "80",
    "Documentary": "99",
    "Drama": "18",
    "Family": "10751",
    "Fantasy": "14",
    "History": "36",
    "Horror": "27",
    "Music": "10402",
    "Mystery": "9648",
    "Romance": "10749",
    "Scify": "878",
    "Thriller": "53",
    "War": "10752",
    "Western": "37"
}
const trailer = {
    "iso_639_1": "en",
    "iso_3166_1": "US",
    "name": "Official Trailer 2",
    "key": "eQfMbSe7F2g",
    "site": "YouTube",
    "size": 1080,
    "type": "Trailer",
    "official": true,
    "published_at": "2023-04-07T11:57:51.000Z",
    "id": "643093aa6dea3a00b54ea94f"
}
const videoBaseUrls = {
    "YouTube" : "https://www.youtube.com/watch?v=",
    "Vimeo" : "Vimeo: https://vimeo.com/"
}
export function extractTrailer(details) {
    //console.log('data in extractTrailers', videoData);
    const trailers = details.videos.results.filter(item => item.type === "Trailer");
    return trailers;
}
export function generateUrl(filters) {
    let url = 'https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&vote_count.gte=10'

    // handle certification filters
    const certs = filters['ratings']
    console.log(certs);
    const selectedRatings = Object.keys(certs).filter(rating => certs[rating]);
    if (selectedRatings.length === 1) {
        url += '&certification=' + selectedRatings[0]
        url += "&certification_country=US"

    } else if (selectedRatings.length >= 2) {
        const combinedString = selectedRatings.join('|');
        url += '&certification=' + combinedString
        url += "&certification_country=US"
    }
    // handle year range filters
    const sYear = filters['years']['startYear']
    const eYear = filters['years']['endYear']

    const sNum = parseInt(sYear);
    const eNum = parseInt(eYear);

    if (sNum >= 1850 && sNum <= 2024) {
        url += '&primary_release_date.gte='
        url += sYear + '-01-01'
    }
    if (eNum >= 1850 && eNum <= 2024) {
        url += '&primary_release_date.lte='
        url += eYear + '-12-30'
    }
    // handle vote average filter
    let voteAvg = parseInt(filters['score']) / 10
    voteAvg = Math.round(voteAvg)
    const vs = voteAvg.toString()
    url += '&vote_average.gte=' + vs
    // handle genres
    const genres = filters['genre']
    const selectedGenres = Object.keys(genres).filter(rating => genres[rating]);

    if (selectedGenres.length == 1) {
        url += '&with_genres=' + genreMap[selectedGenres[0]]
    } else if (selectedGenres.length >= 2) {
        const mappedArray = selectedGenres.map(g => {
            return genreMap[g]});

        const combined = mappedArray.join(',')

        url += "&with_genres=" + combined

    }
    // handle language
    url += '&with_original_language=en'
    url += '&sort_by=popularity.desc'
    console.log('generated url', url);
    return url
}
export function generateMultiSearchQueryUrl(query) {
    const base = 'https://api.themoviedb.org/3/search/multi?'
    const words = query.split(' ');
    const res = words.join('+')
    const genUrl = base + 'query=' + res + '&include_adult=false&language=en-US';
    return genUrl

}
export function separateMultiSearchResults(data) {
    const results = data.results;
    let movies = [];
    let tv = [];
    let people = [];

    results.forEach((jsonObj) => {
        if (jsonObj.media_type === "movie") {
            movies.push(jsonObj);
        } else if (jsonObj.media_type === "tv") {
            tv.push(jsonObj);
        } else if (jsonObj.media_type === "person") {
            people.push(jsonObj);
        }
    });

    const returnObject = {
        movies: movies,
        tv: tv,
        people: people
    };
    //console.log("returnObject", returnObject)
    return returnObject;
}
export function isValidReview(review) {
    return (
        review &&
        typeof review.author === "string" &&
        typeof review.rating === "number" &&
        typeof review.movieId === "number" &&
        typeof review.body === "string"
    );
}
function compareYears (releaseYear, dataDate) {
    try  {
        const releaseNumber = parseInt(releaseYear);
        const year = dataDate.split("-")[0];
        const resultRelease = parseInt(year);
        const dif = Math.abs(releaseNumber - resultRelease);
        if (dif < 2){
            return true
        }
        return false
    }catch (error){
        return true
    }

}
export function fuzzySearch  (results, query,releaseYear, threshold = 0.3, fieldNormWeight = 0.0) {
    const options = {
        keys: ['title'], // Specify the keys you want to search on
        threshold: threshold, // how close we want it to be
        fieldNormWeight: fieldNormWeight
    };
    const fuse = new Fuse(results, options);
    const filteredResults = fuse.search(query);
    // further filtering, removing duds (0 vote average) and we want release dates to approximately line up
    const finalResults = filteredResults.filter(result => result.item.vote_average !== 0 && compareYears(releaseYear, result.item.release_date));
    // Extract the original items from the results
    const matchedItems = finalResults.map((result) => result.item);
    return matchedItems;
};


