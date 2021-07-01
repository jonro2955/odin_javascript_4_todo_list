import Collection from "../classes/Collection.js"; 
import Project from "../classes/Project.js";
import Task from "../classes/Task.js";
import UI from './UI.js';
const db = firebase.firestore().collection("collection");

/**User Data Structure:
 * 
 * Each user gets 1 Collection class which has an array  
 * that stores Project class objects. 
 * Each project has a name, a due date, and an array of Task
 * class objects. Each Task holds
 * a plain string of text describing a task.
 *  
 * The Collection class object will be stored as a 
 * stringified object string inside a single firestore document 
 * per user. The string will be parsed into 
 * an object to access its contents.
 */

export default class DB {

  // check for a collection and if not found, create one for new user
  static initCollection(usr){
    const email = usr.email;
    const displayName = usr.displayName;
    const emailVerified = usr.emailVerified;
    const photoURL = usr.photoURL;
    const isAnonymous = usr.isAnonymous;
    const uid = usr.uid;
    const providerData = usr.providerData;
    console.log(
      `Firebase Authentication Credentials: 
      email: ${email},
      displayName: ${displayName}, 
      emailVerified: ${emailVerified}, 
      photoURL: ${photoURL}, 
      isAnonymous: ${isAnonymous}, 
      uid: ${uid}`
    );
    console.log(
      `Provider Data:
      displayName: ${providerData[0].displayName}, 
      email: ${providerData[0].email},
      phoneNumber: ${providerData[0].phoneNumber}, 
      photoURL: ${providerData[0].photoURL}, 
      providerId: ${providerData[0].providerId}, 
      uid: ${providerData[0].uid}`
    ); 

    const userEmail = providerData[0].email;
    console.log(`Initializing firestore collection for ${userEmail}`);
    db.doc(userEmail).get().then((doc)=>{
      if (!doc.exists) {
        const string = JSON.stringify(new Collection());
        db.doc(userEmail).set({ myData: string });
      } 
    }).catch((err)=>{
        console.log("Error getting cloud data, likely due to new user:", err);
    })
  }

  // get user data as a JSON string
  static getMyData(){
    const userEmail = firebase.auth().currentUser.email;
    /*To return the asynchronous return value of the .get() method,
    you must return the whole db.get() method call and attach 
    a then() to it. Its results must also be returned inside the 
    then() scope*/
    return db.doc(userEmail).get().then(doc=>{  
      return doc.data().myData;
    }).catch(err=>{
      console.log("Error getting cloud data, likely due to new user:", err);
    });
  }

  // save user data as a JSON string
  static saveMyData(dataObject){
    const jsonString = JSON.stringify(dataObject);
    const userEmail = firebase.auth().currentUser.email;
    return db.doc(userEmail).set({ myData: jsonString });
  }
  
  static addProject(pName, pDate){
    const projNavBtns = document.querySelectorAll(".projNavBtn");
    let isDuplicate = false;
    // to prevent duplicates
    for (let btn of projNavBtns) {
      if(btn.textContent === pName){
        isDuplicate = true;
        alert("Error: Cannot create duplicate project");
        break;
      } 
    }
    if(!isDuplicate){
      DB.getMyData().then(result=>{
        const myData = JSON.parse(result);
        const myProjArray = myData.projects;
        const newProj = new Project(pName, pDate);
        myProjArray.push(newProj); // push
        myData.projects = myProjArray; // set 
        DB.saveMyData(myData); // save
        

    })
    } 
  }

  static addTask(string, pName){
    DB.getMyData().then(result=>{
      const myData = JSON.parse(result);
      const myProjArray = myData.projects;
      myProjArray.forEach(proj=>{
        if (proj.name === pName){
          const newTask = new Task(string);
          proj.tasks.push(newTask); // push
        }
      })
      myData.projects = myProjArray; // set
      DB.saveMyData(myData); // save
    })
  }

  static editProj(pName, newName, newDate){
    DB.getMyData().then(result=>{
      const myData = JSON.parse(result);
      const myProjArray = myData.projects;
      myProjArray.forEach(proj=>{
        if(proj.name === pName){
          proj.name = newName; // set
          proj.date = newDate; // set
        }
      })
      myData.projects = myProjArray;
      DB.saveMyData(myData).then(()=>{
        UI.loadProjectBtns(); 
      })
    })
  }

  static editTask(pName, taskIndex, newTask){
    DB.getMyData().then(result=>{
      const myData = JSON.parse(result);
      const myProjArray = myData.projects;
      for(let i = 0; i < myProjArray.length; i++){
        if(myProjArray[i].name === pName){
          myProjArray[i].tasks[taskIndex].text = newTask; // set      
        }
      }
      myData.projects = myProjArray;
      DB.saveMyData(myData).then(()=>{
        UI.loadProjectTasks(pName);  // reload
      })
    })
  }

  static toggleTaskDoneStatus(pName, tIndex){
    DB.getMyData().then(result=>{
      const myData = JSON.parse(result);
      const myProjArray = myData.projects;
      for(let i = 0; i < myProjArray.length; i++){
        if(myProjArray[i].name === pName){
          if(myProjArray[i].tasks[tIndex].done){
            myProjArray[i].tasks[tIndex].done = false;
          }else{
            myProjArray[i].tasks[tIndex].done = true;
          }    
        }
      }
      myData.projects = myProjArray;
      DB.saveMyData(myData);
    })
  }

  static deleteProj(pName){
    DB.getMyData().then(result=>{
      const myData = JSON.parse(result);
      const myProjArray = myData.projects;
      for(let i = 0; i < myProjArray.length; i++){
        if(myProjArray[i].name === pName){
          myProjArray.splice(i, 1); // splice       
        }
      }
      myData.projects = myProjArray;
      DB.saveMyData(myData).then(()=>{
        UI.loadProjectBtns();  // reload
      })
    })
  }

  static deleteTask(pName, taskIndex){
    DB.getMyData().then(result=>{
      const myData = JSON.parse(result);
      const myProjArray = myData.projects;
      for(let i = 0; i < myProjArray.length; i++){
        if(myProjArray[i].name === pName){
          myProjArray[i].tasks.splice(taskIndex, 1); // splice    
        }
      }
      myData.projects = myProjArray;
      DB.saveMyData(myData).then(()=>{
        UI.loadProjectTasks(pName);  // reload
      })
    })
  }

}