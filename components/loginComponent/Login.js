import React, { Component } from "react";
import $ from "jquery";
import { Link } from "react-router-dom";
import Auth from "../../services/AuthService";
import "react-notifications/lib/notifications.css";
import { NotificationManager } from "react-notifications";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      rememberMe: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.rememberMe = this.rememberMe.bind(this);
  }

  login(e) {
    e.preventDefault();

    let check = true;
    const input = $(".validate-input .input100");

    for (let i = 0; i < input.length; i++) {
      if (this.validate(input[i]) === false) {
        this.showValidate(input[i]);
        check = false;
      }
    }

    if (check) {
      Auth.login(this.state.email, this.state.password, this.state.rememberMe)
        .then(result => {
          NotificationManager.success(
            localStorage.getItem("userName"),
            "Welcome"
          );
          this.props.history.push("/home");
          return result;
        })
        .catch(function(err) {
          const error = JSON.parse(err.response);
          NotificationManager.error(error.message, "Error", 2000);
        });
    } else {
      NotificationManager.error("UnAuthorized Access", "Error", 2000);
    }
  }

  rememberMe() {
    this.setState({
      rememberMe: !this.state.rememberMe
    });
  }

  showValidate(input) {
    let thisAlert = $(input).parent();

    $(thisAlert).addClass("alert-validate");
  }

  hideValidate(input) {
    var thisAlert = $(input).parent();

    $(thisAlert).removeClass("alert-validate");
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: target.value
    });

    $(".validate-form .input100").each(function() {
      $(this).focus(function() {
        //  this.hideValidate(this);
      });
    });
  }

  validate(input) {
    const emailRegex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/;

    if (
      $(input).attr("type") === "email" ||
      $(input).attr("name") === "email"
    ) {
      if (
        $(input)
          .val()
          .trim()
          .match(emailRegex) == null
      ) {
        return false;
      }
    } else {
      if (
        $(input)
          .val()
          .trim() === ""
      ) {
        return false;
      }
    }
  }

  // here is our UI
  // it is easy to understand their functions when you
  // see them render into our screen
  render() {
    return (
      <div className="limiter">
        <div className="container-login100">
          <div className="wrap-login100">
            <form className="login100-form validate-form">
              <span className="login100-form-title p-b-43">
                Login to continue
              </span>
              <div
                className="wrap-input100 validate-input"
                data-validate="Valid email is required: ex@abc.xyz"
              >
                <input
                  className="input100"
                  type="text"
                  name="email"
                  value={this.state.email}
                  onChange={this.handleInputChange}
                />
                <span className="focus-input100"></span>
                <span className="label-input100">Email</span>
              </div>
              <div
                className="wrap-input100 validate-input"
                data-validate="Password is required"
              >
                <input
                  className="input100"
                  type="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleInputChange}
                  autoComplete="on"
                />
                <span className="focus-input100"></span>
                <span className="label-input100">Password</span>
              </div>
              <div className="flex-sb-m w-full p-t-3 p-b-32">
                <div className="contact100-form-checkbox">
                  <input
                    className="input-checkbox100"
                    id="ckb1"
                    type="checkbox"
                    name="remember-me"
                    onChange={this.rememberMe}
                  />
                  <label className="label-checkbox100" htmlFor="ckb1">
                    Remember me
                  </label>
                </div>
                <div>
                  <Link to="/forgotPassword" className="txt1">
                    Forgot Password?
                  </Link>
                </div>
              </div>
              <div className="container-login100-form-btn">
                <button
                  className="login100-form-btn"
                  onClick={this.login.bind(this)}
                >
                  Login
                </button>
              </div>
              <div className="text-center p-t-46 p-b-20">
                <span className="txt2">or sign up using</span>
              </div>
              <div className="login100-form-social flex-c-m">
                <Link
                  to="/register"
                  className="login100-form-social-item flex-c-m bg3 m-r-5"
                >
                  <i className="fa fa-sign-in" aria-hidden="true"></i>
                </Link>
              </div>
            </form>
            <div className="login100-more">
              <div className="login100-more-text">
                <h1 style={{ fontSize: "60px" }}>Welcome to</h1>
                <h1 style={{ fontSize: "38px" }}>Vaco Binary Semantics LLP</h1>
                <h1 style={{ fontSize: "30px" }}>Timesheet Portal!</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
