import React, { Component } from "react";

class ForbiddenError extends Component {
  render() {
    return (
      <div className="container py-5">
        <div className="row">
          <div className="col-md-2 text-center">
            <p>
              <i className="fa fa-exclamation-triangle fa-5x"></i>
              <br />
              Status Code: 403
            </p>
          </div>
          <div className="col-md-10">
            <h3>OPPSSS!!!! Sorry...</h3>
            <p>
              Sorry, your access is refused due to security reasons of our
              server and also our sensitive data.
              <br />
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default ForbiddenError;
