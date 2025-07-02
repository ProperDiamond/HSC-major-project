const modal_list = document.querySelectorAll(".modal_container");
const add_container = modal_list[0]
const view_container = modal_list[1]
const event_form = document.getElementById("event_form")
const backdrop = document.querySelector(".backdrop")
const cancel = document.getElementById("cancel")  
const event_start = document.getElementById("event_start") 
const wrapper = document.getElementById('calendar');
const start = document.getElementById("start")
const end = document.getElementById("end")
const all = document.getElementById("all")
const cross_modaladd = add_container.querySelector(".cross")

console.log(add_container)
console.log(cross_modaladd)





console.log(cancel)


let calendar;
let time_start
let time_end
let deleted_event;

let prev_start_string;
let prev_end_string;

console.log(modal_list)

const event_view = view_container.querySelector(".event_view")


event_view.innerHTML = 
          `
          <div class="event_top">
            
            <p class="event_title"></p>
            <div class="header_controls">
              <svg class="event_del" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#"><path d="M280-120q-33 0-56.5-23.5T200-200v-520q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h160q0-17 11.5-28.5T400-840h160q17 0 28.5 11.5T600-800h160q17 0 28.5 11.5T800-760q0 17-11.5 28.5T760-720v520q0 33-23.5 56.5T680-120H280Zm120-160q17 0 28.5-11.5T440-320v-280q0-17-11.5-28.5T400-640q-17 0-28.5 11.5T360-600v280q0 17 11.5 28.5T400-280Zm160 0q17 0 28.5-11.5T600-320v-280q0-17-11.5-28.5T560-640q-17 0-28.5 11.5T520-600v280q0 17 11.5 28.5T560-280Z"/></svg>
              <svg class="cross" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>
            </div> 
          </div>
          <div class="event_dates"></div>
          <div class="event_notes"></div>
          `
const event_header = event_view.querySelector(".event_top");
const event_date = event_view.querySelector(".event_dates");
const event_notes = event_view.querySelector(".event_notes");
const header_controls = event_view.querySelector(".header_controls");
const cross_modalview = view_container.querySelector(".cross")
const del = view_container.querySelector(".event_del")


cross_modalview.addEventListener("click", ()=>{
  backdrop.style.display = "none"
  view_container.style.display = "none"
})


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

function dateEnding(end){
  if(end >= 11 && end <= 13){
    return end + "th";
  }
  switch(end){
      case 1:
        return end = end + "st"
      case 2:
        return end = end + "nd"
      case 3:
        return end = end + "rd"
      default:
        return end = end + "th"

    }
}


