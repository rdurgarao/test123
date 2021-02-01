import request from "reqwest";
import when from "when";
import {
  GET_USERS_SETTINGS_URL,
  UPDATE_USERS_SETTINGS_URL,
  FORGOT_PASSWORD_URL,
  UPDATE_PASSWORD_URL,
  UPDATE_USER_FIELDS_URL,
  UPDATE_PASSWORD_WITHOUT_LINK_URL
} from "../constants/HomeConstants";
import LoginActions from "../actions/LoginActions";
import LoginHelper from "../helpers/LoginHelper";

class tmsService {
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

  getCurrentUserSeetings(userId) {
    return when(
      request({
        url: GET_USERS_SETTINGS_URL + "/" + userId,
        method: "GET",
        headers: this.authHeader(),
        crossOrigin: true,
        type: "json"
      })
    );
  }

  updateSetting(data, nameChanges, userId) {
    if (nameChanges) {
      const userFieldsobj = {
        firstName: data.firstName,
        lastName: data.lastName
      };
      this.updateUserFields(userFieldsobj, userId);
    }
    return when(
      request({
        url: UPDATE_USERS_SETTINGS_URL + "/" + userId,
        method: "PUT",
        crossOrigin: true,
        headers: this.authHeader(),
        type: "json",
        data: JSON.stringify(data)
      })
    );
  }

  updateUserFields(data, userId) {
    return when(
      request({
        url: UPDATE_USER_FIELDS_URL + "/" + userId,
        method: "PUT",
        crossOrigin: true,
        headers: this.authHeader(),
        type: "json",
        data: JSON.stringify(data)
      })
    );
  }

  forgotPassword(email) {
    return when(
      request({
        url: FORGOT_PASSWORD_URL,
        method: "POST",
        crossOrigin: true,
        type: "json",
        data: { email }
      })
    );
  }

  resetPasswordLink(url, resetPasswordToken) {
    return when(
      request({
        url: url,
        method: "POST",
        crossOrigin: true,
        type: "json",
        data: { resetPasswordToken }
      })
    );
  }

  updatePassword(params) {
    return when(
      request({
        url: UPDATE_PASSWORD_URL,
        method: "POST",
        crossOrigin: true,
        headers: this.authHeader(),
        type: "json",
        data: params
      })
    );
  }

  updatePasswordWithoutLink(userId, params) {
    return when(
      request({
        url: UPDATE_PASSWORD_WITHOUT_LINK_URL + "/" + userId,
        method: "POST",
        crossOrigin: true,
        headers: this.authHeader(),
        type: "json",
        data: JSON.stringify(params)
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

export default new tmsService();
