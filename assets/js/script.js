var userInput = $("#userInput")


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
            var cityName = data.name
            var windMiles = data.wind.speed
            var humidity = data.main.humidity
            var temperature = data.main.temp
            var icon = data.weather[0].icon
            var todaysCard = `<div class="card col-2"> 
        <img src="https://openweathermap.org/img/wn/${icon}.png" class="card-img-top" alt="...">
        <div class="cardInfo">
            <h5> ${cityName} </h5>
            <p>Temperature: ${temperature} </p>
            <p>Wind Speed: ${windMiles} </p>
            <p>Humidity: ${humidity} </p>
        </div>
    </div>`

            currentWeather.append(todaysCard)
        });
}

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
                var windMiles = day.wind.speed;
                var humidity = day.main.humidity;
                var temperature = day.main.temp;
                var icon = day.weather[0].icon
                var fiveDayCard = `<div class="fiveCards col-2"> 
            <img src="https://openweathermap.org/img/wn/${icon}.png" class="card-img">
            <div class="cardInfo">
                <h5>Day ${i / 8 + 1} Weather</h5>
                <p>Temperature: ${temperature} </p>
                <p>Wind Speed: ${windMiles} </p>
                <p>Humidity: ${humidity} </p>
            </div>
        </div>`;

                fiveDayForecast.append(fiveDayCard)
            }
        });
}

function recentSearches(event) {
    var city = userInput.val()
    var searchedCities = JSON.parse(localStorage.getItem("city")) || []
    if (!searchedCities.includes(city)) {
        searchedCities.push(city);
        localStorage.setItem("cities", JSON.stringify(searchedCities));
        console.log(localStorage);
    }
}

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

$("#form").on("submit", function (event) {
    event.preventDefault();
    var city = $(this).find("input").val();
    userLocation(city);
    recentSearches(city);
    displayCities();
});

displayCities()