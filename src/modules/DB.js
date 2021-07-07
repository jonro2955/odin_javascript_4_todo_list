import Collection from '../classes/Collection.js';
import Project from '../classes/Project.js';
import Task from '../classes/Task.js';
import UI from './UI.js';

const db = firebase.firestore().collection('collection');

/** User Data Structure:
 *
 * Each user gets 1 Collection class which has an array.
 * It stores objects of the Project class.
 * Each project has a name, a due date, and an array of Tasks
 * Each Task holds one string property.
 *
 * The Collection class object is stored in firestore as a
 * JSON string (using stringify()). Each user has one document,
 * and in it, oneCollection. The string will be parsed into
 * an object to access its contents.
 */

export default class DB {
  // check for a collection and if not found, create one for new user
  static initCollection(usr) {
    /** Note for db.doc(..ID..).get() method:
     * When using this with multiple authentication providers,
     * the ..ID.. input must be the user object's uid property
     * because that is the only one that will be present and unique for
     * all providers. You cannot use something like the email property
     * because not all providers provide it. For example, Facebook
     * users can make their email address as private in their settings.
     */
    const { uid } = usr;
    db.doc(uid).get().then((doc) => {
      if (!doc.exists) {
        const string = JSON.stringify(new Collection());
        db.doc(uid).set({ myData: string });
        console.log(`Initialized new firestore collection for ${uid}`);
      }
    }).catch((err) => {
      console.log('Error getting cloud data, likely due to new user:', err);
    });
  }

  // get user data as a JSON string
  static getMyData() {
    const { uid } = firebase.auth().currentUser;
    /* To return the asynchronous return value of the .get() method,
    you must return the whole db.get() method call and attach
    a then() to it. Its results must also be returned inside the
    then() scope */
    return db.doc(uid).get().then((doc) => doc.data().myData).catch((err) => {
      console.log('Error getting cloud data, likely due to new user:', err);
    });
  }

  // save user data as a JSON string
  static saveMyData(dataObject) {
    const jsonString = JSON.stringify(dataObject);
    const { uid } = firebase.auth().currentUser;
    return db.doc(uid).set({ myData: jsonString });
  }

  static addProject(pName, pDate) {
    const projNavBtns = document.querySelectorAll('.projNavBtn');
    let isDuplicate = false;
    // to prevent duplicates
    for (const btn of projNavBtns) {
      if (btn.textContent === pName) {
        isDuplicate = true;
        alert('Error: Cannot create duplicate project');
        break;
      }
    }
    if (!isDuplicate) {
      DB.getMyData().then((result) => {
        const myData = JSON.parse(result);
        const myProjArray = myData.projects;
        const newProj = new Project(pName, pDate);
        myProjArray.push(newProj); // push
        myData.projects = myProjArray; // set
        DB.saveMyData(myData); // save
      });
    }
  }

  static addTask(string, pName) {
    DB.getMyData().then((result) => {
      const myData = JSON.parse(result);
      const myProjArray = myData.projects;
      myProjArray.forEach((proj) => {
        if (proj.name === pName) {
          const newTask = new Task(string);
          proj.tasks.push(newTask); // push
        }
      });
      myData.projects = myProjArray; // set
      DB.saveMyData(myData); // save
    });
  }

  static editProj(pName, newName, newDate) {
    DB.getMyData().then((result) => {
      const myData = JSON.parse(result);
      const myProjArray = myData.projects;
      myProjArray.forEach((proj) => {
        if (proj.name === pName) {
          proj.name = newName; // set
          proj.date = newDate; // set
        }
      });
      myData.projects = myProjArray;
      DB.saveMyData(myData).then(() => {
        UI.loadProjectBtns();
      });
    });
  }

  static editTask(pName, taskIndex, newTask) {
    DB.getMyData().then((result) => {
      const myData = JSON.parse(result);
      const myProjArray = myData.projects;
      for (let i = 0; i < myProjArray.length; i++) {
        if (myProjArray[i].name === pName) {
          myProjArray[i].tasks[taskIndex].text = newTask; // set
        }
      }
      myData.projects = myProjArray;
      DB.saveMyData(myData).then(() => {
        UI.loadProjectTasks(pName); // reload
      });
    });
  }

  static toggleTaskDoneStatus(pName, tIndex) {
    DB.getMyData().then((result) => {
      const myData = JSON.parse(result);
      const myProjArray = myData.projects;
      for (let i = 0; i < myProjArray.length; i++) {
        if (myProjArray[i].name === pName) {
          if (myProjArray[i].tasks[tIndex].done) {
            myProjArray[i].tasks[tIndex].done = false;
          } else {
            myProjArray[i].tasks[tIndex].done = true;
          }
        }
      }
      myData.projects = myProjArray;
      DB.saveMyData(myData);
    });
  }

  static deleteProj(pName) {
    DB.getMyData().then((result) => {
      const myData = JSON.parse(result);
      const myProjArray = myData.projects;
      for (let i = 0; i < myProjArray.length; i++) {
        if (myProjArray[i].name === pName) {
          myProjArray.splice(i, 1); // splice
        }
      }
      myData.projects = myProjArray;
      DB.saveMyData(myData).then(() => {
        UI.loadProjectBtns(); // reload
      });
    });
  }

  static deleteTask(pName, taskIndex) {
    DB.getMyData().then((result) => {
      const myData = JSON.parse(result);
      const myProjArray = myData.projects;
      for (let i = 0; i < myProjArray.length; i++) {
        if (myProjArray[i].name === pName) {
          myProjArray[i].tasks.splice(taskIndex, 1); // splice
        }
      }
      myData.projects = myProjArray;
      DB.saveMyData(myData).then(() => {
        UI.loadProjectTasks(pName); // reload
      });
    });
  }
}
