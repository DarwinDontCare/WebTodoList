
let date_span = document.getElementById("date_span");
let previous_day_button = document.getElementById("previous_day");
let next_day_button = document.getElementById("next_day");
let todo_input = document.getElementById("todo_input");
let add_todo_button = document.getElementById("add_todo");
let todo_list_element = document.getElementById("todo_list");
let date = new Date();

previous_day_button.addEventListener("click", decrease_day);
next_day_button.addEventListener("click", increase_day);
add_todo_button.addEventListener("click", add_todo);
date_span.textContent = get_current_date();

let current_day_diference = 0;

let todo_list = [];


function increase_day() {
    current_day_diference++;

    date_span.textContent = new Date(date.getFullYear(), date.getMonth(), date.getDate() + current_day_diference).toLocaleDateString();
    load_todo_list();
}

function decrease_day() {
    current_day_diference--;

    date_span.textContent = new Date(date.getFullYear(), date.getMonth(), date.getDate() + current_day_diference).toLocaleDateString();
    load_todo_list();
}

function add_todo() {

    if (todo_input.value == "" || todo_input.value.split(" ").length < 1) {
        return;
    }

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

function get_moon_phase() {

}

function get_current_date() {
    return date.toLocaleDateString();
}

load_todo_list();
