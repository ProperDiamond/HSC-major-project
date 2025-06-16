
const content = document.getElementById("content")
const form = document.getElementById("task_form")
const todolist = document.getElementById("todo_view")

//console.log("hi")


let db;
const request = window.indexedDB.open("todolist", 1);

function task_status(){

}

function date_pill(deadline){
  const date = new Date (deadline)
  const today = new Date()
  var timedifference = date - today;

  if(timedifference < 0){
    return 'OVERDUE!!!'
  }else{
    const timediffdays = Math.floor(timedifference / (1000 * 60 * 60 * 24))
    timedifference -= timediffdays * (1000 * 60 * 60 * 24)
    const timediffhours = Math.floor(timedifference / (1000 * 60 * 60))
    timedifference -= timediffhours * (1000 * 60 * 60)
    const timediffminutes = Math.floor(timedifference / (1000 * 60))
    timedifference -= timediffminutes * (1000 * 60)
    const timediffseconds = Math.floor(timedifference / (1000))

    console.log(`${timediffdays} ${timediffhours} ${timediffminutes} ${timediffseconds}`)
    if(timediffdays > 0){
      return `Due in ${timediffdays} days`
    }else if(timediffhours > 0){
      return `Due in ${timediffhours} hours and ${timediffminutes} minutes`
    }else{
      return `Due in ${timediffminutes} minutes and ${timediffseconds} seconds`
    }
  }


}

function date_update(){
  const dates = document.querySelectorAll(".deadline");
  dates.forEach(date => {
    date.textContent = date_pill(date.dataset.id);
  });
}

function priority_pill(){

}


function rendering(){
  todolist.innerHTML =""


  const render_transaction = db.transaction("tasks");
  const store = render_transaction.objectStore("tasks");
  const index = store.index("task_urgency");
  const cursorRequest = index.openCursor(null, "next");

  cursorRequest.onsuccess = function(event) {
    let cursor = event.target.result;
    if (cursor) {
      const task = document.createElement("div")
      const task_info = cursor.value
      task.classList.add("task")
      todolist.append(task)
      task.setAttribute("data-id", `${task_info.id}`);
      date_pill(task_info.task_deadline)
      task.innerHTML = 

      `
      <select class="circular_status">
          <option value="${task_info.task_status}">${task_info.task_status}</option>
        </select> 
       
       <div class="task_info">
        <h1 class="task_name">${task_info.task_name}</h1>
        <div class = "pill_labels"> 
          <p class="pill_label deadline" data-id = "${task_info.task_deadline}">${date_pill(task_info.task_deadline)}</p>
          <p class="pill_label">${task_info.task_priority}</p>
        </div> 
       </div>
        `
      //console.log(cursor.value);
      const delete_button = document.createElement("button");
      delete_button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h160q0-17 11.5-28.5T400-840h160q17 0 28.5 11.5T600-800h160q17 0 28.5 11.5T800-760q0 17-11.5 28.5T760-720v520q0 33-23.5 56.5T680-120H280Zm120-160q17 0 28.5-11.5T440-320v-280q0-17-11.5-28.5T400-640q-17 0-28.5 11.5T360-600v280q0 17 11.5 28.5T400-280Zm160 0q17 0 28.5-11.5T600-320v-280q0-17-11.5-28.5T560-640q-17 0-28.5 11.5T520-600v280q0 17 11.5 28.5T560-280Z"/></svg>'
      task.append(delete_button)
      delete_button.setAttribute("data-id", `${task_info.id}`)
      delete_button.addEventListener("click", (e) =>{
        const buttonid = Number(delete_button.dataset.id)
        console.log(buttonid)
        const delete_transaction = db.transaction("tasks", "readwrite");
        const delete_store = delete_transaction.objectStore("tasks");
        delete_store.delete(buttonid);
        rendering()
      })
      cursor.continue();
    }
  };
  cursorRequest.oncomplete = () => console.log("querying completed")
  cursorRequest.onerror = e => console.error(e);
}











request.onupgradeneeded = (event) => {
  const db = event.target.result;
  const storage = db.createObjectStore("tasks", {keyPath: "id", autoIncrement : true})
  storage.createIndex("task_urgency", ["task_deadline", "task_priority"], {unique: false});


};

request.onsuccess = (event) => {
  db = event.target.result;  
  rendering();

  setInterval(date_update, 1000);

  

  
}

  
  

  // const task_name = storage.index("task_name")
  // const task_deadline = storage.index("task_deadline")
  // const task_priority = storage.index("task_priority")
  // const task_status = storage.index("task_status")
  

  // storage.put({task_name: entries.task_name, task_deadline: entries.deadline, task_priority: entries.priority, entries_status: "Not Started"})
  


request.onerror = (event) => {
  console.error("Why didn't you allow my web app to use IndexedDB?!");
};



form.addEventListener("submit", (e) => {
    
  const transaction = db.transaction("tasks", "readwrite")
  const storage = transaction.objectStore("tasks")
  e.preventDefault()
  const task_data = new FormData(e.target);
  const entries = Object.fromEntries(task_data.entries());
  console.table(entries);
  console.log(entries.task_name)
  form.reset();
  storage.put({
                task_name: entries.task_name, 
                task_deadline: entries.task_deadline, 
                task_priority: entries.task_priority, 
                task_status: "Not Started"})

  rendering();
})

