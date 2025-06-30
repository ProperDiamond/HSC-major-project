const modal_list = document.querySelectorAll(".modal_container");
const modal_container = modal_list[0]
const view_container = modal_list[1]
const event_form = document.getElementById("event_form")
const backdrop = document.querySelector(".backdrop")
const cancel = document.getElementById("cancel")  
const event_start = document.getElementById("event_start") 
const wrapper = document.getElementById('calendar');
const start = document.getElementById("start")
const end = document.getElementById("end")
const all = document.getElementById("all")

console.log(cancel)


let calendar;
let time_start
let time_end
let deleted_event;

console.log(modal_list)

const event_view = view_container.querySelector(".event_view")
event_view.innerHTML = 
          `
          <div class="event_top">
            <p class="event_title"></p>
          </div>
          <div class="event_dates"></div>
          <div class="event_notes"></div>
          `
const event_header = event_view.querySelector(".event_top");
const event_date = event_view.querySelector(".event_dates");
const event_notes = event_view.querySelector(".event_notes");
const del = document.createElement("button")
del.classList.add("event_del")
del.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h160q0-17 11.5-28.5T400-840h160q17 0 28.5 11.5T600-800h160q17 0 28.5 11.5T800-760q0 17-11.5 28.5T760-720v520q0 33-23.5 56.5T680-120H280Zm120-160q17 0 28.5-11.5T440-320v-280q0-17-11.5-28.5T400-640q-17 0-28.5 11.5T360-600v280q0 17 11.5 28.5T400-280Zm160 0q17 0 28.5-11.5T600-320v-280q0-17-11.5-28.5T560-640q-17 0-28.5 11.5T520-600v280q0 17 11.5 28.5T560-280Z"/></svg>'
event_header.append(del)
del.addEventListener("click", () =>{
  deleted_event.remove()
  view_container.style.display = "none"
  backdrop.style.display = "none"
  updateEvent()
})

async function updateEvent(){
  const events = await calendar.getEvents().map(e => e.toPlainObject()); 
  const request = JSON.stringify(events)
  await fetch('/api/eventsadd', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: request
  })
  .then(res => res.json())
  .then(data => console.log(data));

}

async function retrieveEvents(){
  const response = await fetch(`http://127.0.0.1:8000/api/eventsview`)
  const events = await response.json()
  await console.log(events)
  return events
  
}

function dateEnding(startstring, start_ending){
  switch(start_ending){
      case '1':
        return startstring = startstring + "st"
      case '2':
        return startstring = startstring + "nd"
      case '3':
        return startstring = startstring + "rd"
      default:
        return startstring = startstring + "th"

    }
}


document.addEventListener('DOMContentLoaded', async function() {
  var eventsList = await retrieveEvents()
  await console.log(eventsList)
  var calendar_wrapper = document.getElementById('calendar');
  

  calendar = new FullCalendar.Calendar(calendar_wrapper, {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    initialView: 'timeGridWeek',
    nowIndicator: true,
    selectable: true,
    eventOverlap: true,
    slotDuration: '00:30:00',
    selectMirror: true,
    unselectAuto: false,
    eventColor: '#e68bbe',
    editable: true,
    eventResizableFromStart: true,
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'multiMonthYear,dayGridMonth,timeGridWeek,timeGridDay'
    },
    eventTimeFormat: { 
      hour: '2-digit',
      minute: '2-digit',
      meridiem: 'short'
    },
    events: eventsList,
    select: function(info) {
        
        backdrop.style.display = "block"
        modal_container.style.display = "flex"
        time_start = info.start        

        start.value  = time_start.toISOString().slice(0, 16);

        time_end = info.end
        end.value  = time_end.toISOString().slice(0, 16);


        all.checked = info.allDay
        
       
    },
    eventDrop() {
      updateEvent()
    },

    eventResize() {
      updateEvent()
    },
    eventClick: function(info) {
      backdrop.style.display = "block"
      view_container.style.display = "flex"
      const event = info.event
      deleted_event = event;
      const title = event_header.querySelector(".event_title")
      title.textContent = info.event.title
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

      const event_start = event.start
      console.log(event_start.getTimezoneOffset() *60000)
      const start_offset = new Date(event_start.getTime() + event_start.getTimezoneOffset() * 60000);
      const userLocale = navigator.language;      
      console.log(userLocale)
      const formatter = new Intl.DateTimeFormat(userLocale, {
        minute: "numeric",
        hour: "numeric",
        hour12: true         
      });

      const start_year = start_offset.getYear() + 1900;
      const start_month = months[(start_offset.getMonth())];
      var start_day = start_offset.getDay();
      const start_hrmin = formatter.format(start_offset)
      console.log(start_hrmin)

      start_day = dateEnding(start_day)

      
      const eventStartISO = event_start.toISOString()
      const eventStartYear = event_start.getYear() + 1900;
      console.log(eventStartYear)
      const eventStartMonth = eventStartISO.slice(5,6)
      const eventStartDate = eventStartISO.slice(8,9)




      
     
      console.log(event_start.getHours())
      
      if(event.allDay){
        event_date.innerHTML = `<p>Starts: ${start_year} ${start_month} ${start_day}</p>
                                <p>Ends: </p>`
      }else{
        event_date.innerHTML = `<p>Starts: ${start_year} ${start_month} ${start_day} ${start_hrmin}</p>
                                <p>Ends: </p>`
      }

      

      var notes = event.extendedProps.notes
      if(notes == ""){
        notes = "--"
      }

      event_notes.innerHTML = `<p>Notes:</p>
                                <p>${notes}</p>`
      
      
    }


  });

  calendar.render();
});

all.addEventListener("change", (e) =>{
  if(all.checked){
    console.log("hi")
  }else{
    console.log("bye")
  }

})


event_form.addEventListener("submit", (e) => {
    e.preventDefault()
    const task_data = new FormData(e.target);
    const entries = Object.fromEntries(task_data.entries());
    backdrop.style.display = "none"
    modal_container.style.display = "none"
    event_form.reset();
    calendar.addEvent({
      title: entries.event_name, 
      notes: entries.event_notes,
      start: entries.start, 
      end: entries.end,
      allDay: entries.all
    });
    calendar.unselect()
    updateEvent()

})


backdrop.addEventListener("click", ()=>{
    backdrop.style.display = "none"
    modal_container.style.display = "none"
    view_container.style.display = "none"
    event_form.reset();
    calendar.unselect()
})


cancel.addEventListener("click", ()=>{
    backdrop.style.display = "none"
    modal_container.style.display = "none"
    view_container.style.display = "none"
    event_form.reset();
    calendar.unselect()
})
