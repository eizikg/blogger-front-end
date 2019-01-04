document.addEventListener('DOMContentLoaded', function(){
  let button_div = document.querySelector('.button_menu')
  button_div.style.display = "none"
  let formDiv = document.querySelector('.form-div')
  formDiv.style.display = "none"
  let imageDiv = document.querySelector('.form-image-div')
  imageDiv.style.display = "none"
  listElements()
  let add_button = document.querySelector('.add_button')
  add_button.addEventListener('click', buttonMenu)
})


function listElements(){
  let elements = document.querySelector('#elements')
  fetch( 'http://localhost:3000/articles')
  .then(response => response.json())
  .then(data => {
    data.forEach((element) =>{
      let type = Object.keys(element)[0]
      createElement(element[type], element.id, type)
      console.log(element[type])
      // div.addEventListener('keypress', updater)
      // elements.appendChild(div)

    })
  })
}



function createElement(text, id, type){
  if (type === "text"){
  let elements = document.querySelector('#elements')
  div = document.createElement('div')
  div.className = "row"
  div.dataset.id = id
  div.dataset.type = type
  div.innerHTML += `<div class="row" contenteditable="true" ><p>${text}</p></div></br>`
  div.addEventListener('keypress', updater)
  elements.prepend(div)
}
else if (type === "image"){
  console.log(text)
  let elements = document.querySelector('#elements')
  div = document.createElement('div')
  div.className = "row"
  div.dataset.id = id
  div.dataset.type = type
  div.innerHTML += `<div class="row" contenteditable="true"><img src=${text}></div></br>`
  div.addEventListener('keypress', updater)
  elements.prepend(div)
}
}




function newElementForm(event){
  let button_div = document.querySelector('.button_menu')
    button_div.style.display = "none"
  console.log('hi')
  let formDiv = document.querySelector('.form-div')
  formDiv.style.display = "block"
  // div = document.createElement('div')
  // div.className = "row"
  // div.rows = "7"
  // div.innerHTML += '<textarea>hello</textarea>'
  // formDiv.append(div)
  // console.log(div)
  //let formElement = document.querySelector('#form')
  formDiv.addEventListener('keypress', createNewElement)
}

function newimageForm(event){
  let button_div = document.querySelector('.button_menu')
    button_div.style.display = "none"
  console.log('hi')
  let imageDiv = document.querySelector('.form-image-div')
  imageDiv.style.display = "block"
  imageDiv.addEventListener('keypress', createNewImageElement)
}

function createNewElement(e){
  var key = e.which || e.keyCode;
  if (key === 13) {
    if (!e.target.value){
      alert("cannot be empty");
      return;
    }
  let formElement = document.querySelector('.form-div')
  // document.querySelector('.add_button').style.display = 'block'
  let input = e.target
  if (!!formElement){formElement.style.display = "none"}
  fetch('http://localhost:3000/articles', {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: input.value
    })
  }).then(resp => resp.json())
  .then(data => {
   createElement(data.text, data.id, "text")
  e.target.value=""
})
}
}

function createNewImageElement(e){
  var key = e.which || e.keyCode;
  if (key === 13) {
    if (!e.target.value){
      alert("cannot be empty");
      return;
    }
  let formElement = document.querySelector('.form-div')
  // document.querySelector('.add_button').style.display = 'block'
  let input = e.target
  console.log(e.target.value)
  if (!!formElement){formElement.style.display = "none"}
  fetch('http://localhost:3000/articles', {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
      image: input.value
    })
  }).then(resp => resp.json())
  .then(data => {
    console.log(data)
   createElement(data.image, data.id, "image")
  e.target.value=""
})
}
}



function updateElement(e){
  console.log(e.target.parentNode.dataset.type)
  console.log('updating')
  let input = e.target
  fetch(`http://localhost:3000/articles/${e.target.parentNode.dataset.id}`, {
    method: "PATCH",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: input.innerText
    })
  })
}

function buttonMenu(e){
  // console.log(e.target)
  if (e.target.id === 'icon-button'){
    let type = e.target.parentNode.dataset.type
    if (type === "paragraph"){
      newElementForm()
    }
    if (type === "image"){
     newimageForm()
    }
  }
  if (e.target.id === 'plus-button'){
    let button_div = document.querySelector('.button_menu')
    if (button_div.style.display === 'none'){
      button_div.style.display = "inline-block"
    }
    else {
   button_div.style.display = "none"
 }
 }
}


//helper mothods

let updater = debounce(function(e) {
  div = document.createElement('div')
  div.innerHTML += '<p>saving...</p>'
  div.className= "ui segment"
  div.style.cssText = 'position:fixed;width:70px;left:50%;background-color:grey;font-family: Lato, sans-serif;'
  document.body.prepend(div)
  alert = document.querySelectorAll('.segment')
  setTimeout(function(){ document.body.removeChild(alert[0]); updateElement(e)}, 900);
  setTimeout(function(){updateElement(e)}, 2000);
  updateElement(e)
}, 800, true);


function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait || 200);
    if (callNow) {
      func.apply(context, args);
    }
  };
};
