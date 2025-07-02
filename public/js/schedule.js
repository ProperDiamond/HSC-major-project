async function retrieveEvents(){
  const response = await fetch(`http://127.0.0.1:8000/api/eventsview`)
  const events = await response.json()
  await console.log(events)
  return events
  
}



document.addEventListener('DOMContentLoaded', async function() {
  var schedule_wrapper = document.getElementById('schedule');
  var eventsList = await retrieveEvents()

  let schedule = new FullCalendar.Calendar(schedule_wrapper, {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    initialView: 'listDay',
    nowIndicator: true,
    eventOverlap: true,
    slotDuration: '00:30:00',
    eventColor: '#e68bbe',
    events: eventsList,
  });
  schedule.render()
})