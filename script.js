
import { save, load } from "./storage.js";

const addBtn = document.getElementById('addBtn');
const myInput = document.getElementById('myInput');
const myUL= document.getElementById('myUL');
let currentId = 0;
const STORAGE_KEY = 'tasks';

addBtn.addEventListener('click', addNewTask);
myUL.addEventListener('click', handleTaskBehaviour);
window.addEventListener('DOMContentLoaded', fillTaskList)

function addNewTask (e) {
    const inputValue = myInput.value.trim();
   
    if(!inputValue) {
        alert('Write something!');
        return;
    }
    createLi(inputValue);
    myInput.value = '';
    addTaskToStorage(inputValue);
}
function createLi(text, isDone = false, id = currentId) { 
    const liEl = document.createElement('LI');
    const liText = document.createTextNode(text);
    liEl.appendChild(liText);
    liEl.dataset.id = id;
    if (isDone) liEl.className = 'checked';
    myUL.appendChild(liEl);
    addCloseButton(liEl);
}

function addCloseButton(li) {
  const span = document.createElement("SPAN");
  const txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);
}

function handleTaskBehaviour({ target }) {
    const currentState = load(STORAGE_KEY);
    if (target.tagName === "LI")
    {console.log(target.tagName)
        target.classList.toggle("checked");
        const taskIndex = currentState.findIndex(taskObj => +taskObj.id === +target.dataset.id);
        currentState[taskIndex].isDone = !currentState[taskIndex].isDone;
    }  else if (target.classList.contains('close')) { 
        target.parentNode.remove();
        const taskIndex = currentState.findIndex(taskObj => +taskObj.id === +target.parentNode.dataset.id);
        currentState.splice(taskIndex, 1);
    }
    save(STORAGE_KEY, currentState)
}
 
const createTaskObj = (text, isDone) => ({ text, isDone, id: currentId });

function addTaskToStorage(text, isDone = false) { 
    const currentState = load(STORAGE_KEY);
    const newTask = createTaskObj(text, isDone);
    if (currentState === undefined) {
        save(STORAGE_KEY, [newTask]);
    } else {
        currentState.push(newTask);
        save(STORAGE_KEY, currentState)
     }
    currentId += 1;
}


function fillTaskList() {
    const currentState = load(STORAGE_KEY);
    if (currentState !== undefined) {
        currentState.forEach(({text,isDone,id}) => {
            createLi(text, isDone, id);
            currentId = currentState[currentState.length - 1].id + 1;
        });

    }
}
