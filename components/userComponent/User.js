import React, { Component } from "react";
import $ from "jquery";
import { NotificationManager } from "react-notifications";
import LoadingOverlay from "react-loading-overlay";
import Loader from "react-loader-spinner";
import Footer from "../../commons/footer/Footer";
import Auth from "../../services/AuthService";
import ProjectService from "../../services/ProjectService";
import LoginHelper from "../../helpers/LoginHelper";
import Sidebar from "../../commons/sidebar/Sidebar";
import ForbiddenError from "../../commons/error/ForbiddenError";

const CommonSideBar = require("../../commons/commonSider.json");

class User extends Component {
  constructor(props) {
    super(props);
    this.role = localStorage.getItem("role");
    this.state = {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      clientId: "",
      projectId: "",
      isLoggedIn: this._getLoginState(),
      isActive: true,
      isLoaderActive: false
    };

    if (!this.state.isLoggedIn.userLoggedIn) {
      this.props.history.push("/login");
    } else if (this.role !== "Project Manager" && this.role !== "Super Admin") {
      this.props.history.push("/home");
    }
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleDropdownChange = this.handleDropdownChange.bind(this);
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
    this.setState({
      isLoaderActive: true
    });
    this.init();
  }

  init() {
    var self = this;

    self.setState({
      isActive: true
    });
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
  handleDropdownChange(e) {
    const target = e.target;
    const name = target.name;

    this.setState({ [name]: e.target.value });
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

  createuser(e) {
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
      var data = {
        email: this.state.email,
        password: this.state.password,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        isActive: this.state.isActive,
        clientId: this.state.clientId,
        projectId: this.state.projectId,
        role: this.state.roleId
      };
      Auth.signup(data)
        .then(result => {
          NotificationManager.success("User created Successfully", "Succes");

          this.props.history.push("/userlist");
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
  componentDidMount() {
    ProjectService.getAllClients().then(result => {
      this.setState({ clients: result });

      $.each(result, function(key, item) {
        $("#dropdown-itemclient").append(
          $(
            '<option class="dropdown-item" value=' +
              item._id +
              ">" +
              item.clientName +
              "</option>"
          )
        );
      });
    });
    ProjectService.getAllRoles().then(result => {
      this.setState({ roles: result });
      this.setState({
        isLoaderActive: false
      });
      $.each(result, function(key, item) {
        if (item.roleName !== "Super Admin") {
          $("#dropdown-itemroles").append(
            $(
              '<option class="dropdown-item" value=' +
                item._id +
                ">" +
                item.roleName +
                "</option>"
            )
          );
        }
      });
    });
    $(".selectclient").change(function(e) {
      ProjectService.getProjectsByClientID(e.target.value).then(results => {
        console.log(results);
        $.each(results, function(key, item) {
          $("#dropdown-itemproject").append(
            $(
              '<option class="dropdown-item" value=' +
                item._id +
                ">" +
                item.projectName +
                "</option>"
            )
          );
        });
      });
    });
  }
  // here is our UI
  // it is easy to understand their functions when you
  // see them render into our screen
  render() {
    return <div>{this.userform}</div>;
  }
  get userform() {
    if (this.state.isLoggedIn.userLoggedIn) {
      return (
        <div className="tms-content">
          <LoadingOverlay
            active={this.state.isLoaderActive}
            spinner={<Loader type="Watch" height={100} width={100} />}
          >
            <div className="limiter">
              <div className="container-profile100">
                <div className="row minheight wrap-profile100">
                  <div className="profile100-form">
                    <div className="">
                      <div className="form-group">
                        <div className="wrap-input100 profile-input100 profile-account-input">
                          <input
                            className="input100 profile-input"
                            type="text"
                            name="email"
                            value={this.state.email}
                            placeholder="Email Id"
                            onChange={this.handleInputChange}
                          />
                          <span className="focus-input100"></span>
                          <span className="label-input100 profile-input-label"></span>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="wrap-input100 profile-input100 profile-account-input">
                          <input
                            className="input100 profile-input"
                            type="password"
                            name="password"
                            value={this.state.password}
                            placeholder="Password"
                            onChange={this.handleInputChange}
                          />
                          <span className="focus-input100"></span>
                          <span className="label-input100 profile-input-label"></span>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="wrap-input100 profile-input100 profile-account-input">
                          <input
                            className="input100 profile-input"
                            type="text"
                            name="firstName"
                            value={this.state.firstName}
                            placeholder="First Name"
                            onChange={this.handleInputChange}
                          />
                          <span className="focus-input100"></span>
                          <span className="label-input100 profile-input-label"></span>
                        </div>
                      </div>
                      <div className="form-group">
                        <div className="wrap-input100 profile-input100 profile-account-input">
                          <input
                            className="input100 profile-input"
                            type="text"
                            name="lastName"
                            value={this.state.lastName}
                            placeholder="Last Name"
                            onChange={this.handleInputChange}
                          />
                          <span className="focus-input100"></span>
                          <span className="label-input100 profile-input-label"></span>
                        </div>
                      </div>
                      <div className="form-group">
                        <div
                          className="wrap-input100 profile-input100 profile-account-input"
                          id="city_select"
                        >
                          <select
                            className="custom-select city_select"
                            name="roleId"
                            defaultValue={"DEFAULT"}
                            id="dropdown-itemroles"
                            onChange={this.handleDropdownChange}
                          >
                            <option
                              value="DEFAULT"
                              className="disabled"
                              disabled
                            >
                              Select a Role
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <div
                          className="wrap-input100 profile-input100 profile-account-input"
                          id="city_select"
                        >
                          <select
                            className="custom-select city_select selectclient"
                            name="clientId"
                            defaultValue={"DEFAULT"}
                            id="dropdown-itemclient"
                            onChange={this.handleDropdownChange}
                          >
                            <option
                              value="DEFAULT"
                              className="disabled"
                              disabled
                            >
                              Select a Client Name
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="form-group">
                        <div
                          className="wrap-input100 profile-input100 profile-account-input"
                          id="city_select"
                        >
                          <select
                            className="custom-select city_select"
                            name="projectId"
                            defaultValue={"DEFAULT"}
                            id="dropdown-itemproject"
                            onChange={this.handleDropdownChange}
                          >
                            <option
                              value="DEFAULT"
                              className="disabled"
                              disabled
                            >
                              Select a Project
                            </option>
                          </select>
                        </div>
                      </div>
                      <div className="action">
                        <button
                          type="submit"
                          className="btn btn-primary tms-float-rt"
                          onClick={this.createuser.bind(this)}
                        >
                          Submit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <Sidebar sidebarData={CommonSideBar} />
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

export default User;
