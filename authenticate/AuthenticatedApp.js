import React from "react";
import LoginHelper from "../helpers/LoginHelper";
import { NavLink, Route } from "react-router-dom";
import AuthService from "../services/AuthService";
import "../components/homeComponent/Home.css";
import Home from "../components/homeComponent/Home";
import AuthenticatedComponent from "./AuthenticatedComponent";
import logo from "../assets/company_logo.png";
import ForbiddenError from "../commons/error/ForbiddenError";

export default class AuthenticatedApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = this._getLoginState();
    if (
      !this.state.userLoggedIn &&
      !/forgotPassword/.test(window.location.href)
    ) {
      this.props.history.push("/login");
    }
  }

  _getLoginState() {
    return {
      userLoggedIn: LoginHelper.isLoggedIn()
    };
  }

  logout(e) {
    e.preventDefault();
    AuthService.logout(this.props.history);
  }

  componentDidMount() {
    this.changeListener = this._onChange.bind(this);
    LoginHelper.addChangeListener(this.changeListener);
  }

  _onChange() {
    this.setState(this._getLoginState());
  }

  componentWillUnmount() {
    LoginHelper.removeChangeListener(this.changeListener);
  }

  render() {
    return <div>{this.headerItems}</div>;
  }

  get headerItems() {
    if (this.state.userLoggedIn) {
      return (
        <div>
          <nav className="fixed-top mb-1 navbar navbar-expand-lg navbar-dark tms-color">
            <img src={logo} alt="company_logo" className="navbar-brand logo" />
            <NavLink
              className="navbar-brand"
              activeClassName="active"
              to="/home"
            >
              <i className="fa fa-home" aria-hidden="true"></i>
            </NavLink>
            <NavLink
              className="navbar-brand"
              activeClassName="active"
              to="/tms"
            >
              TMS
            </NavLink>
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarSupportedContent-4"
              aria-controls="navbarSupportedContent-4"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div
              className="collapse navbar-collapse float-right"
              id="navbarSupportedContent-4"
            >
              <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                  <NavLink className="nav-link" to="#">
                    <span className="welcome-msg">
                      Hello! {localStorage.getItem("userName")}
                    </span>
                  </NavLink>
                </li>
                <li className="nav-item dropdown">
                  <NavLink
                    className="nav-link dropdown-toggle"
                    to="#"
                    id="navbarDropdownMenuLink-4"
                    data-toggle="dropdown"
                    aria-haspopup="true"
                    aria-expanded="false"
                  >
                    <i className="fa fa-user"></i> Account{" "}
                  </NavLink>
                  <div
                    className="dropdown-menu dropdown-menu-right dropdown-info"
                    aria-labelledby="navbarDropdownMenuLink-4"
                  >
                    <NavLink
                      className="dropdown-item"
                      activeClassName="active"
                      to="/profile"
                    >
                      <i className="fa fa-user" aria-hidden="true"></i> Profile
                    </NavLink>
                    <NavLink
                      className="dropdown-item logout"
                      to="/login"
                      onClick={this.logout.bind(this)}
                    >
                      <i className="fa fa-sign-out" aria-hidden="true"></i>{" "}
                      Logout
                    </NavLink>
                  </div>
                </li>
              </ul>
            </div>
          </nav>
          <Route
            name="home"
            path="/home"
            component={Home}
            onEnter={AuthenticatedComponent}
          />
        </div>
      );
    } else {
      return <ForbiddenError />;
    }
  }
}
