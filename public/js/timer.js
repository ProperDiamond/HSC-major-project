const timer = document.getElementById("time_view_text")
const start_pause = document.getElementById("start_pause")
const restart = document.getElementById("restart")
start_pause.setAttribute("data-id", 0);
const hours = document.getElementById("hours")
const minutes = document.getElementById("minutes")


var timer_on = false;
let total_time
var current_time_hours = 0
var current_time_minutes = 25
total_time = hours.value * 60 * 60 + minutes.value * 60
restart.setAttribute("fill", "gray") 


start_pause.addEventListener("click", () =>{
    
    if(start_pause.dataset.id == 0){
        restart.setAttribute("fill", "black") 
        current_time_hours = hours.value
        current_time_minutes = minutes.value
        start_pause.setAttribute("data-id", 1);
        start_pause.innerHTML = '<path d="M560-200v-560h160v560H560Zm-320 0v-560h160v560H240Z"/>'
        timer_on = true;
        hours.disabled = true;
        minutes.disabled = true;
         
    }else{
        start_pause.setAttribute("data-id", 0);
        start_pause.innerHTML = '<path d="M385-243v-474l237 237-237 237Z"/>'
        timer_on = false;
        hours.disabled = false;
        minutes.disabled = false;
    }
    
})

restart.addEventListener("click", () =>{
    start_pause.setAttribute("data-id", 0);
    start_pause.innerHTML = '<path d="M385-243v-474l237 237-237 237Z"/>'
    timer_on = false;
    hours.disabled = false;
    minutes.disabled = false;
    let hours_reset_displayed
    let minutes_reset_displayed
    if(current_time_hours < 10){
        hours_reset_displayed = '0' + current_time_hours
    }else{
        hours_reset_displayed = current_time_hours
    }
    if(minutes.value < 10){
        minutes_reset_displayed = '0' + current_time_minutes
    }else{
        minutes_reset_displayed = current_time_minutes
    }
    timer.textContent = `${hours_reset_displayed} : ${minutes_reset_displayed} : 00 `
    total_time = hours.value * 60 * 60 + minutes.value * 60
})


let hours_start
let minutes_start

hours.addEventListener("input", () =>{
    
    if(hours.value < 10){
        hours_start = '0' + hours.value
    }else{
        hours_start = hours.value
    }
    if(minutes.value < 10){
        minutes_start = '0' + minutes.value
    }else{
        minutes_start = minutes.value
    }
    timer.textContent = `${hours_start} : ${minutes_start} : 00 `
    total_time = hours.value * 60 * 60 + minutes.value * 60
})

minutes.addEventListener("input", () =>{
    if(hours.value < 10){
        hours_start = '0' + hours.value
    }else{
        hours_start = hours.value
    }
    if(minutes.value < 10){
        minutes_start = '0' + minutes.value
    }else{
        minutes_start = minutes.value
    }
    timer.textContent = `${hours_start} : ${minutes_start} : 00 `
    total_time = hours.value * 60 * 60 + minutes.value * 60
});


let time = 60;
setInterval(Timer, 1000);

function Timer(){
    if(timer_on && total_time != -1){
        var hours_remaining = Math.floor(total_time / 3600);
        var minutes_remaining = Math.floor((total_time - hours_remaining * 3600)/60);
        var seconds_remaining = total_time - hours_remaining * 3600 - minutes_remaining * 60
        if(hours_remaining < 10){
            hours_remaining = '0' + hours_remaining
        }
        if(minutes_remaining < 10){
            minutes_remaining = '0' + minutes_remaining
        }
        if(seconds_remaining < 10){
            seconds_remaining = '0' + seconds_remaining
        }
        timer.textContent = `${hours_remaining} : ${minutes_remaining} : ${seconds_remaining} `
        total_time = total_time - 1;
        console.log(total_time)
        if(total_time == -1){
            timer_on = false;
            start_pause.innerHTML = '<path d="M385-243v-474l237 237-237 237Z"/>'
            hours.disabled = false;
            minutes.disabled = false;
            new Notification("Time's UP!", { body: 'Your timer has finished!', icon: "../images/clock.jpg" });

        }
    }
    
}


Notification.requestPermission().then((result) => {
  console.log(result);
});