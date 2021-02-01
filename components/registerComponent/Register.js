import React, { Component } from "react";
import $ from "jquery";
import { Link } from "react-router-dom";
import Auth from "../../services/AuthService";
import "react-notifications/lib/notifications.css";
import { NotificationManager } from "react-notifications";

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      isActive: false
    };

    this.handleInputChange = this.handleInputChange.bind(this);
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

  showValidate(input) {
    let thisAlert = $(input).parent();

    $(thisAlert).addClass("alert-validate");
  }

  signup(e) {
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
      Auth.signup(
        this.state.email,
        this.state.password,
        this.state.firstName,
        this.state.lastName,
        this.state.isActive
      )
        .then(result => {
          NotificationManager.success("User registered Successfully", "Succes");
          this.props.history.push("/login");
          return result;
        })
        .catch(function(err) {
          NotificationManager.error(
            "User already exists. Please try other.",
            "Error",
            2000
          );
        });
    } else {
      NotificationManager.error("Please check all fields.", "Error", 2000);
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
              <span className="login100-form-title p-b-43">Register</span>
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
                />
                <span className="focus-input100"></span>
                <span className="label-input100">Password</span>
              </div>
              <div
                className="wrap-input100 validate-input"
                data-validate="First Name is required"
              >
                <input
                  className="input100"
                  type="text"
                  name="firstName"
                  value={this.state.firstName}
                  onChange={this.handleInputChange}
                />
                <span className="focus-input100"></span>
                <span className="label-input100">First Name</span>
              </div>
              <div
                className="wrap-input100 validate-input"
                data-validate="Last Name is required"
              >
                <input
                  className="input100"
                  type="text"
                  name="lastName"
                  value={this.state.lastName}
                  onChange={this.handleInputChange}
                />
                <span className="focus-input100"></span>
                <span className="label-input100">Last Name</span>
              </div>
              <div className="container-login100-form-btn">
                <button
                  className="login100-form-btn"
                  onClick={this.signup.bind(this)}
                >
                  Register
                </button>
              </div>
              <div className="text-center p-t-46 p-b-20">
                <span className="txt2">or login</span>
              </div>
              <div className="login100-form-social flex-c-m">
                <Link
                  to="/login"
                  className="login100-form-social-item flex-c-m bg1 m-r-5"
                >
                  <i
                    className="fa fa-arrow-circle-o-right"
                    aria-hidden="true"
                  ></i>
                </Link>
              </div>
            </form>
            <div className="signup100-more login100-more"></div>
          </div>
        </div>
      </div>
    );
  }
}

export default Register;
