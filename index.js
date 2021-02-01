import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import LoginActions from "./actions/LoginActions";

let jwt = localStorage.getItem("jwt");
let response = {
  // role: localStorage.getItem('role'),
  // userName: localStorage.getItem('userName'),
  // userId: localStorage.getItem('userId')
};

if (jwt) {
  LoginActions.loginUser(jwt, response);
}

ReactDOM.render(<App />, document.getElementById("root"));

// if ((window === window.parent) && window === window.top) {
// 	if (!SessionHelper.isTokenExpired) { // check if the expiry time in the storage has not yet passed
// 	  if (jwt) {
// 		// Set the expiry time out 30 minutes from now
// 		SessionHelper.setExpiry()
// 		// At the initialisation of our app we start a session timeout function, which will be triggered after the amount of minutes set in our adal config.
// 		// But first we'll provide a callback to execute at the timeout.
// 		// On the callback we will check the token expiry time and log out the user if necessary.
// 		SessionHelper.expiryTimeoutCallback = function() {
// 		  if (SessionHelper.isTokenExpiredOrNull) {
// 			// clear the session helper
// 			SessionHelper.removeExpiry()
// 			SessionHelper.stopExpiryTimeout()
// 			LoginActions.logoutUser()
// 		  } else {
// 			SessionHelper.resetExpiryTimeout() // try again later
// 		  }
// 		}
// 		// Then we'll start the timer
// 		SessionHelper.startExpiryTimeout()
// 		// After we've prepared everything for the session helper, we render the authenticated part of our app
// 		ReactDOM.render(<App />, document.getElementById('root'))
// 	  }
// 	} else { // clear the expiry value from storage, stop the timeout function and logout the user
// 	  SessionHelper.removeExpiry()
// 	  SessionHelper.stopExpiryTimeout()
// 	  LoginActions.logoutUser()
// 	}
// }

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
