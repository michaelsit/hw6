// allows us to read csv files
let csv = require('neat-csv')

// allows us to read files from disk
let fs = require('fs')

// defines a lambda function
exports.handler = async function(event) {
  // write the event object to the back-end console
  console.log(event)

  // read movies CSV file from disk
  let moviesFile = fs.readFileSync(`./movies.csv`)
  
  // turn the movies file into a JavaScript object, wait for that to happen
  let moviesFromCsv = await csv(moviesFile)

  // write the movies to the back-end console, check it out
  console.log(moviesFromCsv)

  // 🔥 hw6: your recipe and code starts here!
  // Provided: code for reading data into a JS object
  // Goal: create a JSON-based API for front-end JS developers to use

  // create a new object to hold the count and movies data
  let moviesToReturn = {}

  // start with an empty Array for the movies
  moviesToReturn.movies = []

  // provided code
  let year = event.queryStringParameters.year
  let genre = event.queryStringParameters.genre
  
  if (year == undefined || genre == undefined) {
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: `Nope!` // a string of data
    }
  }
  else {
    let returnValue = {
      numResults: 0,
      movies: []
    }

    for (let i=0; i < moviesFromCsv.length; i++) {
      // store each movie in memory
      let movie = moviesFromCsv[i]
      // check if querystring parameters are met
      if (movie.startYear == year && movie.genres == genre && movie.genres != `\\N` && movie.runtimeMinutes != `\\N`) {
        
        // create a new movie object containing pertinent fields (primary title, release year, genres)
        let movieData = {
          primaryTitle: movie.primaryTitle,
          releaseYear: movie.startYear,
          genres: movie.genres
        }
                
        // add the movie to the array of movies to return
        moviesToReturn.movies.push(movieData)

      }
    }

    // add numResults to the JSON object
    moviesToReturn.numResults = moviesToReturn.movies.length

    // a lambda function returns a status code and a string of data
    return {
      statusCode: 200, // https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
      body: JSON.stringify(moviesToReturn) // a string of data
    }
  }
}