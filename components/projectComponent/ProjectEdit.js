import React, { Component } from "react";
import $ from "jquery";
import { NotificationManager } from "react-notifications";
import ProjectService from "../../services/ProjectService";
import LoginHelper from "../../helpers/LoginHelper";
import Footer from "../../commons/footer/Footer";
import LoadingOverlay from "react-loading-overlay";
import Loader from "react-loader-spinner";
import Sidebar from "../../commons/sidebar/Sidebar";
import ForbiddenError from "../../commons/error/ForbiddenError";

const CommonSideBar = require("../../commons/commonSider.json");

class ProjectEdit extends Component {
  constructor(props) {
    super(props);
    this.role = localStorage.getItem("role");
    this.state = {
      projectCode: "",
      projectName: "",
      clientId: "",
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
      isLoaderActive: true
    });
    this.init();
  }

  init() {
    var self = this;

    self.setState({
      isActive: false
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
    ProjectService.getByProjectid(this.props.match.params.id).then(result => {
      this.setState({ project: result });
      this.setState({
        isLoaderActive: false
      });
      this.setState({
        projectCode: this.state.project.projectCode,

        projectName: this.state.project.projectName,
        client: this.state.project.client.id,
        isActive: this.state.project.isActive
      });
    });
    ProjectService.getAllClients().then(result => {
      this.setState({ clients: result });

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
  updateproject(e) {
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
        isActive: this.state.isActive
      };
      ProjectService.updateproject(this.props.match.params.id, data)
        .then(result => {
          NotificationManager.success("Project Updated Successfully", "Succes");
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
              <div class="container-profile100 ">
                <div class="row minheight wrap-profile100">
                  <div class="profile100-form">
                    <div class="contact-form">
                      <div class="form-group">
                        <label class="control-label col-sm-2" for="fname">
                          Project Code:
                        </label>
                        <div
                          class="col-sm-10"
                          data-validate="Project Code is required"
                        >
                          <input
                            className="form-control form-control-lg"
                            type="text"
                            name="projectCode"
                            value={this.state.projectCode}
                            placeholder="Project Code"
                            onChange={this.handleInputChange}
                          />
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="control-label col-sm-2" for="lname">
                          Project Name:
                        </label>
                        <div
                          class="col-sm-10"
                          data-validate="Project Name is required"
                        >
                          <input
                            className="form-control form-control-lg"
                            type="text"
                            placeholder="Project Name"
                            name="projectName"
                            value={this.state.projectName}
                            onChange={this.handleInputChange}
                          />
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="control-label col-sm-2" for="lname">
                          Client Name:
                        </label>
                        <div
                          class="col-sm-10"
                          data-validate="Client Name is required"
                        >
                          <select
                            class="custom-select"
                            name="clientId"
                            id="dropdown-item"
                            value={this.state.client}
                            onChange={this.handleDropdownChange}
                          >
                            <option selected disabled>
                              Select a Client
                            </option>
                          </select>
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="control-label col-sm-2" for="active">
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
                            onClick={this.updateproject.bind(this)}
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
export default ProjectEdit;
