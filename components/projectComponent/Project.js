import React, { Component } from "react";
import $ from "jquery";
import { NotificationManager } from "react-notifications";
import LoadingOverlay from "react-loading-overlay";
import Loader from "react-loader-spinner";
import ProjectService from "../../services/ProjectService";
import LoginHelper from "../../helpers/LoginHelper";
import Footer from "../../commons/footer/Footer";
import Sidebar from "../../commons/sidebar/Sidebar";
import ForbiddenError from "../../commons/error/ForbiddenError";

const CommonSideBar = require("../../commons/commonSider.json");

class Project extends Component {
  constructor(props) {
    super(props);
    this.role = localStorage.getItem("role");
    this.state = {
      projectCode: "",
      projectName: "",
      clientId: "",
      isLoggedIn: this._getLoginState(),
      isActive: false,
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
  validate(input) {
    if (
      $(input)
        .val()
        .trim() === ""
    ) {
      return false;
    }
  }

  showValidate(input) {
    let thisAlert = $(input).parent();

    $(thisAlert).addClass("alert-validate");
  }

  componentDidMount() {
    ProjectService.getAllClients().then(result => {
      this.setState({ clients: result });
      this.setState({
        isLoaderActive: false
      });
      $.each(result, function(key, item) {
        $("#dropdown-item").append(
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
  }
  projectcreate(e) {
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
        projectCode: this.state.projectCode,
        projectName: this.state.projectName,
        clientId: this.state.clientId,
        isActive: true
      };
      ProjectService.projectpostData(data)
        .then(result => {
          NotificationManager.success("Project created Successfully", "Succes");
          this.props.history.push("/projectlist");
        })
        .catch(function(err) {
          NotificationManager.error(
            "Project already exists. Please try other.",
            "Error",
            2000
          );
        });
    } else {
      NotificationManager.error("Please check all fields.", "Error", 2000);
    }
  }
  render() {
    return <div>{this.projectform}</div>;
  }

  get projectform() {
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
                            name="projectCode"
                            value={this.state.projectCode}
                            placeholder="Project Code"
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
                            name="projectName"
                            value={this.state.projectName}
                            placeholder="Project Name"
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
                            name="clientId"
                            defaultValue={"DEFAULT"}
                            id="dropdown-item"
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
                      <div className="action">
                        <button
                          type="submit"
                          className="btn btn-primary tms-float-rt"
                          onClick={this.projectcreate.bind(this)}
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
export default Project;
