import React, { Component } from "react";
import $ from "jquery";
import AuthService from "../../services/AuthService";
import LoginHelper from "../../helpers/LoginHelper";
import Footer from "../../commons/footer/Footer";
import LoadingOverlay from "react-loading-overlay";
import Loader from "react-loader-spinner";
import Sidebar from "../../commons/sidebar/Sidebar";
import ForbiddenError from "../../commons/error/ForbiddenError";

const CommonSideBar = require("../../commons/commonSider.json");
class UserList extends Component {
  constructor(props) {
    super(props);
    this.role = localStorage.getItem("role");
    this.state = {
      isLoggedIn: this._getLoginState(),
      isLoaderActive: false
    };

    if (!this.state.isLoggedIn.userLoggedIn) {
      this.props.history.push("/login");
    } else if (this.role !== "Project Manager" && this.role !== "Super Admin") {
      this.props.history.push("/home");
    }
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
    this.initGrid();
  }

  initGrid() {
    AuthService.getAllEmployees().then(result => {
      this.setState({ users: result });
      this.setState({
        isLoaderActive: false
      });
      $.each(
        result,
        function(key, item) {
          if (item.role.roleName !== "Super Admin") {
            $("#client-grid").append(
              '<tr class="table-row"><td>' +
                item.fullName +
                "</td><td>" +
                item.username +
                "</td><td>" +
                item.role.roleName +
                '</td><td><a href="/useredit/' +
                item.id +
                '"><i class="fa fa-pencil" aria-hidden="true"></i></a> <button class="deleteicon" value="' +
                item.id +
                '"><i class="fa fa-trash" aria-hidden="true"></i></button></td></tr>'
            );
          }
        },
        this
      );

      $(".deleteuser").on("click", function(event) {});
    });
  }
  deleteus() {
    alert("hi");
  }

  render() {
    return <div>{this.projectlist}</div>;
  }
  get projectlist() {
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
                  <div className="client-list profile100-form">
                    <div className="contact-form">
                      <section>
                        <table
                          className="table"
                          cellPadding="0"
                          cellSpacing="0"
                          border="0"
                          id="tms-users"
                        >
                          <thead className="client-header">
                            <tr>
                              <th>Name</th>
                              <th>Email</th>
                              <th>Role</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody
                            id="client-grid"
                            className="tbl-content"
                          ></tbody>
                          <tfoot className="tms-tfoot tbl-footer"></tfoot>
                        </table>
                        <div id="clientsdata"></div>
                      </section>
                    </div>
                  </div>
                </div>
                <Sidebar sidebarData={CommonSideBar} />
              </div>
              <Footer />
            </div>
          </LoadingOverlay>
        </div>
      );
    } else {
      return <ForbiddenError />;
    }
  }
}
export default UserList;
