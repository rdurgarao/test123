import request from "reqwest";
import when from "when";
import {
  CREATE_CLIENT_DATA_URL,
  GET_CLIENT_LIST_URL,
  CREATE_PROJECT_DATA_URL,
  GET_PROJECT_LIST_URL,
  GET_PROJECT_CLIENTID_URL,
  GET_ROLE_LIST_URL,
  GET_USERDATA_BYID_URL,
  UPDATEUSER_URL,
  GET_CLIENTDATA_BYID_URL,
  UPDATECLIENT_URL,
  GET_PROJECTDATA_BYID_URL,
  UPDATEPROJECT_URL,
  CREATE_HOLIDAY_DATA_URL,
  GET_HOLIDAY_LIST_URL,
  GET_HOLIDAYDATA_BYID_URL,
  UPDATEHOLIDAY_URL,
  USERDELETE_URL
} from "../constants/ClientProjectConstants";
import LoginHelper from "../helpers/LoginHelper";

class ProjectService {
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
  /*Client*/

  clientpostData(clientname) {
    return when(
      request({
        url: CREATE_CLIENT_DATA_URL,
        method: "POST",
        crossOrigin: true,
        headers: this.authHeader(),
        type: "json",
        data: JSON.stringify(clientname)
      })
    );
  }
  getAllClients() {
    return when(
      request({
        url: GET_CLIENT_LIST_URL,
        method: "GET",
        headers: this.authHeader(),
        crossOrigin: true,
        type: "json"
      })
    );
  }
  getAllProject() {
    return when(
      request({
        url: GET_PROJECT_LIST_URL,
        method: "GET",
        headers: this.authHeader(),
        crossOrigin: true,
        type: "json"
      })
    );
  }
  getProjectsByClientID(id) {
    return when(
      request({
        url: GET_PROJECT_CLIENTID_URL + "/" + id,
        method: "GET",
        headers: this.authHeader(),
        crossOrigin: true,
        type: "json"
      })
    );
  }
  projectpostData(clientname) {
    return when(
      request({
        url: CREATE_PROJECT_DATA_URL,
        method: "POST",
        crossOrigin: true,
        headers: this.authHeader(),
        type: "json",
        data: JSON.stringify(clientname)
      })
    );
  }
  getAllRoles() {
    return when(
      request({
        url: GET_ROLE_LIST_URL,
        method: "GET",
        headers: this.authHeader(),
        crossOrigin: true,
        type: "json"
      })
    );
  }
  updateuser(userid, userdata) {
    return when(
      request({
        url: UPDATEUSER_URL + "/" + userid,
        method: "POST",
        crossOrigin: true,
        headers: this.authHeader(),
        type: "json",
        data: JSON.stringify(userdata)
      })
    );
  }
  getByClientid(id) {
    return when(
      request({
        url: GET_CLIENTDATA_BYID_URL + "/" + id,
        method: "GET",
        headers: this.authHeader(),
        crossOrigin: true,
        type: "json"
      })
    );
  }
  updateclient(clientid, clientdata) {
    return when(
      request({
        url: UPDATECLIENT_URL + "/" + clientid,
        method: "POST",
        crossOrigin: true,
        headers: this.authHeader(),
        type: "json",
        data: JSON.stringify(clientdata)
      })
    );
  }

  getByProjectid(id) {
    return when(
      request({
        url: GET_PROJECTDATA_BYID_URL + "/" + id,
        method: "GET",
        headers: this.authHeader(),
        crossOrigin: true,
        type: "json"
      })
    );
  }
  updateproject(projectid, projectdata) {
    return when(
      request({
        url: UPDATEPROJECT_URL + "/" + projectid,
        method: "POST",
        crossOrigin: true,
        headers: this.authHeader(),
        type: "json",
        data: JSON.stringify(projectdata)
      })
    );
  }
  holidaypostData(holidaydata) {
    return when(
      request({
        url: CREATE_HOLIDAY_DATA_URL,
        method: "POST",
        crossOrigin: true,
        headers: this.authHeader(),
        type: "json",
        data: JSON.stringify(holidaydata)
      })
    );
  }
  getAllHoliday() {
    return when(
      request({
        url: GET_HOLIDAY_LIST_URL,
        method: "GET",
        headers: this.authHeader(),
        crossOrigin: true,
        type: "json"
      })
    );
  }
  getByHolidayid(id) {
    return when(
      request({
        url: GET_HOLIDAYDATA_BYID_URL + "/" + id,
        method: "GET",
        headers: this.authHeader(),
        crossOrigin: true,
        type: "json"
      })
    );
  }
  updateholiday(holidayid, holidaydata) {
    return when(
      request({
        url: UPDATEHOLIDAY_URL + "/" + holidayid,
        method: "POST",
        crossOrigin: true,
        headers: this.authHeader(),
        type: "json",
        data: JSON.stringify(holidaydata)
      })
    );
  }
  deleteuser(id) {
    return when(
      request({
        url: USERDELETE_URL + "/" + id,
        method: "POST",
        crossOrigin: true,
        headers: this.authHeader(),
        type: "json"
      })
    );
  }
  getByUserid(id) {
    return when(
      request({
        url: GET_USERDATA_BYID_URL + "/" + id,
        method: "GET",
        headers: this.authHeader(),
        crossOrigin: true,
        type: "json"
      })
    );
  }
}

export default new ProjectService();
