import React, { Component } from "react";
import tmsService from "../../services/tmsService";
import { NotificationManager } from "react-notifications";

import { LinkButtons, SubmitButtons, HeaderBar } from "../../custom";

const title = {
  pageTitle: ""
};

class ForgotPassword extends Component {
  constructor() {
    super();

    this.state = {
      email: ""
    };
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  sendEmail = async e => {
    e.preventDefault();
    const { email } = this.state;
    if (email !== "") {
      tmsService
        .forgotPassword(email)
        .then(result => {
          if (result.resp === "email not in db") {
            NotificationManager.error(
              "That email address isn&apos;t recognized. Please try again or contact administrator.",
              "Error",
              2000
            );
          } else {
            NotificationManager.success(
              "Password Reset Email Successfully Sent!",
              "Success"
            );
          }
          return result;
        })
        .catch(function(err) {
          NotificationManager.error(err, "Error", 2000);
        });
    }
  };

  render() {
    const { email } = this.state;

    return (
      <div>
        <HeaderBar title={title} />
        <div className="limiter">
          <div className="container-profile100">
            <div className="wrap-profile100">
              <form
                className="profile100-form validate-form forgot-password"
                onSubmit={this.sendEmail}
              >
                <fieldset className="profile100-fieldset">
                  <i
                    className="fa fa-lock fa-5x align-center"
                    aria-hidden="true"
                  ></i>
                  <span className="profile100-form-title p-b-43" id="account">
                    Forgot Password?
                  </span>
                  <section className="width-90 profile-left">
                    <div className="wrap-input100 profile-input100 profile-account-input">
                      <input
                        className="input100 profile-input"
                        type="text"
                        id="email"
                        label="email"
                        value={email}
                        onChange={this.handleChange("email")}
                        placeholder="Email Address"
                        required
                      />
                      <span className="focus-input100"></span>
                      <span className="label-input100 profile-input-label"></span>
                    </div>
                    <br />
                    <div
                      className="profile-input100 profile-account-input"
                      align="center"
                    >
                      <LinkButtons buttonText="Login" link="/login" />
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <SubmitButtons buttonText="Send Password Reset Email" />
                    </div>
                    <br />
                  </section>
                </fieldset>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ForgotPassword;
