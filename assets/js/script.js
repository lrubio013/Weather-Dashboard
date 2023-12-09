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

