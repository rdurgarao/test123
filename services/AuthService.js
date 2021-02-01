import request from "reqwest";
import when from "when";
import { LOGIN_URL, SIGNUP_URL } from "../constants/LoginConstants";
import {
  GET_USERS_LIST_URL,
  GET_USER_DATA_URL,
  CREATE_USER_DATA_URL
} from "../constants/HomeConstants";
import LoginActions from "../actions/LoginActions";
import LoginHelper from "../helpers/LoginHelper";

class AuthService {
  authHeader() {
    // return authorization header with jwt token
    const currentUser = LoginHelper;

    if (currentUser.isLoggedIn() && currentUser.token) {
      return {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.token}`
      };
    } else {
      return {};
    }
  }

  login(username, password) {
    return this.handleAuth(
      when(
        request({
          url: LOGIN_URL,
          method: "POST",
          crossOrigin: true,
          type: "json",
          data: {
            username,
            password
          }
        })
      )
    );
  }

  logout(history) {
    LoginActions.logoutUser(history);
  }

  signup(userdata) {
    return when(
      request({
        url: SIGNUP_URL,
        method: "POST",
        crossOrigin: true,
        headers: this.authHeader(),
        type: "json",
        data: JSON.stringify(userdata)
      })
    );
  }

  getAllEmployees() {
    return when(
      request({
        url: GET_USERS_LIST_URL,
        method: "GET",
        headers: this.authHeader(),
        crossOrigin: true,
        type: "json"
      })
    );
  }

  getData(userid, date) {
    return when(
      request({
        url: GET_USER_DATA_URL + "/" + userid + "/" + date,
        method: "GET",
        headers: this.authHeader(),
        crossOrigin: true,
        type: "json"
      })
    );
  }

  postData(userid, date, data) {
    return when(
      request({
        url: CREATE_USER_DATA_URL + "/" + userid + "/" + date,
        method: "POST",
        crossOrigin: true,
        headers: this.authHeader(),
        type: "json",
        data: JSON.stringify(data)
      })
    );
  }

  handleAuth(loginPromise) {
    return loginPromise.then(function(response) {
      var jwt = response.id_token;
      LoginActions.loginUser(jwt, response);
      return true;
    });
  }
}

export default new AuthService();
