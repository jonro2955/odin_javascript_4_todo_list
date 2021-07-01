import {format} from 'date-fns'
import DB from './DB.js';
// element lists
const allPopups = document.querySelectorAll(".popup");
const allPopupCloseBtns = document.querySelectorAll(".popupCloseBtn");
const allPopupForms = document.querySelectorAll(".popupForm");
const allPopupErrMsgs = document.querySelectorAll(".popupErrMsg");
// project buttons lists 
const routineProjectBtns = document.querySelectorAll(".routineProjBtn");
const newProjBtnsContainer = document.getElementById("newProjBtnsContainer");
// project creator 
const addProjBtn = document.getElementById("addProjBtn");
const projCreatorWindow = document.getElementById("projCreatorWindow");
const projCreatorForm = document.getElementById("projCreatorForm");
const projCreatorNameInput = document.getElementById("projCreatorNameInput");
const projCreatorCloseBtn = document.getElementById("projCreatorCloseBtn");
const projCreatorErrorMsg = document.getElementById("projCreatorErrorMsg");
// project editor 
const projEditorWindow = document.getElementById("projEditorWindow");
const projEditorTitle = document.getElementById("projEditorTitle");
const projEditorForm = document.getElementById("projEditorForm");
const projNameEditInput = document.getElementById("projNameEditInput");
const projDateEditInput = document.getElementById("projDateEditInput");
const projEditorCloseBtn = document.getElementById("projEditorCloseBtn");
const projEditorDeleteBtn = document.getElementById("projEditorDeleteBtn");
const projEditorErrorMsg = document.getElementById("projEditorErrorMsg");
// project viewer=>task list) 
const currentProjHeading = document.getElementById("currentProjHeading");
const currentProjDate = document.getElementById("currentProjDate");
const currentProjTasksList = document.getElementById("currentProjTasksList");
// task creator 
const addTaskBtn = document.getElementById("addTaskBtn");
const taskCreatorWindow = document.getElementById("taskCreatorWindow");
const taskCreatorForm = document.getElementById("taskCreatorForm");
const taskTextArea = document.getElementById("taskTextArea");
const taskCreatorCloseBtn = document.getElementById("taskCreatorCloseBtn");
const taskCreatorErrorMsg = document.getElementById("taskCreatorErrorMsg");
// task editor 
const taskEditorWindow = document.getElementById("taskEditorWindow");
const taskEditorTitle = document.getElementById("taskEditorTitle");
const taskEditorForm = document.getElementById("taskEditorForm");
const taskEditInput = document.getElementById("taskEditInput");
const taskEditorCloseBtn = document.getElementById("taskEditorCloseBtn");
const taskEditorDeleteBtn = document.getElementById("taskEditorDeleteBtn");
const taskEditorErrorMsg = document.getElementById("taskEditorErrorMsg");

export default class UI {
/***************************************************************************************
 * Add event listeners to UI forms and buttons
 ***************************************************************************************/
  static initProjCreator(){
    projCreatorCloseBtn.addEventListener("click", (e)=>{
      e.preventDefault();
      UI.removePopups()
    })
    projCreatorForm.addEventListener("submit", (e)=>{
      // preventDefault is for form actions and form buttons
      e.preventDefault();
      const pName = projCreatorForm["projCreatorNameInput"].value;
      const pDate = projCreatorForm["projCreatorDateInput"].value;
      if(pName){
        DB.addProject(pName, pDate);
        UI.insertProjBtn(pName, pDate);
        UI.displayNewProject(pName, pDate);
        UI.removePopups(); 
    }else{
        projCreatorErrorMsg.textContent="Error: Name field cannot be empty";
      }
    })
  }

  static initTaskCreator(){
    taskCreatorCloseBtn.addEventListener("click", (e)=>{
      e.preventDefault();
      UI.removePopups()
    })
    taskCreatorForm.addEventListener("submit", (e)=>{
      e.preventDefault();
      let index; 
      if(currentProjTasksList.hasChildNodes()){
        index = currentProjTasksList.lastChild.getAttribute("data-taskIndex") + 1;
      }else{
        index = 0;
      }
      const pName = document.getElementById("currentProjHeading").textContent;
      const string = taskCreatorForm["taskTextArea"].value;
      if(string){
        DB.addTask(string, pName);
        UI.insertTask(string, false, pName, index);
        UI.removePopups();
      }else{
        taskCreatorErrorMsg.textContent="Error: Cannot create an empty task"
      }
    })
  }

