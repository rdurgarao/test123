import React, { Component } from "react";
import $ from "jquery";
import _ from "lodash";
import LoginHelper from "../../helpers/LoginHelper";
import Settings from "../../services/tmsService";
import Sidebar from "../../commons/sidebar/Sidebar";
import Footer from "../../commons/footer/Footer";
import "react-notifications/lib/notifications.css";
import { NotificationManager } from "react-notifications";
import tmsService from "../../services/tmsService";
import LoadingOverlay from "react-loading-overlay";
import Loader from "react-loader-spinner";
import Pincodes from "../../pincode.json";
import ForbiddenError from "../../commons/error/ForbiddenError";

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: this._getLoginState(),
      isActive: false,
      firstName: "",
      lastName: "",
      email: "",
      altEmail: "",
      contactNumber: "",
      address: "",
      state: "",
      city: "",
      pin: "",
      gender: "male",
      language: "english",
      disablePassword: true,
      hidden: true,
      nameChanges: false,
      sidebarData: {
        "General Settings": {
          "Your Account": ["fa fa-user-o", "account"],
          "Contact Info": ["fa fa-address-card-o", "contact"]
        },
        "Personal Details": { "Gender & Language": ["fa fa-lock", "gender"] },
        "Security & Login": { Password: ["fa fa-lock", "security"] }
      }
    };

    if (!this.state.isLoggedIn.userLoggedIn) {
      this.props.history.push("/login");
    }

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  _getLoginState() {
    return {
      userLoggedIn: LoginHelper.isLoggedIn()
    };
  }

  componentWillMount() {
    this.setState({
      isActive: true
    });
    this.init();
  }

  componentDidMount() {
    $("#city_select").addClass("hidden");
    $("#pin").addClass("hidden");

    $.each(Pincodes, function(key, item) {
      const val = _.snakeCase(key);
      $("#state-dropdown-item").append(
        $(
          '<option class="dropdown-item" value=' + val + ">" + key + "</option>"
        )
      );
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;

    if (name === "firstName" || name === "lastName") {
      this.setState({ nameChanges: true });
    } else {
      this.setState({ nameChanges: false });
    }

    this.setState({
      [name]: target.value
    });
  }

  handleDropdownChange(e) {
    const target = e.target;
    const name = target.name;

    $(this)
      .find("option:selected")
      .remove();

    this.setState({ [name]: e.target.value });

    if (name === "state") {
      $("#city-dropdown-item")
        .find("option:not(:first)")
        .remove();

      $(target)
        .find(`[value=${target.value}]`)
        .attr("selected", "selected");

      this.setState({
        pin: ""
      });

      if (this.selectedIndex < 1) {
        $("#city_select").addClass("hidden");
        return;
      } else {
        $("#city_select").removeClass("hidden");
      }

      $.each(Pincodes[_.toUpper(_.startCase(e.target.value))], function(
        key,
        item
      ) {
        const val = _.snakeCase(item.distt);
        $("#city-dropdown-item").append(
          $(
            '<option class="dropdown-item" value=' +
              val +
              ">" +
              item.distt +
              "</option>"
          )
        );
      });
    } else if (name === "city") {
      if (this.selectedIndex < 1) {
        $("#pin").addClass("hidden");
        return;
      } else {
        $("#pin").removeClass("hidden");
      }
    }
  }

  setGender(event) {
    this.setState({ gender: event.target.value });
  }

  setLanguage(event) {
    this.setState({ language: event.target.value });
  }

  handleSubmit() {
    this.setState({
      isActive: true
    });

    const userSettings = {
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      altEmail: this.state.altEmail,
      contactNumber: this.state.contactNumber,
      address: this.state.address,
      state: this.state.state,
      city: this.state.city,
      pin: this.state.pin,
      gender: this.state.gender,
      language: this.state.language
    };

    Settings.updateSetting(
      userSettings,
      this.state.nameChanges,
      localStorage.getItem("userId")
    )
      .then(result => {
        NotificationManager.success("Profile Updated Successfully", "Success");
        window.location.reload(false);
        return result;
      })
      .catch(function(err) {
        NotificationManager.error("Error in updating data.", "Error", 2000);
        this.setState({
          isActive: false
        });
      });
  }

  handleClick(event) {
    const target = event.target;
    const title = target.title;

    if (title === "cancel") {
      this.setState({
        disablePassword: true,
        hidden: true,
        password: "",
        confirmPassword: ""
      });
    } else {
      this.setState({
        disablePassword: false,
        hidden: false
      });

      if (title === "save") {
        const password = this.state.password;
        const userId = localStorage.getItem("userId");
        if (password === this.state.confirmPassword) {
          tmsService
            .updatePasswordWithoutLink(userId, { password })
            .then(result => {
              debugger;
              if (result.message === "password updated") {
                this.setState({
                  disablePassword: true,
                  hidden: true,
                  password: "",
                  confirmPassword: ""
                });
                NotificationManager.success(
                  "Your password has been successfully reset, please try logging in again.",
                  "Success"
                );
              } else {
                this.setState({
                  disablePassword: false,
                  hidden: false
                });
              }
              return result;
            })
            .catch(function(err) {
              const error = JSON.parse(err.response);
              NotificationManager.error(error.message, "Error", 2000);
            });
        } else {
          NotificationManager.error(
            "Password and Confirm Password fields should match.",
            "Error",
            2000
          );
        }
      }
    }
  }

  init() {
    const self = this;

    Settings.getCurrentUserSeetings(localStorage.getItem("userId"))
      .then(result => {
        if (result.length > 0) {
          self.setState({
            isActive: false,
            firstName: result[1].firstName,
            lastName: result[1].lastName,
            email: localStorage.getItem("user"),
            altEmail: result[0].altEmail,
            contactNumber: result[0].contactNumber,
            address: result[0].address,
            state: result[0].state,
            city: result[0].city,
            pin: result[0].pin,
            gender: result[0].gender,
            language: result[0].language
          });

          const stateSelected = $("#state-dropdown-item")
            .find(`option[value=${result[0].state}]`)
            .attr("selected", true)
            .val();

          if (stateSelected) {
            $("#city_select").removeClass("hidden");
            $.each(Pincodes[_.toUpper(_.startCase(stateSelected))], function(
              key,
              item
            ) {
              const val = _.snakeCase(item.distt);
              $("#city-dropdown-item").append(
                $(
                  '<option class="dropdown-item" value=' +
                    val +
                    ">" +
                    item.distt +
                    "</option>"
                )
              );
            });
            $("#city-dropdown-item")
              .find(`option[value=${result[0].city}]`)
              .attr("selected", true);
            $("#pin").removeClass("hidden");
          }
        }
        return result;
      })
      .catch(function(err) {
        const error = JSON.parse(err.response);
        NotificationManager.error(error.message, "Error", 2000);
      });

    self.setState({
      isActive: false,
      email: localStorage.getItem("user")
    });

    self.uploadImage();
  }

  uploadImage() {
    let readURL = function(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function(e) {
          $(".profile-pic").attr("src", e.target.result);
        };

        reader.readAsDataURL(input.files[0]);
      }
    };

    $(".file-upload").on("change", function() {
      readURL(this);
    });

    $(".upload-button").on("click", function() {
      $(".file-upload").click();
    });
  }

  render() {
    return <div>{this.profileItems}</div>;
  }

  get profileItems() {
    if (this.state.isLoggedIn.userLoggedIn) {
      return (
        <div className="tms-content">
          <LoadingOverlay
            active={this.state.isActive}
            spinner={<Loader type="Watch" height={100} width={100} />}
          >
            <div className="limiter">
              <div className="container-profile100">
                <div className="wrap-profile100">
                  <form className="profile100-form validate-form">
                    {/* -------------------------------------- Your Account
                    -------------------------------------- */}
                    <fieldset className="profile100-fieldset">
                      <span
                        className="profile100-form-title p-b-43"
                        id="account"
                      >
                        Your Account
                      </span>
                      <section className="profile-left">
                        <div className="wrap-input100 profile-input100 profile-account-input">
                          <input
                            className="input100 profile-input"
                            type="text"
                            name="email"
                            value={this.state.email}
                            disabled="disabled"
                            placeholder="User ID"
                          />
                          <span className="focus-input100"></span>
                          <span className="label-input100 profile-input-label"></span>
                        </div>
                        <div
                          className="wrap-input100 profile-input100 profile-account-input validate-input"
                          data-validate="First Name is required"
                        >
                          <input
                            className="input100 profile-input"
                            type="text"
                            name="firstName"
                            value={this.state.firstName || ""}
                            onChange={this.handleInputChange}
                            placeholder="First Name"
                          />
                          <span className="focus-input100"></span>
                          <span className="label-input100 profile-input-label"></span>
                        </div>
                        <div
                          className="wrap-input100 profile-input100 profile-account-input validate-input profile-bottom-margin"
                          data-validate="Last Name is required"
                        >
                          <input
                            className="input100 profile-input"
                            type="text"
                            name="lastName"
                            value={this.state.lastName || ""}
                            onChange={this.handleInputChange}
                            placeholder="Last Name"
                          />
                          <span className="focus-input100"></span>
                          <span className="label-input100 profile-input-label"></span>
                        </div>
                      </section>
                      <section className="profile-right">
                        <div className="avatar-wrapper">
                          <img alt="avatar" className="profile-pic" src="" />
                          <div
                            className="upload-button"
                            onClick={this.uploadImage.bind(this)}
                          >
                            <i
                              className="fa fa-arrow-circle-up"
                              aria-hidden="true"
                            ></i>
                          </div>
                          <input
                            className="file-upload"
                            type="file"
                            accept="image/*"
                          />
                        </div>
                      </section>
                    </fieldset>
                    {/* -------------------------------------- Contact Info
                    -------------------------------------- */}
                    <fieldset className="profile100-fieldset">
                      <span
                        className="profile100-form-title p-b-43"
                        id="contact"
                      >
                        Contact Info
                      </span>
                      <div
                        className="wrap-input100 profile-input100 validate-input"
                        data-validate="Valid email is required: ex@abc.xyz"
                      >
                        <input
                          className="input100 profile-input"
                          type="text"
                          name="altEmail"
                          value={this.state.altEmail || ""}
                          onChange={this.handleInputChange}
                          placeholder="Email"
                        />
                        <span className="focus-input100"></span>
                        <span className="label-input100 profile-input-label"></span>
                      </div>
                      <div className="wrap-input100 profile-input100">
                        <input
                          className="input100 profile-input"
                          type="tel"
                          pattern="[0-9]{2}-[0-9]{7}"
                          name="contactNumber"
                          value={this.state.contactNumber || ""}
                          onChange={this.handleInputChange}
                          placeholder="Contact Number"
                        />
                        <span className="focus-input100"></span>
                        <span className="label-input100 profile-input-label"></span>
                      </div>
                      <div className="wrap-input100 profile-input100">
                        <input
                          className="input100 profile-input"
                          type="text"
                          name="address"
                          value={this.state.address || ""}
                          onChange={this.handleInputChange}
                          placeholder="Address"
                        />
                        <span className="focus-input100"></span>
                        <span className="label-input100 profile-input-label"></span>
                      </div>
                      <div className="wrap-input100 profile-input100">
                        <select
                          className="custom-select city_select"
                          name="state"
                          id="state-dropdown-item"
                          defaultValue={"DEFAULT"}
                          onChange={this.handleDropdownChange}
                        >
                          <option value="DEFAULT" className="disabled" disabled>
                            Select a State
                          </option>
                        </select>
                      </div>
                      <div
                        className="wrap-input100 profile-input100"
                        id="city_select"
                      >
                        <select
                          className="custom-select city_select"
                          name="city"
                          defaultValue={"DEFAULT"}
                          id="city-dropdown-item"
                          onChange={this.handleDropdownChange}
                        >
                          <option value="DEFAULT" className="disabled" disabled>
                            Select a City
                          </option>
                        </select>
                      </div>
                      <div
                        className="wrap-input100 profile-input100 profile-bottom-margin"
                        id="pin"
                      >
                        <input
                          className="input100 profile-input"
                          type="text"
                          name="pin"
                          pattern="^[1-9][0-9]{5}$"
                          value={this.state.pin || ""}
                          onChange={this.handleInputChange}
                          placeholder="Pin"
                        />
                        <span className="focus-input100"></span>
                        <span className="label-input100 profile-input-label"></span>
                      </div>
                    </fieldset>
                    {/* -------------------------------------- Personal Details
                    -------------------------------------- */}
                    <fieldset className="profile100-fieldset">
                      <span
                        className="profile100-form-title p-b-43"
                        id="security"
                      >
                        Personal Details
                      </span>
                      <div
                        className="profile-radio-btn-grp tms-inline-display-block"
                        onChange={event => this.setGender(event)}
                      >
                        <div className="custom-radio" title="Male">
                          <input
                            type="radio"
                            name="gender"
                            value="male"
                            checked={this.state.gender === "male"}
                            defaultChecked
                          />
                          <label className="profile-radio">Male</label>
                        </div>
                        <div className="custom-radio" title="Female">
                          <input
                            type="radio"
                            name="gender"
                            value="female"
                            checked={this.state.gender === "female"}
                          />
                          <label className="profile-radio">Female</label>
                        </div>
                        <div className="custom-radio" title="Other">
                          <input
                            type="radio"
                            name="gender"
                            value="other"
                            checked={this.state.gender === "other"}
                          />
                          <label className="profile-radio">Other</label>
                        </div>
                      </div>
                      <div
                        className="profile-radio-btn-grp tms-inline-display-block profile-bottom-margin"
                        onChange={event => this.setLanguage(event)}
                      >
                        <div className="custom-radio" title="English">
                          <input
                            type="radio"
                            name="language"
                            value="english"
                            checked={this.state.language === "english"}
                            defaultChecked
                          />
                          <label className="profile-radio">English</label>
                        </div>
                        <div className="custom-radio" title=" Non English">
                          <input
                            type="radio"
                            name="language"
                            value="non_english"
                            checked={this.state.language === "non_english"}
                          />
                          <label className="profile-radio">Non English</label>
                        </div>
                      </div>
                    </fieldset>
                    {/* -------------------------------------- Security & login
                    -------------------------------------- */}
                    <fieldset className="profile100-fieldset">
                      <div className="profile-right top-margin edit">
                        <span
                          className="action-save"
                          title="edit"
                          hidden={!this.state.hidden}
                          onClick={this.handleClick.bind(this)}
                        >
                          <i
                            className="fa fa-pencil"
                            title="edit"
                            aria-hidden="true"
                          ></i>
                        </span>
                        <span
                          className="action-save"
                          title="save"
                          hidden={this.state.hidden}
                          onClick={this.handleClick.bind(this)}
                        >
                          Save
                        </span>
                        &nbsp;&nbsp;&nbsp;
                        <span
                          className="action-cancel"
                          title="cancel"
                          hidden={this.state.hidden}
                          onClick={this.handleClick.bind(this)}
                        >
                          Cancel
                        </span>
                      </div>
                      <span
                        className="profile100-form-title p-b-43"
                        id="security"
                      >
                        Security & Login
                      </span>
                      <div
                        className="wrap-input100 profile-input100 validate-input"
                        data-validate="Password is required"
                      >
                        <input
                          className="input100 profile-input"
                          type="password"
                          name="password"
                          value={this.state.password || ""}
                          onChange={this.handleInputChange}
                          placeholder="Password"
                          disabled={this.state.disablePassword}
                        />
                        <span className="focus-input100"></span>
                        <span className="label-input100 profile-input-label"></span>
                      </div>
                      <div
                        className="wrap-input100 profile-input100 validate-input profile-bottom-margin"
                        data-validate="Password is required"
                      >
                        <input
                          className="input100 profile-input"
                          type="password"
                          name="confirmPassword"
                          value={this.state.confirmPassword || ""}
                          onChange={this.handleInputChange}
                          placeholder="Confirm Password"
                          disabled={this.state.disablePassword}
                        />
                        <span className="focus-input100"></span>
                        <span className="label-input100 profile-input-label"></span>
                      </div>
                    </fieldset>
                  </form>
                  <Sidebar sidebarData={this.state.sidebarData} />
                </div>
              </div>
              <div className="action profile-action">
                <button
                  type="button"
                  id="save"
                  className="btn btn-primary tms-float-rt"
                  onClick={this.handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
            <Footer />
          </LoadingOverlay>
        </div>
      );
    } else {
      return <ForbiddenError />;
    }
  }
}

export default Profile;
