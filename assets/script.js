//grab city-submit form / city-history element / city-display element / 5-day-forecast element
const cityInput = $('#city-input');
const cityForm = $('#city-form');
const cityHistory = $('#city-history');
const currentDisplay = $('#weather-current');
const forecastDisplay = $('#weather-forecast');

//handle-submit / when user submits, get input from form, search lat/long based on name, add city + lat/long to history
function handleFormSubmit(event){
    event.preventDefault();
    const cityName = cityInput.val().trim();
    cityInput.val("");

    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=26e6654053a3f70f24251088f54026d0`

    fetch(url).then(function (response){
        if(response.ok){
            response.json().then(function (data){
                const city = {
                    name: cityName,
                    lat: data[0].lat,
                    lon: data[0].lon,
                };
                saveCities(city);
                displayCities();
                displayWeather(city.lat, city.lon);
                displayForecast(city.lat, city.lon);
                
            });
        }
    });
}

//get saved cities from storage
function getCities(){
    const storedCities = JSON.parse(localStorage.getItem('cities'));
    if(storedCities !== null){
        return storedCities;
    }else{
        const emptyCity = [];
        return emptyCity;
    }
}

//save cities in storage
function saveCities(cities){
    const tempCities = getCities();
    tempCities.push(cities);
    localStorage.setItem('cities', JSON.stringify(tempCities));
}

//loop through local storage and create city cards - add to city-history div
function displayCities(){
    cityHistory.empty();
    const tempCities = getCities();
    tempCities.forEach((city, i) => {
        const cityCard = $('<div>');
        cityCard.attr('class', 'city-card text-align-center');
        cityCard.attr('data-id', i);
        cityCard.text(city.name);
        cityHistory.append(cityCard);
    });
}

//displayWeather function to create card object for current weather + cards for 5 day forecast
//logic to check weather and use correct icon on card during creation


//display city current weather
function displayWeather(lat, lon){
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=26e6654053a3f70f24251088f54026d0&units=imperial`
    fetch(url).then(function (response){
        if(response.ok){
            response.json().then(function (data){
                console.log(data);
                const weatherCard = $('<div>');
                const cityName = $('<h2>');
                const curDate = dayjs().format("M/DD/YYYY");
                const weatherIcon = $('<img>');
                weatherIcon.attr('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
                cityName.text(data.name + " (" + curDate + ")");
                cityName.append(weatherIcon);
                const curTemp = $('<p>');
                curTemp.text("Temp: " + data.main.temp + " °F")
                const curWind = $('<p>');
                curWind.text("Wind: " + data.wind.speed + " MPH");
                const curHumidity = $('<p>');
                curHumidity.text("Humidity: " + data.main.humidity + " %");

                weatherCard.append(cityName, curTemp, curWind, curHumidity);
                currentDisplay.append(weatherCard);
            });
        }
    });
}

//display city 5 day forecast
function displayForecast(lat, lon){
    const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=26e6654053a3f70f24251088f54026d0&units=imperial`
    fetch(url).then(function (response){
        if(response.ok){
            response.json().then(function (data){
                console.log(data);
                for(i = 0; i < 5; i++){
                    const forecastCard = $('<div>');
                    const forecastDate = dayjs().add(i, 'day').format("M/DD/YYYY");
                    
                }
            });
        }
    });
}

//event listener for city-history element / delegate to parent, on city click / call displayWeather

cityForm.on('submit', handleFormSubmit);
cityHistory.on('click', '.city-card', function(){
    cityID = $(this).attr('data-id');
    savedCities = getCities();
    displayWeather(savedCities[cityID].lat, savedCities[cityID].lon);
    displayForecast(savedCities[cityID].lat, savedCities[cityID].lon);
});
