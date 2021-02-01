import React, { Component } from "react";
import $ from "jquery";

import ProjectService from "../../services/ProjectService";
import LoginHelper from "../../helpers/LoginHelper";
import Footer from "../../commons/footer/Footer";
import LoadingOverlay from "react-loading-overlay";
import Loader from "react-loader-spinner";
import Sidebar from "../../commons/sidebar/Sidebar";
import ForbiddenError from "../../commons/error/ForbiddenError";

const CommonSideBar = require("../../commons/commonSider.json");

class ClientList extends Component {
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
      this.setState({
        clients: result
      });
      this.setState({
        isLoaderActive: false
      });
      $.each(
        result,
        function(key, item) {
          $("#client-grid").append(
            '<tr class="table-row"><td>' +
              item.clientName +
              "</td><td>" +
              item.clientId +
              '</td><td><a href="/clientedit/' +
              item.id +
              '"><i class="fa fa-pencil" aria-hidden="true"></i></a>' +
              '<button class="deleteicon" onClick={this.clientdelete(this)} >' +
              '<i class="fa fa-trash" aria-hidden="true"></i></button></td></tr>'
          );
        },
        this
      );
    });
  }

  render() {
    return <div>{this.clientlist}</div>;
  }
  get clientlist() {
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
                              <th>Code</th>
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
export default ClientList;
