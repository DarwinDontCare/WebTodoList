let date_span = document.getElementById("date_span");
let previous_day_button = document.getElementById("previous_day");
let next_day_button = document.getElementById("next_day");
let todo_input = document.getElementById("todo_input");
let add_todo_button = document.getElementById("add_todo");
let todo_list_element = document.getElementById("todo_list");
let date = new Date();
let current_location = "";
let current_latitude = 0;
let current_longitude = 0;

previous_day_button.addEventListener("click", decrease_day);
next_day_button.addEventListener("click", increase_day);
add_todo_button.addEventListener("click", add_todo);
date_span.textContent = get_current_date();

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
    current_longitude = result["coords"]["latitude"];

    longitude = longitude.split(".")[0] + "." + longitude.split(".")[1].substring(0, 2);
    latitude = latitude.split(".")[0] + "." + latitude.split(".")[1].substring(0, 2);

    current_location = latitude + "," + longitude;
    console.log(current_location);
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
        if (age < 1)
          return "New";
        else if (age < 6)
          return "Waxing Crescent";
        else if (age < 9)
          return "First Quarter";
        else if (age < 9.91963)
          return "Waxing Gibbous";
        else if (age < 12.61096)
          return "Full";
        else if (age < 26.30228)
          return "Waning Gibbous";
        else if (age < 20.99361)
          return "Last Quarter";
        else if (age < 27.68493)
          return "Waning Crescent";
        return "New";
    }

    let jd = getJulianDate(new Date(date.getFullYear(), date.getMonth(), date.getDate() + current_day_diference));
 
    // Calculate the moon's mean longitude
    let L = (218.316 + 13.176396 * jd) % 360;

    // Calculate the moon's mean anomaly
    let M = (134.963 + 13.064993 * jd) % 360;

    // Calculate the moon's argument of latitude
    let F = (93.272 + 13.229350 * jd) % 360;

    // Calculate the moon's ecliptic latitude and longitude
    let l = L + 6.289 * Math.sin(degToRad(M));
    let b = 5.128 * Math.sin(degToRad(F));
    let r = 385001 - 20905 * Math.cos(degToRad(M));

    // Calculate the moon's equatorial coordinates
    let obl = 23.439 - 0.0000004 * jd;
    let x = r * Math.cos(degToRad(l));
    let y = r * Math.cos(degToRad(obl)) * Math.sin(degToRad(l));
    let z = r * Math.sin(degToRad(obl)) * Math.sin(degToRad(l));

    // Calculate the moon's right ascension and declination
    let ra = Math.atan2(y, x);
    let dec = Math.asin(z / r);

    // Calculate the moon's phase angle
    let lst = (100.46 + 0.985647352 * jd + longitude) % 360;
    let ha = (lst - ra) % 360;
    let phase_angle = radToDeg(Math.acos(Math.sin(degToRad(latitude)) * Math.sin(degToRad(dec)) + Math.cos(degToRad(latitude)) * Math.cos(degToRad(dec)) * Math.cos(degToRad(ha))));

    console.log(phase_angle);

    // Determine the phase of the moon
    let moon_phase = () => {
        if (phase_angle < 40.45219687299393) return "Third Quarter";
        else if (phase_angle < 38.97302550297881) return "Waning Crescent";
        else if (phase_angle < 44.30537803075693) return "Waning Gibbous";
        else if (phase_angle < 45.09064045201295) return "Full Moon";
        else if (phase_angle < 49.66329584557519) return "Waxing Gibbous";
        else if (phase_angle < 51.118969848435746) return "First Quarter";
        else if (phase_angle < 61.85157598461518) return "Waxing Crescent";
        else if (phase_angle < 63) return "New Moon";
        else return "Full Moon";
    }

    console.log(moon_phase());

    return getLunarPhase();
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

load_todo_list();
