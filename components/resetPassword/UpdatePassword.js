import React, { Component } from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";
import tmsService from "../../services/tmsService";

import { LinkButtons, SubmitButtons, HeaderBar } from "../../custom";

const loading = {
  margin: "1em",
  fontSize: "24px"
};

const title = {
  pageTitle: "Update Password Screen"
};

class UpdatePassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      loadingUser: false,
      updated: false,
      error: false
    };
  }

  async componentDidMount() {
    this.setState({ loadingUser: true });

    const accessString = localStorage.getItem("JWT");
    if (accessString === null) {
      this.setState({
        loadingUser: false,
        error: true
      });
    } else {
      const {
        match: {
          params: { username }
        }
      } = this.props;
      try {
        const data = {
          params: {
            username
          },
          headers: { Authorization: `JWT ${accessString}` }
        };
        const response = await tmsService.updatePassword(data);
        this.setState({
          loadingUser: false,
          username: response.data.username,
          password: response.data.password,
          error: false
        });
      } catch (error) {
        console.log(error.response.data);
        this.setState({
          loadingUser: false,
          error: true
        });
      }
    }
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value
    });
  };

  updatePassword = async e => {
    const accessString = localStorage.getItem("JWT");
    if (accessString === null) {
      this.setState({
        loadingUser: false,
        error: true
      });
    } else {
      e.preventDefault();
      const { username, password } = this.state;
      try {
        const response = await tmsService.updatePassword(
          {
            username,
            password
          },
          {
            headers: { Authorization: `JWT ${accessString}` }
          }
        );
        if (response.data.message === "password updated") {
          this.setState({
            updated: true,
            error: false,
            loadingUser: false
          });
        }
      } catch (error) {
        console.log(error.response.data);
        this.setState({
          updated: false,
          error: true,
          loadingUser: false
        });
      }
    }
  };

  // eslint-disable-next-line consistent-return
  render() {
    const { username, password, updated, error, loadingUser } = this.state;

    if (error) {
      return (
        <div>
          <HeaderBar title={title} />
          <p style={loading}>
            There was a problem accessing your data. Please go login again.
          </p>
          <LinkButtons buttonText="Go Login" link="/login" />
        </div>
      );
    }
    if (loadingUser !== false) {
      return (
        <div>
          <HeaderBar title={title} />
          <p style={loading}>Loading user data...</p>
        </div>
      );
    }
    if (loadingUser === false && updated === true) {
      return <Redirect to={`/userProfile/${username}`} />;
    }
    if (loadingUser === false) {
      return (
        <div>
          <HeaderBar title={title} />
          <form className="profile-form" onSubmit={this.updatePassword}>
            <div
              className="wrap-input100 profile-input100 validate-input"
              data-validate="Password is required"
            >
              <input
                className="input100 profile-input"
                id="password"
                label="password"
                onChange={this.handleChange("password")}
                value={password}
                type="password"
                placeholder="Password"
              />
              <span className="focus-input100"></span>
              <span className="label-input100 profile-input-label"></span>
            </div>
            <SubmitButtons buttonText="Save Changes" />
          </form>
          <LinkButtons buttonText="Go Home" link="/" />
          <LinkButtons
            buttonText="Cancel Changes"
            link={`/userProfile/${username}`}
          />
        </div>
      );
    }
  }
}

UpdatePassword.propTypes = {
  // eslint-disable-next-line react/require-default-props
  match: PropTypes.shape({
    params: PropTypes.shape({
      username: PropTypes.string.isRequired
    })
  })
};

export default UpdatePassword;
