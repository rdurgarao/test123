import AppDispatcher from "../dispatchers/AppDispatcher.js";
import { LOGIN_USER, LOGOUT_USER } from "../constants/LoginConstants.js";

export default {
  loginUser: (jwt, response) => {
    var savedJwt = localStorage.getItem("jwt");

    AppDispatcher.dispatch({
      actionType: LOGIN_USER,
      jwt: jwt,
      token: response.access_token
    });

    if (savedJwt !== jwt) {
      localStorage.setItem(
        "userName",
        response.firstName + " " + response.lastName
      );
      localStorage.setItem("userId", response._id);
      localStorage.setItem("user", response.username);
      localStorage.setItem("role", response.roleName);
      localStorage.setItem("jwt", jwt);
    }
  },
  logoutUser: history => {
    history.push("/login");
    localStorage.clear();
    sessionStorage.clear();
    AppDispatcher.dispatch({
      actionType: LOGOUT_USER
    });
  }
};
