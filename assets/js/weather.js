$(document).ready(function() {
	var apiKey = '40506dc613c1b32f5843771e00b2e755';

	function theDay(numOfDay) {
		switch(numOfDay) {
      		case 0:
      			return 'Sunday';
      		break;
      		case 1:
      			return 'Monday';
      		break;
      		case 2:
      			return 'Tuesday';
      		break;
      		case 3:
      			return 'Wednesday';
      		break;
      		case 4:
      			return 'Thursday';
      		break;
      		case 5:
      			return 'Friday';
      		break;
      		case 6:
      			return 'Saturday';
      		break;
		}
	}

	function getWeather(location){
		var searchType = typeof(location);
		var root;
		if (searchType === "string") {
			root = "q="
		} else if(searchType === "number") {
			root = "zip="
		}
		var weatherUrl = "http://api.openweathermap.org/data/2.5/weather?"+root+location+"&units=imperial&APPID="+apiKey;
		var forecastUrl = 'http://api.openweathermap.org/data/2.5/forecast/daily?'+root+location+',us&units=imperial&APPID='+apiKey;

		event.preventDefault();
	    $.getJSON(weatherUrl, function(weatherData){
	        console.log(weatherData);
	        currTemp = weatherData.main.temp;
		
		    var canvas = $('#weather-canvas');
		    var context = canvas[0].getContext('2d');

		    var lineWidth = 15;
		    var outterRadius = 70;
		    var innerRadius = outterRadius - lineWidth;
		    var currPerc = 0;
		    var counterClockwise = false;
		    var circ = Math.PI * 2;
		    var quart = Math.PI / 2;
		    context.clearRect(0,0,canvas.width(),canvas.height());

			function animate(current){

				var shadeColor; //hoisted so no need for it

			    if((currPerc) < 32){
			        shadeColor = '#d4f0ff ';
			    }else if(((currPerc) >= 32) && ((currPerc) < 59)){
			        shadeColor = "#129793 ";
			    }else if(((currPerc) >= 59) && ((currPerc) < 75)){
			        shadeColor = "#7cfc00 ";
			    }else if(((currPerc) >= 75) && ((currPerc) < 90)){
			        shadeColor = "#ff6600 ";
			    }else{
			        shadeColor = "#e3170d ";
			    }

			    context.fillStyle = "#ccc";
			    context.beginPath();
			    context.arc(155, 75,innerRadius,0,2*Math.PI,true);
			    context.closePath();
			    context.fill();


			    context.lineWidth = 10;
			    context.strokeStyle = shadeColor;
			    context.beginPath();
			    context.arc(155, 75, outterRadius, -(quart), ((circ) * current) - quart, false);
			    context.stroke();
			    context.font = "42px Myriad Pro";
			    context.fillStyle= "Blue";
			    context.textBaseline = "top";
			    context.fillText(currTemp, 175 - outterRadius, 85 - outterRadius/2);
			    currPerc++;
			    if(currPerc < currTemp){
			        requestAnimationFrame(function(){
			            animate(currPerc / 100);
			        });
			    }

			}

			animate();
			context.closePath();

			var cityName = weatherData.name;
			var weatherDescription = weatherData.weather[0].description;
			var weatherForcast = weatherData.weather[0].main;
			var windSpeed = weatherData.wind.speed;
			var weatherIcon = '<img src="http://openweathermap.org/img/w/'+weatherData.weather[0].icon+'.png" >';
			console.log(cityName+"  "+weatherDescription+"  "+weatherForcast+"  "+windSpeed);

			$('#weather-icon').html(weatherIcon);
			$('#weather-location').html(cityName+'<br />'+weatherDescription);
			$('.wind-arrow img').addClass('rotate');
			$('.rotate').css('transform', 'rotate('+windSpeed+'deg)');

		});

		var today = new Date().getDay();
		console.log("today is: "+theDay(today));
		// get the forcast for the week
		$.getJSON(forecastUrl, function(weatherData) {
			console.log(weatherData);
			$('#weekly-forecast').html('');
			var daysOfWeek = weatherData.list;
			for (var i = 0; i < 5; i++) {
				var html = '';
				var thisDay = (today + i + 1) % 7;
				html += '<div class="daily-forecast">';
					html += '<img src="http://openweathermap.org/img/w/'+daysOfWeek[i].weather[0].icon+'.png" >';
					html += '<span>'+theDay(thisDay)+'</span><br />'+daysOfWeek[i].temp.day;
					html += '<p>'+daysOfWeek[i].weather[0].description+'</p>'
				html += '</div>';


				console.log("temp:"+daysOfWeek[i].temp.day);
				$('#weekly-forecast').append(html);
			};
		});
	}
	$('#location-search').click(function(event) {
		/* Act on the event */	
		var citySearch = $('#weather-location-search').val();
		// getWeather(citySearch);
	});
	// getWeather('Atlanta');
});