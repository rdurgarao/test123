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

class ClientEdit extends Component {
  constructor(props) {
    super(props);
    this.role = localStorage.getItem("role");
    this.state = {
      clientId: "",
      clientName: "",
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

    this.setState({
      [name]: e.target.value
    });
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
    ProjectService.getByClientid(this.props.match.params.id).then(result => {
      this.setState({ client: result });
      this.setState({
        isLoaderActive: false
      });
      this.setState({
        clientId: this.state.client.clientId,

        clientName: this.state.client.clientName,
        isActive: this.state.client.isActive
      });
    });
  }
  updateclient(e) {
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
        clientId: this.state.clientId,
        clientName: this.state.clientName,
        isActive: this.state.isActive
      };
      ProjectService.updateclient(this.props.match.params.id, data)
        .then(result => {
          NotificationManager.success("Client updated Successfully", "Succes");

          this.props.history.push("/clientlist");
        })
        .catch(function(err) {
          NotificationManager.error(
            "Client not exists. Please try other.",
            "Error",
            2000
          );
        });
    } else {
      NotificationManager.error("Please check all fields.", "Error", 2000);
    }
  }
  render() {
    return <div>{this.clientform}</div>;
  }

  get clientform() {
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
                        <label class="control-label col-sm-2" for="cleintId">
                          Cleint Id:
                        </label>
                        <div
                          class="col-sm-10"
                          data-validate="Client Id is required"
                        >
                          <input
                            className="form-control form-control-lg"
                            type="text"
                            name="clientId"
                            placeholder="Client Id"
                            value={this.state.clientId}
                            onChange={this.handleInputChange}
                          />
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="control-label col-sm-2" for="clientName">
                          Client Name:
                        </label>
                        <div
                          class="col-sm-10"
                          data-validate="Client Name is required"
                        >
                          <input
                            className="form-control form-control-lg"
                            type="text"
                            placeholder="Client Name"
                            name="clientName"
                            value={this.state.clientName}
                            onChange={this.handleInputChange}
                          />
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
                            onClick={this.updateclient.bind(this)}
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
export default ClientEdit;
