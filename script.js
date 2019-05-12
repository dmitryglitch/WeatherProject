const myApiKey = "93d533f8c2c54817bbe111226193004";
const myApiForIp = "https://json.geoiplookup.io/";

// IP
const currentMyIp = document.getElementById("myApiAddress");
const currentMyNamePc = document.getElementById("myNamePc");
const currentMyNameTimeZone = document.getElementById("myNameTimeZone");
const currentMyProvider = document.getElementById("myProvider");
const currentMyHabitaZone = document.getElementById("myHabitatZone");
const currentMyLongitude = document.getElementById("myLongitude");
const currentMyLatitude = document.getElementById("myLatitude");

// Temperature
const currentTemp = document.getElementById("currentTemp");
const currentWind = document.getElementById("currentWind");
const currentFeelsLikeTemp = document.getElementById("feelsLikeTemp");
const currentCity = document.getElementById("currentCity");
const weatherBarContainer = document.getElementById("weatherBarContainer");
const currentPressure = document.getElementById("currentPressure");
const currentHumidity = document.getElementById("currentHumidity");

const citySelector = document.getElementById("topBarCB");

const city = "Toyohira";

const currentWeatherApiUrl = "http://api.apixu.com/v1/current.json?"
    + "key="
    + myApiKey
    + "&q="
    + city;


const forecastWeatherApiUrl = "http://api.apixu.com/v1/forecast.json?"
    + "key="
    + myApiKey
    + "&q="
    + city
    + "&days=7";

// функция срабатывающая при полной загрузки страницы
onload = function () {

    // получаем информацию по ip
    getMyIpInfo(myApiForIp);

    // получаем текущую температуру.
    getCurrentTemp(currentWeatherApiUrl);

    // получаем локальный файл JSon для создания списка всех городов.
    getCityList("/WeatherProject/json/city.list.json");

    // получаем температуру на 7 дней
    getWeatherForecast(forecastWeatherApiUrl);
};

// функция срабатывающая при изменения значения в селекторе.
citySelector.onchange = function () {

    const newCurrentWeatherApiUrl = "http://api.apixu.com/v1/current.json?"
        + "key="
        + myApiKey
        + "&q="
        + citySelector.value;

    const newForecastWeatherApiUrl = "http://api.apixu.com/v1/forecast.json?"
        + "key="
        + myApiKey
        + "&q="
        + citySelector.value
        + "&days=7";

    // генерируем данные о текущей температуре
    getCurrentTemp(newCurrentWeatherApiUrl);

    /*
    * генерируем данные о погоде на 7 дней
    * сначала очищаем весь список содержащихся элементов
    * и только потом подставляем новые
    */
    deleteAllElements();
    getWeatherForecast(newForecastWeatherApiUrl);
};

// функция для получения данных по IP
function getMyIpInfo(url) {
    const xhrIp = new XMLHttpRequest();

    xhrIp.open('GET', url, true);
    xhrIp.send();
    xhrIp.onload = function () {
        if (xhrIp.readyState === 4) {
            if (xhrIp.status === 200) {
                let jsonIp = JSON.parse(xhrIp.responseText);
                console.log(jsonIp);

                // задаем значение ip
                currentMyIp.innerHTML = jsonIp.ip;

                // задаем значение имени компьютера
                currentMyNamePc.innerHTML = jsonIp.hostname;

                // задаем значение имени часового пояса
                currentMyNameTimeZone.innerHTML = jsonIp.timezone_name;

                // задаем значение провайдера
                currentMyProvider.innerHTML = jsonIp.asn_org;

                // задаем значение месту проживания
                currentMyHabitaZone.innerHTML = jsonIp.country_name + ", " + jsonIp.city;

                // задаем значение долготе
                currentMyLongitude.innerHTML = jsonIp.longitude;

                // задаем значение широте
                currentMyLatitude.innerHTML = jsonIp.latitude;
            }
        }
    }
}

// функция для получения данных о текущей температуре
function getCurrentTemp(url) {

    const xhrTemp = new XMLHttpRequest();

    xhrTemp.open('GET', url, true);
    xhrTemp.send();
    xhrTemp.onload = function () {
        if (xhrTemp.readyState === 4) {
            if (xhrTemp.status === 200) {
                let json = JSON.parse(xhrTemp.responseText);
                console.log(json);

                // задаем значение текущего города
                currentCity.innerHTML = "Погода в городе " + json.location.name.toString();

                // задаем значение текущей температуры
                currentTemp.innerHTML = json.current.temp_c.toString() + "°C";

                // задаем значений скорости ветра
                currentWind.innerHTML = "Скорость ветра: " + json.current.wind_kph.toString() + "км/ч";

                // задаем значение давления
                currentPressure.innerHTML = "Давление " + json.current.pressure_mb.toString() + "мм рт. ст";

                // задаем значения влажности
                currentHumidity.innerHTML = "Влажность " + json.current.humidity.toString() + "%"

                // задаем значений температуры как она ощущается
                currentFeelsLikeTemp.innerText = "Ощущается как: " + json.current.feelslike_c.toString() + "°C";
            } else {
                console.error(xhrTemp.statusText);
            }
        }
    };
    xhrTemp.onerror = function (e) {
        console.error(xhrTemp.statusText);
    };
}

// функция для получения данных о температуры за 7 дней
function getWeatherForecast(url) {

    const xhrForecastTemp = new XMLHttpRequest();

    xhrForecastTemp.open('GET', url, true);
    xhrForecastTemp.send();

    xhrForecastTemp.onload = function () {
        if (xhrForecastTemp.readyState === 4) {
            if (xhrForecastTemp.status === 200) {
                let json = JSON.parse(xhrForecastTemp.responseText);
                console.log(json);

                // с помощью json формируем прогноз на 7 дней
                json.forecast.forecastday.forEach(function (item, i) {

                    let newDiv = document.createElement("div");
                    newDiv.className = "day" + i;
                    newDiv.id = "day" + i;

                    let image = "<img src=image/weather/64x64/day/"
                        + item.day.condition.icon.substring(item.day.condition.icon.length - 7) + ">";

                    newDiv.innerHTML = image
                        + "<span>Дата: </span>" + "<span><b>" + item.date + "</b></span>"
                        + "<span>Днем: </span>" + "<span><b>" + item.day.maxtemp_c + "°C" + "</b></span>"
                        + "<span>Ночью: </span>" + "<span><b>"+ item.day.mintemp_c + "°C" + "</b></span>";

                    weatherBarContainer.appendChild(newDiv);
                });
            } else {
                console.error(xhrForecastTemp.statusText);
            }
        }
    };
}


// функция для получения списка городов из локального json-файла
function getCityList(path) {
    const xhrCityList = new XMLHttpRequest();

    // получаем список городов из локального json
    xhrCityList.onreadystatechange = function () {
        if (xhrCityList.readyState === XMLHttpRequest.DONE) {
            if (xhrCityList.status === 200) {
                let jsonCity = JSON.parse(xhrCityList.response);
                console.log(jsonCity);

                // c помощью цикла заполняем список городов в селектор
                jsonCity.forEach(function (item, i) {
                    citySelector.options[i] = new Option(item.name)
                })

            } else {
                console.error(xhrCityList.statusText);
            }
        }
    };
    xhrCityList.open("GET", path, true);
    xhrCityList.send();
}

// функция для удаления всех элементов из weatherBar
function deleteAllElements() {
    for (let i = 0; i < 7; i++) {
        let day = document.getElementById("day" + i);
        day.parentNode.removeChild(day);
    }
}