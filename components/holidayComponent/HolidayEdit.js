import React, { Component } from "react";
import $ from "jquery";
import { NotificationManager } from "react-notifications";
import ModernDatepicker from "react-modern-datepicker";
import ProjectService from "../../services/ProjectService";
import LoginHelper from "../../helpers/LoginHelper";
import Footer from "../../commons/footer/Footer";
import LoadingOverlay from "react-loading-overlay";
import Loader from "react-loader-spinner";
import Sidebar from "../../commons/sidebar/Sidebar";
import ForbiddenError from "../../commons/error/ForbiddenError";

const CommonSideBar = require("../../commons/commonSider.json");

class HolidayEdit extends Component {
  constructor(props) {
    super(props);
    this.role = localStorage.getItem("role");
    this.state = {
      holiday: "",
      date: "",
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
    ProjectService.getByHolidayid(this.props.match.params.id).then(result => {
      this.setState({ holiday: result });
      this.setState({
        isLoaderActive: false
      });
      this.setState({
        holiday: this.state.holiday.holiday,

        startDate: new Date(this.state.holiday.date),
        isActive: this.state.holiday.isActive
      });
    });
  }
  holidayupdate(e) {
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
        holiday: this.state.holiday,
        date: this.state.startDate,
        isActive: this.state.isActive
      };
      ProjectService.updateholiday(this.props.match.params.id, data)
        .then(result => {
          NotificationManager.success("Holiday Updated Successfully", "Succes");
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
    return <div>{this.holidayeditform}</div>;
  }

  get holidayeditform() {
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
                          Holiday:
                        </label>
                        <div
                          class="col-sm-10"
                          data-validate="Project Code is required"
                        >
                          <textarea
                            className="textarea validate-input"
                            name="description"
                            onChange={this.handleInputChange}
                            value={this.state.holiday}
                          >
                            {this.state.holiday}
                          </textarea>
                        </div>
                      </div>
                      <div class="form-group">
                        <label class="control-label col-sm-2" for="lname">
                          Date:
                        </label>
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

                      <div class="form-group">
                        <div class="col-sm-offset-2 col-sm-10">
                          <button
                            type="submit"
                            class="btn btn-default"
                            onClick={this.holidayupdate.bind(this)}
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
export default HolidayEdit;
