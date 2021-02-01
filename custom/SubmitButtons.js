import React, { Fragment } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";

const SubmitButtons = ({ buttonText }) => (
  <Fragment>
    <Button type="submit" variant="primary">
      {buttonText}
    </Button>
  </Fragment>
);

SubmitButtons.propTypes = {
  buttonText: PropTypes.string.isRequired
};

export default SubmitButtons;
