import React from "react";
import PropTypes from "prop-types";
import Navbar from "react-bootstrap/Navbar";
import logo from "../assets/company_logo.png";

const HeaderBar = ({ title }) => (
  <div className="header">
    <Navbar bg="light" variant="dark">
      <Navbar.Brand href="/login">
        <img src={logo} alt="company_logo" className="navbar-brand logo" />
        {title.pageTitle || ""}
      </Navbar.Brand>
    </Navbar>
  </div>
);

HeaderBar.propTypes = {
  title: PropTypes.shape({
    pageTitle: PropTypes.string.isRequired
  })
};

HeaderBar.defaultProps = {
  title: {
    pageTitle: "Page Title Placeholder"
  }
};

export default HeaderBar;
