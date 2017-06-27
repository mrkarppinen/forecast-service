
const request = require('request');

class WeatherService {

  doRequest(url, username, password, qs){
    return new Promise(function(resolve, reject) {

 	        request({
 	            url: url,
 	            qs: qs,
 	            auth: {username: username, password: password},
 	            timeout: 30000
 	        }, (error, response, body) => {

 	            if (!error && response.statusCode === 200) {
 	                const response = JSON.parse(body);
 	                resolve(response);
 	            } else {
 	                console.log('error getting forecast');
 	                console.log('http status code:', (response || {}).statusCode);
 	                console.log('error:', error);
 	                console.log('body:', body);

 	                reject({
 	                    error: error,
 	                    response: response,
 	                    body: body
 	                });
 	            }

 	        });
 	    });
  }


}


module.exports = WeatherService;
