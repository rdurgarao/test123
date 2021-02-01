import React, { Component } from "react";
import PropTypes from "prop-types";
import tmsService from "../../services/tmsService";
import { NotificationManager } from "react-notifications";
import { RESET_PASSWORD_URL } from "../../constants/HomeConstants";
import LoadingOverlay from "react-loading-overlay";
import Loader from "react-loader-spinner";

import { LinkButtons, HeaderBar, SubmitButtons } from "../../custom";

const title = {
  pageTitle: ""
};

export default class ResetPassword extends Component {
  constructor() {
    super();

    this.state = {
      username: "",
      password: "",
      updated: false,
      isLoading: true,
      error: false
    };
  }

  async componentDidMount() {
    const {
      match: {
        params: { token }
      }
    } = this.props;

    const params = token;

    tmsService
      .resetPasswordLink(RESET_PASSWORD_URL, params)
      .then(result => {
        if (result.resp.message !== "password reset link a-ok") {
          this.setState({
            updated: false,
            isLoading: false,
            error: true
          });
        } else {
          this.setState({
            username: result.resp.username,
            updated: false,
            isLoading: false,
            error: false
          });
        }
        return result;
      })
      .catch(function(err) {
        NotificationManager.error(err, "Error", 2000);
      });
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  updatePassword = async e => {
    e.preventDefault();
    const { username, password } = this.state;
    const {
      match: {
        params: { token }
      }
    } = this.props;

    tmsService
      .updatePassword({
        username,
        password,
        resetPasswordToken: token
      })
      .then(result => {
        if (result.resp.message !== "password updated") {
          this.setState({
            updated: true,
            error: false
          });
          NotificationManager.success(
            "Your password has been successfully reset, please try logging in again.",
            "Success"
          );
          this.props.history.push("/login");
        } else {
          this.setState({
            updated: false,
            error: true
          });
        }
        return result;
      })
      .catch(function(err) {
        NotificationManager.error(err, "Error", 2000);
      });
  };

  render() {
    const { password, error } = this.state;

    if (error) {
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
                      className="fa fa-exclamation-triangle fa-5x align-center"
                      aria-hidden="true"
                    ></i>
                    <span className="profile100-form-title p-b-43" id="account">
                      Reset Password!
                    </span>
                    <section className="width-90 profile-left">
                      <div className="profile-input100 profile-account-input">
                        <h4>
                          Problem resetting password. Please send another reset
                          link.
                        </h4>
                      </div>
                      <br />
                      <div
                        className="profile-input100 profile-account-input"
                        align="center"
                      >
                        <LinkButtons buttonText="Login" link="/login" />
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <LinkButtons
                          buttonText="Forgot Password?"
                          link="/forgotPassword"
                        />
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
    } else {
      return (
        <div>
          <LoadingOverlay
            active={this.state.isLoading}
            spinner={<Loader type="Watch" height={100} width={100} />}
          >
            <HeaderBar title={title} />
            <div className="limiter">
              <div className="container-profile100">
                <div className="wrap-profile100">
                  <form
                    className="profile100-form validate-form forgot-password"
                    onSubmit={this.updatePassword}
                  >
                    <fieldset className="profile100-fieldset">
                      <i
                        className="fa fa-user-circle fa-5x align-center"
                        aria-hidden="true"
                      ></i>
                      <span
                        className="profile100-form-title p-b-43"
                        id="account"
                      >
                        Reset Password!
                      </span>
                      <section className="width-90 profile-left">
                        <div className="wrap-input100 profile-input100 profile-account-input">
                          <input
                            className="input100 profile-input"
                            type="password"
                            id="password"
                            label="password"
                            value={password}
                            onChange={this.handleChange("password")}
                            placeholder="Password"
                          />
                          <span className="focus-input100"></span>
                          <span className="label-input100 profile-input-label"></span>
                        </div>
                        <br />
                        <div
                          className="profile-input100 profile-account-input"
                          align="center"
                        >
                          <SubmitButtons buttonText="Update Password" />
                        </div>
                        <br />
                      </section>
                    </fieldset>
                  </form>
                </div>
              </div>
            </div>
          </LoadingOverlay>
        </div>
      );
    }
  }
}

ResetPassword.propTypes = {
  // eslint-disable-next-line react/require-default-props
  match: PropTypes.shape({
    params: PropTypes.shape({
      token: PropTypes.string.isRequired
    })
  })
};
