import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";

const LinkButtons = ({ buttonText, link }) => (
  <Fragment>
    <Link to={link}>
      <Button variant="primary">{buttonText}</Button>
    </Link>
  </Fragment>
);

LinkButtons.propTypes = {
  buttonText: PropTypes.string,
  link: PropTypes.string
};

LinkButtons.defaultProps = {
  link: "/",
  buttonText: "Default Button Text"
};

export default LinkButtons;
