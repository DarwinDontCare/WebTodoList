let date_span = document.getElementById("date_span");
let previous_day_button = document.getElementById("previous_day");
let next_day_button = document.getElementById("next_day");
let todo_input = document.getElementById("todo_input");
let add_todo_button = document.getElementById("add_todo");
let todo_list_element = document.getElementById("todo_list");
let moon_image = document.getElementById("moon_img");
let bg_video = document.getElementById("space_background");
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
    get_moon_phase(current_latitude, current_longitude);
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

    get_moon_phase(current_latitude, current_longitude);
}

function decrease_day() {
    current_day_diference--;

    date_span.textContent = new Date(date.getFullYear(), date.getMonth(), date.getDate() + current_day_diference).toLocaleDateString();
    load_todo_list();
    get_moon_phase(current_latitude, current_longitude);
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
    li.textContent = content;

    todo_list_element.appendChild(li);
}

function clear_list_elemnts() {
    todo_list_element.textContent = "";
}

function store_todos() {

}

function get_moon_phase(latitude, longitude) {
    /*let url = 'https://api.qweather.com/v7/astronomy/moon?key=a502876bc7a447d0ae71dd8ca73ce6c7&location=' + current_location + '&date='+date_span.textContent.split("/")[2]+date_span.textContent.split("/")[1]+date_span.textContent.split("/")[0];
    console.log(url);
    fetch(url)
    .then(response => {
        return response.json();
    }).then(data => {
        console.log(data);
    })
    .catch(error =>{
        console.log(error);
    })*/

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

    console.log(getLunarPhase());

    set_moon_image(getLunarPhase());

    return getLunarPhase();
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
let posX = -150;

function rotate() {
    if (posX > 150) returning = true;
    else if(posX < -150) returning = false;

    if (returning) {
        moon_image.style.left = posX + "%";
        posX = posX - 1;
    } else {
        moon_image.style.left = posX + "%";
        posX = posX + 1;
    }
    console.log(posX);
}
 

load_todo_list();
