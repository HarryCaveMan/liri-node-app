require('dotenv').config();
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require('fs');
const keys = require('./keys.js');

var queryString = process.argv.slice(2); //splits args off of process.argv array
var params = {screen_name: 'HarryDeTweeter'};
var spotify = new Spotify(keys.spotify);
var twitter = new Twitter(keys.twitter);

function processQuery(querString){

   console.log(''); //blank line for aesthetics

   if(querString[0] === 'my-tweets'){  //if they wanted tweets
      twitter.get('statuses/user_timeline', params, function(error, tweets, response) {

         if (!error) {
            for(let i=0 ; i<tweets.length ; i++){
               console.log(tweets[i].text);  //print tweet text
            }
         }
         else{
            console.log('Twitter API error: '+JSON.stringify(error)); //log any errors
         }
      });
   }else if(querString[0] === 'spotify-this-song'){ //if they want spotify

      spotify.search({ type: 'track', query: querString[1].replace(/\"/g,"") }, function(err, data) {  //format query
         if (err) {
            return console.log('Error occurred: ' + err);  //log errors
         }
         for(let i=0 ; i<data.tracks.items.length ; i++){

          console.log('');
             console.log(data.tracks.items[i].name); //display data
             console.log(data.tracks.items[i].artists[0].name);
             console.log(data.tracks.items[i].album.name);
             console.log(data.tracks.items[i].track_number);
          }
       });
   }else if (querString[0] === 'movie-this'){ //if they want OMDB
      /*
      * Title of the movie.
      * Year the movie came out.
      * IMDB Rating of the movie.
      * Rotten Tomatoes Rating of the movie.
      * Country where the movie was produced.
      * Language of the movie.
      * Plot of the movie.
      * Actors in the movie.
      */
      request.get('http://www.omdbapi.com/?apikey='+keys.OMDB+'&t='+querString[1].replace(/\"/g,''),
         function(error,response,body){
            if(response.statusCode == 200){
               let movie = JSON.parse(body);
               console.log('Title: '+ movie.Title);
               console.log('Year: '+ movie.Year);
               console.log('IMDB rating: '+ movie.Ratings[0].Value);
               console.log('Rotten Tomatoes: '+ movie.Ratings[1].Value);
               console.log('Countries: '+ movie.Country);
               console.log('Languages: '+ movie.Language);
               console.log('');
               console.log('Plot:');
               console.log(movie.Plot);
               console.log('');
               console.log('Actors: '+ movie.Actors);

            }else{
               console.log('error: '+ response.statusCode);
               console.log(body);
            }

         });
   }
   console.log('');
}


if(queryString[0] === 'do-what-it-says'){
   fs.readFile('random.txt', 'utf8', (err,data) => {
      if (err) throw err;
      for (let i=0 ; i<data.split('\n').length ; i++){
         processQuery(data.split('\n')[i].split(' '));
      }
   });
}else{
   processQuery(queryString);
}







