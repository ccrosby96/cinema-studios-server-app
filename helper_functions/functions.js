
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
    const selectedRatings = Object.keys(certs).filter(rating => certs[rating]);
    console.log(selectedRatings)
    if (selectedRatings.length == 1) {
        url += '&certification=' + selectedRatings[0]
    } else if (selectedRatings.length >= 2) {
        const combinedString = selectedRatings.join('|');
        url += '&certification=' + combinedString
    }
    // handle year range filters
    const sYear = filters['years']['startYear']
    const eYear = filters['years']['endYear']

    const sNum = parseInt(sYear);
    const eNum = parseInt(eYear);

    if (sNum >= 1900 && sNum <= 2023) {
        url += '&primary_release_date.gte='
        url += sYear + '-01-01'
    }
    if (eNum >= 1900 && eNum <= 2023) {
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
    console.log(selectedGenres)
    if (selectedGenres.length == 1) {
        url += '&with_genres=' + genreMap[selectedGenres[0]]
    } else if (selectedGenres.length >= 2) {
        const mappedArray = selectedGenres.map(g => {
            return genreMap[g]});

        const combined = mappedArray.join(',')
        console.log(combined);
        url += "&with_genres=" + combined

    }
    // handle language
    url += '&with_original_language=en'
    url += '&sort_by=popularity.desc'
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

