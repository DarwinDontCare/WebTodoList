let date_span = document.getElementById("date_span");
let previous_day_button = document.getElementById("previous_day");
let next_day_button = document.getElementById("next_day");
let todo_input = document.getElementById("todo_input");
let add_todo_button = document.getElementById("add_todo");
let todo_list_element = document.getElementById("todo_list");
let moon_image = document.getElementById("moon_img");
let bg_video = document.getElementById("space_background");
let moon_phase_text = document.getElementById("moon_phase_text");
let temperature_text = document.getElementById("clima_text");
let date = new Date();
let current_location = "";
let current_latitude = 0;
let current_longitude = 0;

previous_day_button.addEventListener("click", decrease_day);
next_day_button.addEventListener("click", increase_day);
add_todo_button.addEventListener("click", add_todo);
date_span.textContent = get_current_date();

var interval = setInterval(function(){
    var countForVideo = document.querySelector("video").readyState;
    if(countForVideo == 4){
      document.querySelector("video").play();
      clearInterval(interval);
    }
  },2000);

let current_day_diference = 0;

navigator.geolocation.getCurrentPosition(get_location);

let todo_list = [];


function increase_day() {
    current_day_diference++;

    date_span.textContent = new Date(date.getFullYear(), date.getMonth(), date.getDate() + current_day_diference).toLocaleDateString();
    load_todo_list();
    get_moon_phase();
}

function get_location(result) {
    let longitude = result["coords"]["longitude"] + "";
    let latitude = result["coords"]["latitude"] + "";

    current_latitude = result["coords"]["latitude"];
    current_longitude = result["coords"]["longitude"];

    longitude = longitude.split(".")[0] + "." + longitude.split(".")[1].substring(0, 2);
    latitude = latitude.split(".")[0] + "." + latitude.split(".")[1].substring(0, 2);

    current_location = latitude + "," + longitude;
    console.log(current_location);

    console.log(current_latitude, current_longitude);

    get_moon_phase();
    getClimaInfo(latitude, longitude);
}

function decrease_day() {
    current_day_diference--;

    date_span.textContent = new Date(date.getFullYear(), date.getMonth(), date.getDate() + current_day_diference).toLocaleDateString();
    load_todo_list();
    get_moon_phase();
}

function add_todo() {

    var canContinue = false;

    if (todo_input.value == "") {
        return;
    }

    for (var i = 0; i < todo_input.value.split(" ").length; i++) {
        if (!todo_input.value.split(" ")[i] == "") canContinue = true;
    }

    if (!canContinue) return;

    if (todo_list.length < 1) {
        let new_list = {
            "date" : date_span.textContent,
            "list" : [todo_input.value]
        }
        todo_list.push(new_list);
    } else {
        let list_index = -1;

        for (var i = 0; i < todo_list.length; i++) {
            if (todo_list[i]["date"] == date_span.textContent) {
                list_index = i;
                break
            }
        }

        if (list_index > -1) {
            todo_list[list_index]["list"].push(todo_input.value);
        } else {
            let new_list = {
                "date" : date_span.textContent,
                "list" : [todo_input.value]
            }
            todo_list.push(new_list);
        }
    }
    create_list_element(todo_input.value);

    todo_input.value = "";

    //console.log(todo_list);
}

function load_todo_list() {
    if (todo_list_element.hasChildNodes()) clear_list_elemnts();

    for (var i = 0; i < todo_list.length; i++) {
        if (todo_list[i]["date"] == date_span.textContent) {
            for (var l = 0; l < todo_list[i]["list"].length; l++) {
                create_list_element(todo_list[i]["list"][l]);
            }
        }
    }
}

function create_list_element(content) {
    let li = document.createElement("li");
    li.className = "list_item";
    li.addEventListener("click", remove_todo);
    let span = document.createElement("span");
    span.textContent = content;
    li.appendChild(span);

    todo_list_element.appendChild(li);
}

function clear_list_elemnts() {
    todo_list_element.textContent = "";
}

function remove_todo(event) {
    if (event.target.nodeName === "LI") {
        for (var i = 0; i < todo_list.length; i++) {
            if (todo_list[i]['date'] == date_span.textContent) {
                todo_list[i]['list'].splice(todo_list[i]['list'].indexOf(event.target.textContent), todo_list[i]['list'].indexOf(event.target.textContent));
                event.target.remove();
                break;
            }
        }
    }
}

function store_todos() {

}

