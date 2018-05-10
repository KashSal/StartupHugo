// http.js
// Utility component for performing common HTTP operations on urls. Uses the `request` Node library
// for handling interactions. All functions return promises.

// External
const request = require( 'request' );

const utility = {};
  // Single instance component for function export.

const HTTP_GET_METHOD = "GET";
  // String identifier for HTTP GET method in request.js
const STATUS_CODE_ERROR_RANGE_START = 300;
  // Numeric value representing the beginning of HTTP status code errors. All values
  // above and inclusive (e.g., 300, 301, 404, 500, etc.) indicate some failure.

// Given a url, will perform an HTTP GET operation on the specified url, returning a promise of
// the data present at that URL. Non-200 status codes or error messages returned from the network
// result in rejected promises with additional details. A resolved promise will be converted from
// a string to JSON.
utility.get = function( url )
{
  // Generate object describing the interaction
  const options =
  {
    method : HTTP_GET_METHOD,
    url
  }
  
  // Wrap HTTP request in a promise for better utilization
  return new Promise( ( resolve, reject ) =>
  {
    request( options, ( err, res, body ) =>
    {
      if ( err || res.statusCode >= STATUS_CODE_ERROR_RANGE_START )
      {
        // Reject on any error
        reject( res );
        return;
      }
      
      // Resolve with the body that was parsed
      resolve( JSON.parse( body ) );
    } );
  } );
};

module.exports = utility;
