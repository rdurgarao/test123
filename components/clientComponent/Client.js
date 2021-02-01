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

class Client extends Component {
  constructor(props) {
    super(props);
    this.role = localStorage.getItem("role");
    this.state = {
      clientId: "",
      clientName: "",
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
  }
  handleInputChange(event) {
    const target = event.target;
    const name = target.name;

    this.setState({
      [name]: target.value
    });
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
      isActive: false
    });
  }
  componentDidMount() {
    this.setState({
      isLoaderActive: false
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
  clientcreate(e) {
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
        isActive: true
      };
      ProjectService.clientpostData(data)
        .then(result => {
          NotificationManager.success("Client created Successfully", "Succes");

          this.props.history.push("/clientlist");
        })
        .catch(function(err) {
          NotificationManager.error(
            "Client already exists. Please try other.",
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
              <div className="container-profile100">
                <div className="row minheight wrap-profile100">
                  <div className="profile100-form">
                    <div className="">
                      <div className="form-group">
                        <div className="wrap-input100 profile-input100 profile-account-input">
                          <input
                            className="input100 profile-input"
                            type="text"
                            name="clientId"
                            value={this.state.clientId}
                            placeholder="Cleint ID"
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
                            name="clientName"
                            value={this.state.clientName}
                            placeholder="Client Name"
                            onChange={this.handleInputChange}
                          />
                          <span className="focus-input100"></span>
                          <span className="label-input100 profile-input-label"></span>
                        </div>
                      </div>
                      <div className="action">
                        <button
                          type="submit"
                          className="btn btn-primary tms-float-rt"
                          onClick={this.clientcreate.bind(this)}
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
export default Client;
