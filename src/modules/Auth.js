import UI from './UI';

const topHeader = document.getElementById('topHeader');
const headerAuthBtn = document.getElementById('headerAuthBtn');
const accountProvider = document.getElementById('accountProvider');
const accountDisplayName = document.getElementById('accountDisplayName');
const accountDetailsImage = document.getElementById('accountDetailsImage');
const appBody = document.getElementById('appBody');
const loginModal = document.getElementById('loginModal');
const loginForm = document.getElementById('loginForm');
const loginEmailInput = document.getElementById('loginEmailInput');
const loginFormSignupBtn = document.getElementById('loginFormSignupBtn');
const signupModal = document.getElementById('signupModal');
const signupForm = document.getElementById('signupForm');
const signupEmailInput = document.getElementById('signupEmailInput');
const signupCancelBtn = document.getElementById('signupCancelBtn');
const logoutBtn = document.getElementById('logoutBtn');
const accountModal = document.getElementById('accountModal');
const loginErrorMsg = document.getElementById('loginErrorMsg');
const signupErrorMsg = document.getElementById('signupErrorMsg');
const googleAuthBtn = document.getElementById('googleAuthBtn');
const facebookAuthBtn = document.getElementById('facebookAuthBtn');
const githubAuthBtn = document.getElementById('githubAuthBtn');
const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
const facebookAuthProvider = new firebase.auth.FacebookAuthProvider();
const githubAuthProvider = new firebase.auth.GithubAuthProvider();

export default class Auth {
  // adds event listeners to authentication forms and buttons
  static initAuth() {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      Auth.signInWithEmailAndPassword();
    });
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      Auth.createUserWithEmailAndPassword();
    });
    loginFormSignupBtn.addEventListener('click', (e) => {
      e.preventDefault();
      signupModal.style.display = 'flex';
      signupEmailInput.focus();
    });
    signupCancelBtn.addEventListener('click', (e) => {
      e.preventDefault();
      signupForm.reset();
      signupModal.style.display = 'none';
      loginEmailInput.focus();
    });
    headerAuthBtn.addEventListener('click', () => {
      UI.removePopups();
      accountModal.style.display = 'block';
    });
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      Auth.signOut();
      accountModal.style.display = 'none';
    });
    googleAuthBtn.addEventListener('click', (e) => {
      e.preventDefault();
      Auth.signInWithGoogle();
    });
    facebookAuthBtn.addEventListener('click', (e) => {
      e.preventDefault();
      Auth.signInWithFacebook();
    });
    githubAuthBtn.addEventListener('click', (e) => {
      e.preventDefault();
      Auth.signInWithGithub();
    });
  }

  static signInWithGoogle() {
    firebase.auth().signInWithPopup(googleAuthProvider).then((cred) => {
      console.log(`Logged in using Google with firebase uid ${cred.user.uid}`);
    }).catch((err) => {
      loginErrorMsg.innerHTML = err;
    });
  }

  // fb prob
  static signInWithFacebook() {
    firebase.auth().signInWithPopup(facebookAuthProvider).then((cred) => {
      console.log(`Logged in using Facebook with firebase uid ${cred.user.uid}`);
    }).catch((err) => {
      loginErrorMsg.innerHTML = err;
    });
  }

  static signInWithGithub() {
    firebase.auth().signInWithPopup(githubAuthProvider).then((cred) => {
      console.log(`Logged in using Github with firebase uid ${cred.user.uid}`);
    }).catch((err) => {
      loginErrorMsg.innerHTML = err;
    });
  }

  static signInWithEmailAndPassword() {
    const email = loginForm.loginEmailInput.value;
    const password = loginForm.loginPasswordInput.value;
    firebase.auth().signInWithEmailAndPassword(email, password).then((cred) => {
      console.log(`Logged in using email and password ${cred.user.uid}`);
      loginErrorMsg.innerHTML = '';
    }).catch((err) => {
      loginErrorMsg.innerHTML = err;
    });
  }

  static createUserWithEmailAndPassword() {
    const email = signupForm.signupEmailInput.value;
    const password = signupForm.signupPasswordInput.value;
    firebase.auth().createUserWithEmailAndPassword(email, password).then((cred) => {
      console.log(`Signed up with email: ${cred.user.email} and uid: ${cred.user.uid}`);
      loginErrorMsg.innerHTML = '';
    }).catch((err) => {
      signupErrorMsg.innerHTML = err.message;
    });
  }

  static signOut() {
    firebase.auth().signOut();
  }

  static showLoginWindow() {
    topHeader.style.display = 'none';
    appBody.style.display = 'none';
    loginModal.style.display = 'flex';
    loginEmailInput.focus();
  }

  static hideLoginWindow() {
    topHeader.style.display = '';
    appBody.style.display = '';
    loginModal.style.display = 'none';
    signupModal.style.display = 'none';
  }

  static loadAuthData(user) {
    const { providerData } = user;
    console.log(
      `Provider Data:
      displayName: ${providerData[0].displayName}, 
      email: ${providerData[0].email},
      phoneNumber: ${providerData[0].phoneNumber}, 
      photoURL: ${providerData[0].photoURL}, 
      providerId: ${providerData[0].providerId}, 
      provider uid: ${providerData[0].uid},
      firebase auth uid: ${user.uid}`,
    );
    const { email } = providerData[0];
    const { providerId } = providerData[0];
    const { displayName } = providerData[0];
    const { photoURL } = providerData[0];
    if (providerId != 'password') {
      accountProvider.textContent = providerId;
    } else {
      accountProvider.textContent = '';
    }
    if (email) {
      headerAuthBtn.textContent = email;
    } else {
      headerAuthBtn.textContent = displayName;
    }
    if (displayName) {
      accountDisplayName.textContent = displayName;
    } else {
      accountDisplayName.textContent = email;
    }
    accountDetailsImage.setAttribute('src', photoURL);
  }
}
