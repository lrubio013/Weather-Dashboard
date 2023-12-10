var userInput = $("#userInput")

// Takes in user input to fetch longitude and latitude for the city 
function userLocation(userInput) {
    var locationURL = `https://api.openweathermap.org/geo/1.0/direct?q=${userInput}&limit=1&appid=bdb6cf4a060450797df7baf3c510b48d`
    fetch(locationURL)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            var lon = data[0].lon
            var lat = data[0].lat
            currentDayCast(lon, lat)
            fiveDayCast(lon, lat)
        });
}

// gets weather for current day 
function currentDayCast(longitude, latitude) {
    var weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=bdb6cf4a060450797df7baf3c510b48d`
    fetch(weatherUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data)
            var currentWeather = $("#currentWeather")
            currentWeather.empty()
            // gets city name, windspeed, humidity, temparature, and weather image from array
            var cityName = data.name
            var windMiles = data.wind.speed
            var humidity = data.main.humidity
            var temperature = data.main.temp
            var icon = data.weather[0].icon
            // Creates the weather card
            var todaysCard = `<div class="card col-2"> 
        <img src="https://openweathermap.org/img/wn/${icon}.png" class="card-img-top" alt="...">
        <div class="cardInfo">
            <h5> ${cityName} </h5>
            <p>Temperature: ${temperature} </p>
            <p>Wind Speed: ${windMiles} </p>
            <p>Humidity: ${humidity} </p>
        </div>
    </div>`
            // Will append the current day card to the website
            currentWeather.append(todaysCard)
        });
}

//Gets 5 day forecast of a city
function fiveDayCast(longitude, latitude) {
    var weatherUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=bdb6cf4a060450797df7baf3c510b48d`;
    fetch(weatherUrl)
        .then(function (response) {
            return response.json();
        })

        .then(function (data) {
            var fiveDayForecast = $("#fiveDayForecast")
            fiveDayForecast.empty()
            console.log(data)
            for (var i = 0; i < data.list.length; i += 8) {
                var day = data.list[i]
                console.log(day)
                //Will get windspeed, humidity, temparature, and image from array for the next five days
                var windMiles = day.wind.speed;
                var humidity = day.main.humidity;
                var temperature = day.main.temp;
                var icon = day.weather[0].icon
                //Will make 5 cards for the 5 day forecasts
                var fiveDayCard = `<div class="fiveCards col-2"> 
            <img src="https://openweathermap.org/img/wn/${icon}.png" class="card-img">
            <div class="cardInfo">
                <h5>Day ${i / 8 + 1} Weather</h5>
                <p>Temperature: ${temperature} </p>
                <p>Wind Speed: ${windMiles} </p>
                <p>Humidity: ${humidity} </p>
            </div>
        </div>`;
                // Will append the forecast of the next five days to the website
                fiveDayForecast.append(fiveDayCard)
            }
        });
}

// Will remember your recent searches
function recentSearches(event) {
    var city = userInput.val()
    var searchedCities = JSON.parse(localStorage.getItem("city")) || []
    if (!searchedCities.includes(city)) {
        searchedCities.push(city);
        localStorage.setItem("cities", JSON.stringify(searchedCities));
        console.log(localStorage);
    }
}

// Will take your recent searches and saves them as buttons for easy access
function displayCities() {
    $("#recentSearch").empty()
    var cities = JSON.parse(localStorage.getItem("cities")) || []
    cities.forEach(function (city) {
        var button = $("<button>").text(city).addClass("btn btn-secondary");
        button.click(function (event) {
            console.log(event.target.textContent);
            userLocation(event.target.textContent);
        });

        $("#recentSearch").append(button);
    });
};

//Initializes application once you search for city
$("#form").on("submit", function (event) {
    event.preventDefault();
    var city = $(this).find("input").val();
    userLocation(city);
    recentSearches(city);
    displayCities();
});

displayCities()