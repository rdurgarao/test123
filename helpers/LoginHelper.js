import * as Constants from "../constants/LoginConstants";
import BaseHelper from "./BaseHelper";
import jwt_decode from "jwt-decode";

class LoginHelper extends BaseHelper {
  constructor() {
    super();
    this.subscribe(() => this._registerToActions.bind(this));
    this._user = null;
    this._jwt = null;
    this._token = null;
  }

  _registerToActions(action) {
    switch (action.actionType) {
      case Constants.LOGIN_USER:
        this._jwt = action.jwt;
        this._user = jwt_decode(this._jwt);
        this._token = action.jwt;
        this.emitChange();
        break;
      case Constants.LOGOUT_USER:
        this._user = null;
        this.emitChange();
        break;
      default:
        break;
    }
  }

  get user() {
    return this._user;
  }

  get jwt() {
    return this._jwt;
  }

  get token() {
    return this._token;
  }

  isLoggedIn() {
    return !!this._user;
  }
}

export default new LoginHelper();
