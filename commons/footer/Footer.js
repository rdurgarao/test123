import React, { Component } from "react";
import { Link } from "react-router-dom";

class Footer extends Component {
  render() {
    return (
      <footer className="page-footer">
        <div className="footer-copyright text-center py-3">
          © 2019 Copyright: <Link to="#">tms.com</Link>
        </div>
        <label className="tms-float-rt tms-version">
          Version: <span>0.0.2</span>
        </label>
      </footer>
    );
  }
}

export default Footer;
