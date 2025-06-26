const modal_container = document.querySelector(".modal_container")
const event_form = document.getElementById("event_form")
const backdrop = document.querySelector(".backdrop")
const cancel = document.getElementById("cancel")  
const event_start = document.getElementById("event_start") 
const wrapper = document.getElementById('calendar');
const start = document.getElementById("start")
const end = document.getElementById("end")
const all = document.getElementById("all")


let calendar;
let time_start
let time_end
let all_day;




document.addEventListener('DOMContentLoaded', function() {
  console.log(Intl.DateTimeFormat().resolvedOptions().timeZone)
  var calendar_wrapper = document.getElementById('calendar');


  calendar = new FullCalendar.Calendar(calendar_wrapper, {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    initialView: 'timeGridWeek',
    nowIndicator: true,
    selectable: true,
    selectMirror: true,
    unselectAuto: false,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay'
    },
    select: function(info) {
        
        backdrop.style.display = "block"
        modal_container.style.display = "flex"
        time_start = info.start
        start.value  = time_start.toISOString().slice(0, 16);

        time_end = info.end
        end.value  = time_end.toISOString().slice(0, 16);

        all_day = info.allDay

        all.checked = all_day
        
       
    }
    


  });

  calendar.render();
});


event_form.addEventListener("submit", (e) => {
    e.preventDefault()
    const task_data = new FormData(e.target);
    const entries = Object.fromEntries(task_data.entries());
    backdrop.style.display = "none"
    modal_container.style.display = "none"
    event_form.reset();
    calendar.addEvent({
      title: entries.event_name, 
      start: entries.event_start, 
      end: entries.event_end,
      allDay: entries.all
    });
    calendar.unselect()
})


backdrop.addEventListener("click", ()=>{
    backdrop.style.display = "none"
    modal_container.style.display = "none"
    event_form.reset();
    calendar.unselect()
})


cancel.addEventListener("click", ()=>{
    backdrop.style.display = "none"
    modal_container.style.display = "none"
    event_form.reset();
    calendar.unselect()
})
