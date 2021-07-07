// not required, but eslint will throw "undeclared" error without it
import * as firebase from "firebase";
import Auth from "./modules/Auth.js";
import UI from "./modules/UI.js";
import DB from "./modules/DB.js";

document.addEventListener("DOMContentLoaded", () => {
  Auth.initAuth();
  UI.initProjCreator();
  UI.initTaskCreator();
  UI.initProjEditor();
  UI.initTaskEditor();
  UI.initPopupCloser();
  UI.initRoutineProjBtns();
});

firebase.auth().onAuthStateChanged((usr) => {
  if (usr) {
    DB.initCollection(usr);
    Auth.loadAuthData(usr);
    Auth.hideLoginWindow();
    UI.loadAdders();
    UI.loadProjectBtns();
    UI.loadProjectTasks("Daily");
  } else {
    Auth.showLoginWindow();
    UI.unLoadAdders();
    UI.unLoadProjectBtns();
    UI.unLoadProjectTasks();
  }
});

/**To build using webpack, run the following on the CLI:
 *
 * Add {mode: "development"} on the webpack.config.js file
 * and just run "npx webpack". Or you can run
 * "npx webpack --mode development" (or --mode production)
 *
 * You can add the property {"build": "webpack"} on the package.json
 * file with other build specifications and then simply run
 * "npm run build" instead of running each CLI command for those
 * specifications every time you build.
 *
 * If you have {"watch": "webpack --watch"} on the package.json file,
 * you can run "npm run watch" to make your IDE watch for changes
 * (CTRL+C to stop). If you have a test specified, you can run
 * "npm run test".
 *
 * To make /dist your root folder in gh-pages, run:
 * git subtree push --prefix dist origin gh-pages
 * */