  static initProjEditor(){
    projEditorForm.addEventListener("submit", (e)=>{
      e.preventDefault(); 
      // data-pName attribute is set when the projEditBtn is created in insertProjBtn()
      const pName = projEditorForm.getAttribute("data-pName");
      const newName = projNameEditInput.value;
      const newDate = projDateEditInput.value;
      if(newName){
        DB.editProj(pName, newName, newDate);
        UI.removePopups();  
      }else{
        projEditorErrorMsg.textContent = "Error: Name field cannot be empty"
      }
    })
    projEditorDeleteBtn.addEventListener("click", (e)=>{
      e.preventDefault();
      const pName = projEditorForm.getAttribute("data-pName");
      DB.deleteProj(pName);
      if(currentProjHeading.textContent === pName){
        UI.loadProjectTasks("Daily");
      }
      UI.removePopups();
    })
    projEditorCloseBtn.addEventListener("click", (e)=>{
      e.preventDefault();
      UI.removePopups();
    })
  }

  static initTaskEditor(){
    taskEditorForm.addEventListener("submit", (e)=>{
      e.preventDefault();
      const pName = taskEditorWindow.getAttribute("data-pName");
      const taskIndex = taskEditorWindow.getAttribute("data-taskIndex");
      const newTask = taskEditInput.value; 
      if(newTask){ 
        DB.editTask(pName, taskIndex, newTask);
        UI.removePopups();
      }else{
        taskEditorErrorMsg.textContent = "Error: Cannot create an empty task"
      }
    })
    taskEditorDeleteBtn.addEventListener("click", (e)=>{
      e.preventDefault();
      const pName = taskEditorWindow.getAttribute("data-pName");
      const taskIndex = taskEditorWindow.getAttribute("data-taskIndex");
      DB.deleteTask(pName, taskIndex);
      UI.removePopups();
    })
    taskEditorCloseBtn.addEventListener("click", (e)=>{
      e.preventDefault();
      UI.removePopups();
    })
  }

  static loadAdders(){
    addProjBtn.addEventListener("click", UI.openProjCreator);
    addTaskBtn.addEventListener("click", UI.openTaskCreator);
  }

  static unLoadAdders(){
    addProjBtn.removeEventListener("click", UI.openProjCreator);
    addTaskBtn.removeEventListener("click", UI.openTaskCreator);
  }

  static initPopupCloser(){
    for (let btn of allPopupCloseBtns){
      btn.addEventListener("click", ()=>{
        UI.removePopups();
      })
    }
  }

  static initRoutineProjBtns(){
    for(let btn of routineProjectBtns){
      const pName = btn.getAttribute("data-pName");
      btn.addEventListener("click", ()=>{
        UI.loadProjectTasks(pName);
      });
    }
  }

/***************************************************************************************
 * Project buttons and task lists loaders 
 ***************************************************************************************/

static loadProjectBtns(){
    DB.getMyData().then(result=>{
      newProjBtnsContainer.innerHTML = "";
      const myData = JSON.parse(result);
      const myProjArray = myData.projects;
      myProjArray.forEach(proj=>{
        if(
        proj.name !== "Daily" &&
        proj.name !== "Weekly" &&
        proj.name !== "Monthly" &&
        proj.name !== "Yearly"){
          UI.insertProjBtn(proj.name, proj.date);   
        }
      })
    }).catch(err=>{
      console.log("Error getting cloud data:", err);
    })
  }

