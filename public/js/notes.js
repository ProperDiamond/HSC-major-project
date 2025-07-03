
const notepad = document.getElementById("notepad");
notepad.textContent = localStorage.getItem("notevalue") || "" 

function notesupdate(){
    localStorage.setItem("notevalue", notepad.value)
}

notepad.addEventListener("input", () =>  {
    setInterval(notesupdate, 200);
})


