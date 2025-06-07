const body = document.querySelector("body"),
sidebar = body.querySelector(".sidebar");
contents = body.querySelector(".content");
button = sidebar.querySelector("#something");



sidebar.addEventListener("mouseover", () =>{
    contents.style.marginLeft = "325px";
});

sidebar.addEventListener("mouseout", () =>{
    contents.style.marginLeft = "150px";
});
