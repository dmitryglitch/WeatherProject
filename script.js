const myApiKey = "eddc08931dade2859f6526e9623a51ad";
const city = "Toyohira";

let currentTemp = document.getElementById("currentTemp");
let minCurrentTemp = document.getElementById("minCurrentTemp");
let maxCurrentTemp = document.getElementById("maxCurrentTemp");
let currentCity = document.getElementById("currentCity");
let citySelector = document.getElementById("topBarCB");

const currentWeatherApiUrl = "http://api.openweathermap.org/data/2.5/weather?q="
    + city
    + "&appid="
    + myApiKey;

onload = function () {

    // получаем текущую температуру.
    getCurrentTemp(currentWeatherApiUrl);

    // получаем локальный файл JSon для создания списка всех городов.
    getLocalJSonFile("/WeatherProject/json/city.list.json")
};

// функция срабатывающая при изменения значения в селекторе.
function onChangeCity(){

    let newApiUrl = "http://api.openweathermap.org/data/2.5/weather?q="
        + citySelector.value
        + "&appid="
        + myApiKey;

    // генерируем данные о текущей температуре
    getCurrentTemp(newApiUrl)
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
                currentCity.innerHTML = "Город: " + json.name.toString();

                // задаем значение текущей температуры
                currentTemp.innerHTML = "Текущая температура: "
                    + getTempCelsius(json.main.temp.toString());

                // задаем значений минимальной температуры на сегодня
                minCurrentTemp.innerHTML = "Минимальная температура на сегодня: "
                    + getTempCelsius(json.main.temp_min.toString());

                // задаем значений максимальной температуры на сегодня
                maxCurrentTemp.innerText = "Максимальная температура на сегодня: "
                    + getTempCelsius(json.main.temp_max.toString());
            } else {
                console.error(xhrTemp.statusText);
            }
        }
    };
    xhrTemp.onerror = function (e) {
        console.error(xhrTemp.statusText);
    };
}

// функция для получения локального json-файла
function getLocalJSonFile(path) {
    const xhrCityList = new XMLHttpRequest();

    // получаем список городов из локального json
    xhrCityList.onreadystatechange = function () {
        if (xhrCityList.readyState === XMLHttpRequest.DONE) {
            if (xhrCityList.status === 200) {
                let jsonCity = JSON.parse(xhrCityList.response);
                console.log(jsonCity);

                // c помощью цикла заполняем список городов в селектор
                jsonCity.forEach(function (item, i){
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

function getTempCelsius(temp) {
    let myCelsiusTemp = temp - 273.15;
    return myCelsiusTemp.toFixed(1) + "°C";
}