  static loadProjectTasks(pName){
    currentProjTasksList.textContent = ""; //clear
    DB.getMyData().then(result=>{
      const myData = JSON.parse(result);
      const myProjArray = myData.projects;
      myProjArray.forEach(proj=>{
        if(proj.name === pName){
          currentProjHeading.textContent = `${pName}`;
          currentProjDate.textContent = "";
          if(proj.date){
            currentProjDate.textContent = `Due: ${UI.formatDate(proj.date)}`;
          }
          let index = 0;
          proj.tasks.forEach(task=>{
            UI.insertTask(task.text, task.done, pName, index);
            index++;
          })
        }
      })
    }).catch(err=>{
      console.log("Error getting cloud data:", err);
    })
  }

/***************************************************************************************
 * Project button and task entry builders 
 ***************************************************************************************/
 static insertProjBtn(pName, pDate){
  const projNavBtnEntry = document.createElement("div");
  projNavBtnEntry.setAttribute("class", "projNavBtnEntry");
  const projNavBtn = document.createElement("div");
  projNavBtn.classList.add("projNavBtn");
  projNavBtn.setAttribute("data-pName", pName);
  const pNameLabel = document.createElement("div");
  pNameLabel.classList.add("pNameLabel");
  pNameLabel.textContent = `${pName}`;
  const pDateLabel = document.createElement("div");
  pDateLabel.textContent = `Due: ${pDate}`; 
  projNavBtn.append(pNameLabel, pDateLabel);
  projNavBtn.addEventListener("click", ()=>{
    UI.loadProjectTasks(pName);
  })
  const projEditBtn = document.createElement("img");
  projEditBtn.classList.add("projEditBtn");
  projEditBtn.src = "images/edit.svg";
  projEditBtn.addEventListener("click", ()=>{
    UI.removePopups();
    projEditorWindow.style.display = "block";
    projEditorForm.setAttribute("data-pName", pName);
    projEditorForm.setAttribute("data-pDate", pDate);
    projEditorTitle.textContent = `Edit Project: ${pName}`;
    projNameEditInput.value = pName;
    projDateEditInput.value = pDate;
    projNameEditInput.focus();
  })
  projNavBtnEntry.append(projNavBtn, projEditBtn);
  newProjBtnsContainer.append(projNavBtnEntry);   
}

static insertTask(string, done, pName, tIndex){ 
  const taskEntry = document.createElement("div");
  taskEntry.setAttribute("class", "taskEntry");
  const taskText = document.createElement("div");
  taskText.textContent = `${string}`; 
  taskText.setAttribute("class", "taskText");
  taskText.addEventListener("click", ()=>{
    UI.populateTaskEditor(tIndex, pName, string);
  })
    const checkbox = document.createElement("img");
  checkbox.setAttribute("class", "checkBox");
  if(done){
    checkbox.src = "images/boxChecked.svg";
    taskText.style.textDecoration = "line-through";
  }else{
    checkbox.src = "images/boxUnchecked.svg";
    taskText.style.textDecoration = "";
  }
  checkbox.addEventListener("click", (e)=>{
    if(done){
      done = false;
      e.target.setAttribute("src", "images/boxUnchecked.svg");
      taskText.style.textDecoration = "";
      DB.toggleTaskDoneStatus(pName, tIndex);
    }else{
      done = true;
      e.target.setAttribute("src", "images/boxChecked.svg");
      taskText.style.textDecoration = "line-through";
      DB.toggleTaskDoneStatus(pName, tIndex);
    }
  })
  const taskEditBtn = document.createElement("img");
  taskEditBtn.src = "images/edit.svg";
  taskEditBtn.setAttribute("class", "taskEditBtn");
  taskEditBtn.setAttribute("data-taskIndex", `${tIndex}`); 
  taskEditBtn.addEventListener("click", ()=>{
    UI.removePopups();
    UI.populateTaskEditor(tIndex, pName, string);
  })
  taskEntry.append(checkbox, taskText, taskEditBtn);
  currentProjTasksList.append(taskEntry); 
}


/***************************************************************************************
 * Other UI and utility functions
 ***************************************************************************************/

  static unLoadProjectBtns(){
    newProjBtnsContainer.innerHTML = "";
  }

  static unLoadProjectTasks(){
    currentProjTasksList.innerHTML = "";
  }

  static openProjCreator(){
    UI.removePopups();
    projCreatorWindow.style.display = "block";
    projCreatorNameInput.focus();
  }

  static openTaskCreator(){
    UI.removePopups();
    taskCreatorWindow.style.display = "block";
    taskTextArea.focus();
  }

  static removePopups(){
    for(let popup of allPopups){
      popup.style.display = "none";
    }
    for(let form of allPopupForms){
      form.reset();
    }
    for(let msg of allPopupErrMsgs){
      msg.textContent="";
    }
  }

  static populateTaskEditor(tIndex, pName, string){
    taskEditorWindow.style.display = "block";
    taskEditorWindow.setAttribute("data-taskIndex", tIndex);
    taskEditorWindow.setAttribute("data-pName", pName);
    taskEditorTitle.textContent = `Edit Task ${tIndex+1}`
    taskEditInput.value = string;
    taskEditInput.focus();
  }

  static displayNewProject(pName, pDate){
    currentProjHeading.textContent = `${pName}`;
    currentProjTasksList.innerHTML = "";
    currentProjDate.textContent = "";
    if(pDate){
      currentProjDate.textContent = `Due: ${UI.formatDate(pDate)}`;  
    }
  }

  static formatDate(date){
    const array = date.split("-");
    const year = Number(array[0]);
    const month = Number(array[1])-1;
    const day = Number(array[2]);
    return format(new Date(year, month, day), 'yyyy/MMM/dd');
  }

}

