const timer = document.querySelectorAll(".timer_input")





const container = document.getElementById("container")
const card = document.createElement("h1");
card.classList.add("card");
container.appendChild(card);
let time = 60;
setInterval(Timer, 1000);

function Timer(){
    card.innerHTML = time
    time = time-1
}