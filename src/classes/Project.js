export default class Project {
  
  constructor(name, date) {
    this.name = name;
    this.date = date;
    this.tasks = [];
  }

  setName(name){
    this.name = name;
  }

  setDate(date){
    this.date = date;
  }

  addTask(task){
    this.tasks.push(task);
  }



  
}