import React, { Component } from "react";
import $ from "jquery";
import { NotificationManager } from "react-notifications";
import ModernDatepicker from "react-modern-datepicker";
import LoadingOverlay from "react-loading-overlay";
import Loader from "react-loader-spinner";
import ProjectService from "../../services/ProjectService";
import LoginHelper from "../../helpers/LoginHelper";
import Footer from "../../commons/footer/Footer";
import Sidebar from "../../commons/sidebar/Sidebar";
import ForbiddenError from "../../commons/error/ForbiddenError";

const CommonSideBar = require("../../commons/commonSider.json");

class Holiday extends Component {
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

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(date) {
    this.setState({
      startDate: date
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
    this.setState({
      isLoaderActive: false
    });
  }
  holidaycreate(e) {
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
        holiday: this.state.description,
        date: this.state.startDate,
        isActive: true
      };
      ProjectService.holidaypostData(data)
        .then(result => {
          NotificationManager.success("Holiday created Successfully", "Succes");
          this.props.history.push("/holidaylist");
        })
        .catch(function(err) {
          NotificationManager.error(
            "Holiday already exists. Please try other.",
            "Error",
            2000
          );
        });
    } else {
      NotificationManager.error("Please check all fields.", "Error", 2000);
    }
  }
  render() {
    return <div>{this.holidayform}</div>;
  }

  get holidayform() {
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
                        <label className="control-label col-sm-2">
                          Holiday:
                        </label>
                        <div
                          className="col-sm-10"
                          data-validate="Project Code is required"
                        >
                          <textarea
                            className="textarea validate-input"
                            name="description"
                            onChange={this.handleInputChange}
                          ></textarea>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="control-label col-sm-2">Date:</label>
                        <ModernDatepicker
                          date={this.state.startDate}
                          format={`DD/MM/YYYY`}
                          showBorder
                          className="datepicker tms-inline-display"
                          id="datepicker"
                          onChange={date => this.handleChange(date)}
                          placeholder={"Select a date"}
                        />
                      </div>

                      <div className="action">
                        <button
                          type="submit"
                          className="btn btn-primary tms-float-rt"
                          onClick={this.holidaycreate.bind(this)}
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
export default Holiday;
