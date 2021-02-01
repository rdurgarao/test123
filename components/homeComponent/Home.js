import React, { Component } from "react";
import Footer from "../../commons/footer/Footer";
import LoadingOverlay from "react-loading-overlay";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";

class Home extends Component {
  constructor(props) {
    super(props);
    this.role = localStorage.getItem("role");
    this.state = {
      isActive: false
    };
  }

  render() {
    return (
      <div className="tms-content">
        <LoadingOverlay
          active={this.state.isActive}
          spinner={<Loader type="Watch" height={100} width={100} />}
        >
          {this.role === "Project Manager" && (
            <article>
              <main role="main" className="inner cover home-cover">
                <div className="grid2x2">
                  <div className="box column">
                    <Link className="nav-link active" to="/client">
                      <div className="card">
                        <h3>
                          <i className="fa fa-handshake-o"></i>
                        </h3>
                        <p></p>
                        Add Client
                      </div>
                    </Link>
                  </div>

                  <div className="box column">
                    <Link className="nav-link active" to="/project">
                      <div className="card">
                        <h3>
                          <i className="fa fa-newspaper-o"></i>
                        </h3>
                        <p></p>
                        Add Project
                      </div>
                    </Link>
                  </div>

                  <div className="box column">
                    <Link className="nav-link active" to="/user">
                      <div className="card">
                        <h3>
                          <i className="fa fa-user user-create"></i>
                        </h3>
                        <p></p>
                        Add User
                      </div>
                    </Link>
                  </div>

                  <div className="box column">
                    <Link className="nav-link active" to="/holiday">
                      <div className="card">
                        <h3>
                          <i className="fa fa-calendar"></i>
                        </h3>
                        <p></p>
                        Add Holiday
                      </div>
                    </Link>
                  </div>
                </div>
              </main>
            </article>
          )}
          {this.role !== "Project Manager" && (
            <article>
              <main role="main" className="inner cover home">
                <h1 className="cover-heading">
                  Welcome to VACO Binary Semantics Timesheet Portal!
                </h1>
              </main>
            </article>
          )}
          <Footer />
        </LoadingOverlay>
      </div>
    );
  }
}

export default Home;
