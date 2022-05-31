//Weather API

var city = "nur-sultan"; //created variable for fast changing of the city


$.getJSON("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=eb74deb125015d2be1894ee6f652d68d&units=metric&lang=ru",
function(data){
  console.log(data); //output of the requested data to the console

var icon = "https://openweathermap.org/img/w/" + data.weather[0].icon + ".png";
var temp = Math.floor(data.main.temp);
var weather = data.weather[0].main;

  $('.icon').attr('src', icon); //connect the data to the html elements
  $('.weather').append(weather);
  $('.temp').append(temp);

}
);


//Currency Exchange API
const settings = {
	"async": true,
	"crossDomain": true,
	"url": "https://currency-exchange.p.rapidapi.com/exchange?from=USD&to=KZT&q=2",

	"method": "GET",
	"headers": {
		"X-RapidAPI-Host": "currency-exchange.p.rapidapi.com",
		"X-RapidAPI-Key": "95a052a075msh6c19965291dcf93p17b0adjsn8e8efed4a0a3"
	}
};

$.ajax(settings).done(function (response) {
	console.log(response); //output of the requested data to the console
  document.getElementById("usd").textContent = Math.floor(response); //connect the data to the html elements
});

const fut = {
	"async": true,
	"crossDomain": true,
	"url": "https://currency-exchange.p.rapidapi.com/exchange?from=EUR&to=KZT&q=1",
	"method": "GET",
	"headers": {
		"X-RapidAPI-Host": "currency-exchange.p.rapidapi.com",
		"X-RapidAPI-Key": "95a052a075msh6c19965291dcf93p17b0adjsn8e8efed4a0a3"
	}
};

$.ajax(fut).done(function (response) {
	console.log(response); //output of the requested data to the console
  document.getElementById("eur").textContent = Math.floor(response); //connect the data to the html elements
});

