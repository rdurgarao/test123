import React, { Component } from "react";
import $ from "jquery";
import { NotificationManager } from "react-notifications";
import ProjectService from "../../services/ProjectService";
import LoginHelper from "../../helpers/LoginHelper";
import LoadingOverlay from "react-loading-overlay";
import Loader from "react-loader-spinner";
import Footer from "../../commons/footer/Footer";
import Sidebar from "../../commons/sidebar/Sidebar";
import ForbiddenError from "../../commons/error/ForbiddenError";

const CommonSideBar = require("../../commons/commonSider.json");

class UserEdit extends Component {
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
      isActive: "",
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
      isLoaderActive: true
    });
    this.init();
  }

  init() {}
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

  updateuser(e) {
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
        username: this.state.email,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
        isActive: this.state.isActive,
        role: this.state.roleId
      };
      ProjectService.updateuser(this.props.match.params.id, data)
        .then(result => {
          NotificationManager.success("User Updated Successfully", "Succes");

          this.props.history.push("/userlist");
        })
        .catch(function(err) {
          NotificationManager.error(
            "User not Updated. Please try other.",
            "Error",
            2000
          );
        });
    } else {
      NotificationManager.error("Please check all fields.", "Error", 2000);
    }
  }
  componentDidMount() {
    ProjectService.getByUserid(this.props.match.params.id).then(result => {
      this.setState({ user: result });
      this.setState({
        isLoaderActive: false
      });
      this.setState({
        email: this.state.user.username,

        firstName: this.state.user.firstName,
        lastName: this.state.user.lastName,
        roleId: this.state.user.role,
        isActive: this.state.user.isActive
      });
    });

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
              <div class="container-profile100">
                <div class="row minheight wrap-profile100">
                  <div class="profile100-form">
                    <div class="contact-form">
                      <div class="form-group">
                        <label class="control-label col-sm-2" for="fname">
                          Email Id:
                        </label>
                        <div
                          class="col-sm-10"
                          data-validate="Email Id is required"
                        >
                          <input
                            className="form-control form-control-lg"
                            type="text"
                            name="email"
                            value={this.state.email}
                            placeholder="Email Id"
                            onChange={this.handleInputChange}
                          />
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="control-label col-sm-2" for="fname">
                          First Nmae:
                        </label>
                        <div
                          class="col-sm-10"
                          data-validate="First Name is required"
                        >
                          <input
                            className="form-control form-control-lg"
                            type="text"
                            name="firstName"
                            value={this.state.firstName}
                            placeholder="First Name"
                            onChange={this.handleInputChange}
                          />
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="control-label col-sm-2" for="fname">
                          Last Name:
                        </label>
                        <div
                          class="col-sm-10"
                          data-validate="Last Name is required"
                        >
                          <input
                            className="form-control form-control-lg"
                            type="text"
                            name="lastName"
                            value={this.state.lastName}
                            placeholder="Last Name"
                            onChange={this.handleInputChange}
                          />
                        </div>
                      </div>

                      <div class="form-group">
                        <label class="control-label col-sm-2" for="lname">
                          Role:
                        </label>
                        <div class="col-sm-10" data-validate="Role is required">
                          <select
                            class="custom-select"
                            name="roleId"
                            id="dropdown-itemroles"
                            value={this.state.roleId}
                            onChange={this.handleDropdownChange}
                          >
                            <option disabled>Select a Role</option>
                          </select>
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="control-label col-sm-2" for="lname">
                          Active:
                        </label>
                        <div
                          class="col-sm-10"
                          data-validate="Active is required"
                        >
                          <select
                            class="custom-select active"
                            name="isActive"
                            id="dropdown-itemroles"
                            value={this.state.isActive}
                            onChange={this.handleDropdownChange}
                          >
                            <option value="true">Active</option>
                            <option value="false">In Active</option>
                          </select>
                        </div>
                      </div>
                      <div class="form-group">
                        <div class="col-sm-offset-2 col-sm-10">
                          <button
                            type="submit"
                            class="btn btn-default"
                            onClick={this.updateuser.bind(this)}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Sidebar sidebarData={CommonSideBar} />
              </div>
            </div>
          </LoadingOverlay>
          <Footer />
        </div>
      );
    } else {
      return <ForbiddenError />;
    }
  }
}

export default UserEdit;
