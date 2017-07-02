
const request = require('request');

class WeatherService {


	constructor(host, username, password){
		this.host = host;
		this.username = username;
		this.password = password;
	}

  forecast(url, qs){
    return new Promise((resolve, reject) =>{

 	        request({
 	            url: this.host+url,
 	            qs: qs,
 	            auth: {username: this.username, password: this.password},
 	            timeout: 30000
 	        }, (error, response, body) => {

 	            if (!error && response.statusCode === 200) {
 	                const response = JSON.parse(body);
 	                resolve(response);
 	            } else {
					let statusCode = (response || {}).statusCode;

 	                console.log('error getting forecast');
 	                console.log('http status code:', statusCode);
 	                console.log('error:', error);
 	                console.log('body:', body);

 	                reject({
 	                    error: true,
 	                    statusCode: statusCode,
 	                    body: body
 	                });
 	            }

 	        });
 	    });
  }

  location (url){

	  return new Promise((resolve, reject) =>{

 	        request({
 	            url: this.host+url,
 	            auth: {username: this.username, password: this.password},
 	            timeout: 30000
 	        }, (error, response, body) => {

 	            if (!error && response.statusCode === 200) {
 	                const response = JSON.parse(body);
 	                resolve(response);
 	            } else {
					let statusCode = (response || {}).statusCode;

 	                console.log('error getting location');
 	                console.log('http status code:', statusCode);
 	                console.log('error:', error);
 	                console.log('body:', body);

 	                reject({
 	                    error: true,
 	                    statusCode: statusCode,
 	                    body: body
 	                });
 	            }

 	        });
 	    });
  }

}


module.exports = WeatherService;
