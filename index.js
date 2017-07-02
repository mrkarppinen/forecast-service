
const co = require('co');
const ForecastDB = require('./src/forecast-db.js');
const WeatherService = require('./src/weather-service.js');
const Cloudant = require('cloudant');

function main(params) {

	const lat = params.lat;
	const lon = params.lon;
	const username = params.username;
	const password = params.password;
  const dbUsername = params.dbUsername;
  const dbPassword = params.dbPassword;
  const weatherHost = params.weatherHost;

  const cloudant = Cloudant({account:dbUsername, password:dbPassword, plugin: 'promises'});


  if (cloudant == null)
    throw new Error("Cloudant connection failed.");


  const db = cloudant.db.use('forecasts');
  const forecastDB = new ForecastDB(db);


	const qs = {language: 'en-US', units:  'm'};


	 return co(function* () {
      let weatherService = new WeatherService(weatherHost, username, password);
      let location = yield weatherService.location(`/api/weather/v3/location/point?geocode=${lat}%2C${lon}&language=en-US`);
      let result = yield forecastDB.get(location.location.city);

      if (result == null){

        let data = yield weatherService.forecast(`/api/weather/v1/geocode/${lat}/${lon}/forecast/daily/10day.json`, qs);
        result = yield forecastDB.insert(location.location.city, data);

      }else if ( (result.updated + (60 * 60 * 1000) ) < new Date().getTime() ){

        let data = yield weatherService.forecast(`/api/weather/v1/geocode/${lat}/${lon}/forecast/daily/10day.json`, qs);
        result = yield forecastDB.update(result._id, result._rev, data);

      }

      return {
        location: ((result.id) ? result.id : result._id),
        updated: result.updated,
        body: result.data
      }
   }).then(
     (result) => { return Promise.resolve(result); },
     (err) => { return Promise.reject(err); }
   );

}



exports.main = main;
