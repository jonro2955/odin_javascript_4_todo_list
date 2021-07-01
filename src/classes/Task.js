export default class Task {
  
  constructor(taskString) {
    this.text = taskString;
    this.done = false;
  }

  setTask(taskString){
    this.text = taskString;
  }

  toggleDone(){
    if(this.checked){
      this.checked = false;
    } else {
      this.checked = true;
    }
  }


}