function getClimaInfo(latitude, longitude) {
    let url = 'https://api.open-meteo.com/v1/forecast?latitude='+latitude+'&longitude='+longitude+'&current_weather=true';
    console.log(url);
    fetch(url)
    .then(response => {
        return response.json();
    }).then(data => {
        temperature_text.textContent = "Current Temperature: " + data['current_weather']['temperature'] + "°";
        console.log(data);
    })
    .catch(error =>{
        console.log(error);
    })
}

function get_moon_phase() {

    const getJulianDate = (dates = new Date(date.getFullYear(), date.getMonth(), date.getDate() + current_day_diference)) => {
        const time = dates.getTime();
        const tzoffset = dates.getTimezoneOffset()
        
        return (time / 86400000) - (tzoffset / 1440) + 2440587.5;
    }

    const LUNAR_MONTH = 29.530588853;
    const getLunarAge = (dates = new Date(date.getFullYear(), date.getMonth(), date.getDate() + current_day_diference)) => {
        const percent = getLunarAgePercent(dates);
        const age = percent * LUNAR_MONTH;
        return age;
    }

    const getLunarAgePercent = (dates = new Date(date.getFullYear(), date.getMonth(), date.getDate() + current_day_diference)) => {
        return normalize((getJulianDate(dates) - 2451550.1) / LUNAR_MONTH);
    }
    const normalize = value => {
        value = value - Math.floor(value);
        if (value < 0)
            value = value + 1
        return value;
    }

    const getLunarPhase = (dates = new Date(date.getFullYear(), date.getMonth(), date.getDate() + current_day_diference)) => {
        const age = getLunarAge(dates);
        if (age < 6.52923262990685)
          return "Waxing Crescent";
        else if (age < 8.529232629905762)
          return "First Quarter";
        else if (age < 14.529232629905854)
          return "Waxing Gibbous";
        else if (age < 15.52923262990699)
          return "Full";
        else if (age < 20.529232629905948)
          return "Waning Gibbous";
        else if (age < 20.99361)
          return "Last Quarter";
        else if (age < 27.68493)
          return "Waning Crescent";
        else if (age < 29.059821482907303)
          return "New";
        return "New";
    }

    var phase = getLunarPhase();

    console.log(phase);

    set_moon_image(phase);

    moon_phase_text.textContent = "Moon Phase: " + phase;

    return phase;
}

function set_moon_image(moon_phase) {
    if (moon_phase == "Waxing Crescent")
        moon_image.src = "../assets/images/waxing_crescent.png";
    else if (moon_phase == "First Quarter")
        moon_image.src = "../assets/images/first_quarter.png";
    else if (moon_phase == "Waxing Gibbous")
        moon_image.src = "../assets/images/waxing_gibbous.png";
    else if (moon_phase == "Full")
        moon_image.src = "../assets/images/full_moon.png";
    else if (moon_phase == "Waning Gibbous")
        moon_image.src = "../assets/images/waning_gibbous.png";
    else if (moon_phase == "Last Quarter")
        moon_image.src = "../assets/images/third_quarter.png";
    else if (moon_phase == "Waning Crescent")
        moon_image.src = "../assets/images/waning_crescent.png";
    else if (moon_phase == "New")
        moon_image.src = "../assets/images/new_moon.png";
}

function degToRad(degrees) {
  var pi = Math.PI;
  return degrees * (pi/180);
}

function radToDeg(radians) {
  var pi = Math.PI;
  return radians * (180/pi);
}

function get_current_date() {
    return date.toLocaleDateString();
}

let returning = false;

function rotate() {
    current_velocityX = Math.cos(degToRad(current_degree)) * 150;
    current_velocityY = (Math.sin(degToRad(current_degree)) * 30) + 20;
    current_size = (5 + (current_velocityY * 0.05));

    moon_image.style.left = current_velocityX + "%";
    moon_image.style.top = current_velocityY + "%";
    moon_image.style.width = current_size + "rem";
    moon_image.style.height = current_size + "rem";

    current_degree += 0.5;
    current_degree = current_degree % 360;

    if (current_degree < 180) {
        moon_image.style.zIndex = 2;
    } else {
        moon_image.style.zIndex = 1;
    }
}

var current_velocityX = 0.1;
var current_velocityY = 0.1;

var current_size = 5;

var current_degree = 0;

var intervalId = window.setInterval(function(){
    rotate();
}, 10);  

load_todo_list();
