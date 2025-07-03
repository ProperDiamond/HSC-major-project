let db;
const home_todo_container = document.getElementById("home_todo")

console.log(home_todo_container)

var counter = 0;
const tasks_current = 3;
const request = window.indexedDB.open("todolist", 1);

function home_rendering(){

    const render_transaction = db.transaction("tasks");
    const store = render_transaction.objectStore("tasks");
    const index = store.index("task_urgency");
    const cursorRequest = index.openCursor(null, "next");
    home_todo_container.innerHTML =`<h2 class= 'todo_headings'>Tasks</h2>
                    <div class="task_list"></div>`
    const home_todolist = home_todo_container.querySelector(".task_list")
    cursorRequest.onsuccess = function(event) {
        let cursor = event.target.result;
        
        if(counter >= tasks_current) return;
        if (cursor) {
            const task = document.createElement("div")
            const task_info = cursor.value
            task.setAttribute("data-id", `${task_info.id}`);  
            task.classList.add("task")
            home_todolist.append(task)
            if(task_info.task_type == "s"){
                task.innerHTML = 
                `
                <div class="status-wrapper">
                    <input class="status" type="checkbox"/>
                </div>
                
                <div class="task_info">
                    <h2 class="task_name">${task_info.task_name}</h2>
                    <div class = "pill_labels"> 
                    <p class="pill_label deadline" data-id = "${task_info.task_deadline}">${date_pill(task_info.task_deadline)}</p>
                    <div class="dropdown">
                        <p class="pill_label priority" style='background-color:${priority_colour(task_info.task_priority)}'>${priority_text(task_info.task_priority)}</p>
                    </div>
                    </div> 
                </div>
                `
                const checkbox = task.querySelector(".status");
                checkbox.addEventListener("change", () =>{
                    confetti({
                        particleCount: 120,
                        spread: 80,
                        origin: { y: 0.6 },
                    });
                    task.classList.add("completed");
                    const id = Number(delete_button.dataset.id)
                    const complete_transaction = db.transaction("tasks", "readwrite");
                    const complete_store = complete_transaction.objectStore("tasks");
                    complete_store.delete(id);
                    setTimeout(() => {
                        task.remove()
                        counter = 0
                        home_rendering()    
                    }, 500);
                    

                
                })
            }else{
                task.innerHTML = 
                `
                ${task_status(task_info.task_status)}
                <div class="task_info">
                    <h2 class="task_name">${task_info.task_name}</h2>
                    <div class = "pill_labels"> 
                    <p class="pill_label deadline" data-id = "${task_info.task_deadline}">${date_pill(task_info.task_deadline)}</p>
                    <div class="dropdown">
                        <p class="pill_label priority" style='background-color:${priority_colour(task_info.task_priority)}'>${priority_text(task_info.task_priority)}</p>
                    </div>
                    </div> 
                </div>
                `
                const status = task.querySelector(".circular_status");
                const dropdown = new Choices(status, {
                searchEnabled: false,  
                itemSelectText: '',     
                shouldSort: false      
                });
                status.addEventListener("change", () => {
                if(status.value != "Completed"){
                    const status_transaction = db.transaction("tasks", "readwrite");
                    const status_store = status_transaction.objectStore("tasks");
                    task_info.task_status = status.value
                    status_store.put(task_info)
                }else{
                    confetti({
                    particleCount: 240,
                    spread: 160,
                    origin: { y: 0.6 },
                });
                    task.classList.add("completed");
                    const id = Number(delete_button.dataset.id)
                    const longcomplete_transaction = db.transaction("tasks", "readwrite");
                    const longcomplete_store = longcomplete_transaction.objectStore("tasks");
                    longcomplete_store.delete(id);
                    setTimeout(() => {
                        task.remove()
                        counter = 0
                        home_rendering()
                    }, 500);
                    
                }
                
                })
            }
            
            
            
            //console.log(cursor.value);
            const delete_button = document.createElement("button");
            delete_button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520q-17 0-28.5-11.5T160-760q0-17 11.5-28.5T200-800h160q0-17 11.5-28.5T400-840h160q17 0 28.5 11.5T600-800h160q17 0 28.5 11.5T800-760q0 17-11.5 28.5T760-720v520q0 33-23.5 56.5T680-120H280Zm120-160q17 0 28.5-11.5T440-320v-280q0-17-11.5-28.5T400-640q-17 0-28.5 11.5T360-600v280q0 17 11.5 28.5T400-280Zm160 0q17 0 28.5-11.5T600-320v-280q0-17-11.5-28.5T560-640q-17 0-28.5 11.5T520-600v280q0 17 11.5 28.5T560-280Z"/></svg>'
            task.append(delete_button)
            delete_button.classList.add("delete")
            delete_button.setAttribute("data-id", `${task_info.id}`)
            delete_button.addEventListener("click", () =>{
                task.classList.add("deleted")
                const buttonid = Number(delete_button.dataset.id)
                console.log(buttonid)
                const delete_transaction = db.transaction("tasks", "readwrite");
                const delete_store = delete_transaction.objectStore("tasks");
                delete_store.delete(buttonid);
                setTimeout(() => {
                    task.remove()
                    counter = 0
                    home_rendering()
                }, 500);
            })
            task.addEventListener("mouseover", () =>{
                delete_button.style.opacity = 1;
            })
            task.addEventListener("mouseout", () =>{
                delete_button.style.opacity = 0;
            })
            counter += 1;
            cursor.continue()
        }
        
    }
}


function task_status(status){
  if(status == "Not Started"){
    return `<select name="task_status" class="circular_status" required>
              <option selected value="Not Started">Not Started</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>`
  }else{
    return `<select name="task_status" class="circular_status" required>
              <option value="Not Started">Not Started</option>
              <option selected value="Ongoing">Ongoing</option>
              <option value="Completed">Completed</option>
            </select>`
  }
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

  
    if(timediffdays > 0){
      return `Due in ${timediffdays} days`
    }else if(timediffhours > 0){
      return `Due in ${timediffhours} hours ${timediffminutes} mins`
    }else{
      return `Due in ${timediffminutes} mins ${timediffseconds} secs`
    }
  }


}

function date_update(){
  const now = new Date()
  const timestring = now.toISOString()
  
  const dates = document.querySelectorAll(".deadline");
  dates.forEach(date => {
    date.textContent = date_pill(date.dataset.id);
  });
}


function priority_colour(priority){
  switch (priority){
    case "1":
      return "#FF746C"
    case "2":
      return "#FFEE8C"
    case "3":
      return "#cbeec8"

  }
  
}

function priority_text(priority){
  switch (priority){
    case "1":
      return "High"
    case "2":
      return "Medium"
    case "3":
      return "Low"

  }
}


request.onupgradeneeded = (event) => {
  const db = event.target.result;
  const storage = db.createObjectStore("tasks", {keyPath: "id", autoIncrement : true})
  storage.createIndex("task_urgency", ["task_deadline", "task_priority"], {unique: false});


};

request.onsuccess = (event) => {
  db = event.target.result;  
  home_rendering();
  setInterval(date_update, 1000);
  
}

request.onerror = (event) => {
  console.error("Why didn't you allow my web app to use IndexedDB?!");
};