document.addEventListener('DOMContentLoaded', async function() {
  var eventsList = await retrieveEvents()
  //await console.log(eventsList)
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
        add_container.style.display = "flex"
        time_start = info.start         

        time_end = info.end

        all.checked = info.allDay

        
        if(info.allDay){
          start.setAttribute("type", "date");
          end.setAttribute("type", "date");
          time_end.setDate(time_end.getDate() - 1)
          time_start = time_start.toISOString()
          time_end = time_end.toISOString()
          start.value  = time_start.slice(0, 10);
          end.value  = time_end.slice(0, 10);
          
        }else{
          start.setAttribute("type", "datetime-local");
          end.setAttribute("type", "datetime-local");
          time_start = time_start.toISOString()
          time_end = time_end.toISOString()
          start.value  = time_start.slice(0, 16);
          end.value  = time_end.slice(0, 16);
          
        }

        
        
       
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
      //console.log(event_start.getTimezoneOffset() *60000)
      const start_offset = new Date(event_start.getTime() + event_start.getTimezoneOffset() * 60000);
      const userLocale = navigator.language;      
      //console.log(userLocale)
      const formatter = new Intl.DateTimeFormat(userLocale, {
        minute: "numeric",
        hour: "numeric",
        hour12: true         
      });

      const start_year = start_offset.getYear() + 1900;
      const start_month = months[(start_offset.getMonth())];
      var start_day = start_offset.getDate();
      const start_hrmin = formatter.format(start_offset)
      //console.log(start_hrmin)

      start_day = dateEnding(start_day)

      const event_end = event.end || event.start;
      const end_offset = new Date(event_end.getTime() + event_end.getTimezoneOffset() * 60000);
      //console.log(event_start.getTimezoneOffset() *60000)
      if(event.end && event.allDay){
        end_offset.setDate(end_offset.getDate() -1)
      }
      
      

      
      const end_year = end_offset.getYear() + 1900;
      const end_month = months[(end_offset.getMonth())];

      
      var end_day = end_offset.getDate();
      const end_hrmin = formatter.format(end_offset)
      //console.log(start_hrmin)



      end_day = dateEnding(end_day)
      
      if(event.allDay){
        event_date.innerHTML = `<div class="event_time">
                                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#9039b9"><path d="M580-240q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Z"/></svg>
                                  <p> <span class="eventtime_heading">Starts:</span> ${start_day} ${start_month}, ${start_year}</p>
                                </div>
                                <div class="event_time">
                                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#9039b9"><path d="M580-240q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Z"/></svg>
                                  <p> <span class="eventtime_heading">Ends:</span> ${end_day} ${end_month}, ${end_year}</p>
                                </div>`
                                
      }else{
        event_date.innerHTML = `<div class="event_time">
                                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#9039b9"><path d="M580-240q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Z"/></svg>
                                  <p> <span class="eventtime_heading">Starts:</span> ${start_day} ${start_month}, ${start_year} - ${start_hrmin}</p>
                                </div>
                                <div class="event_time">
                                  <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#9039b9"><path d="M580-240q-42 0-71-29t-29-71q0-42 29-71t71-29q42 0 71 29t29 71q0 42-29 71t-71 29ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Z"/></svg>
                                  <p> <span class="eventtime_heading">Ends:</span> ${end_day} ${end_month}, ${end_year} - ${end_hrmin}</p>
                                </div>`
      }

      

      var notes = event.extendedProps.notes
      if(notes != ""){
        event_notes.innerHTML = `
                              <div class="note_title">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#9039b9"><path d="M168-121q-21 5-36.5-10.5T121-168l35-170 182 182-170 35Zm235-84L205-403l413-413q23-23 57-23t57 23l84 84q23 23 23 57t-23 57L403-205Z"/></svg>
                                <p>Notes:</p>
                              </div>  
                              <div class="note">
                                <p>${notes}</p>
                              </div>`
      }

      
      
      
    }


  });

  calendar.render();
});

all.addEventListener("change", (e) =>{
  if(all.checked){
    prev_start_string = start.value
    prev_end_string = end.value
    start.setAttribute("type", "date");
    end.setAttribute("type", "date");
    start.value  = prev_start_string.slice(0, 10);
    end.value  = prev_end_string.slice(0, 10);
          
  }else{
    //console.log(prev_start_string)
    //console.log(prev_end_string)
    start.setAttribute("type", "datetime-local");
    end.setAttribute("type", "datetime-local");
    start.value  = prev_start_string.slice(0, 16);
    end.value  = prev_end_string.slice(0, 16);
  }

})


event_form.addEventListener("submit", (e) => {
  e.preventDefault()
  const task_data = new FormData(e.target);
  const entries = Object.fromEntries(task_data.entries());

  if(entries.start != entries.end && entries.all){
    const end_clone = new Date(entries.end)
    const new_end = end_clone.setDate(end_clone.getDate() + 1)
    entries.end = new_end
  }
  backdrop.style.display = "none"
  add_container.style.display = "none"
  //console.log(entries.end)
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
  add_container.style.display = "none"
  view_container.style.display = "none"
  event_form.reset();
  calendar.unselect()
})


cancel.addEventListener("click", ()=>{
  backdrop.style.display = "none"
  add_container.style.display = "none"
  view_container.style.display = "none"
  event_form.reset();
  calendar.unselect()
})

cross_modaladd.addEventListener("click", ()=>{
  backdrop.style.display = "none"
  add_container.style.display = "none"
  event_form.reset();
  calendar.unselect()
})