// server.js
// Entry point for the backend service

// External
const express = require('express');

// Local
const http = require( './utilities/http' );

const app = express();
  // Generate an express server instance

// Urls for json blobs stored at WithHugo.com
const URLS =
{
  STATE_POVERTY_JSON : "https://static.withhugo.com/tests/data/poverty.json",
    // Url containing information about poverty data per-state
  STATE_POPULATION_JSON : "https://static.withhugo.com/tests/data/population.json"
    // Url containing information about populations per-state
};

// Setup serving of public assets (styles, html, etc.)
app.use( express.static( 'public' ) );

// Define root access to the URL as forwarding to the index.html document
app.get( "/", ( request, response ) =>
{ 
  response.sendFile( __dirname + '/views/index.html' );
});

// Define health endpoint -- useful for determining if the service is up and operational
app.get( "/health", ( request, response ) =>
{
  response.send( { status : "OK", data : { isHealthy : true } } );
} );

// Setup listening on appropriate port for Glitch.com
const listener = app.listen( process.env.PORT, () =>
{
  console.log( 'Service initialized on port:', listener.address().port );
});

// Immediately grab poverty data from the supplied url
http.get( URLS.STATE_POVERTY_JSON )
.then( povertyData =>
{
  console.log( "Got poverty data, AZ:", povertyData.AZ );
} );
