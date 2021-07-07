import Project from "./Project.js";

export default class Collection {
  constructor() {
    this.projects = [];
    this.projects.push(new Project("Daily", ""));
    this.projects.push(new Project("Weekly", ""));
    this.projects.push(new Project("Monthly", ""));
    this.projects.push(new Project("Yearly", ""));
  }

  setProjects(projects) {
    this.projects = projects;
  }

  addProject(project) {
    this.projects.push(project);
  }
}
