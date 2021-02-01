import React from "react";
import LoginHelper from "../helpers/LoginHelper";

export default ComposedComponent => {
  return class AuthenticatedComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = this._getLoginState();
      if (!this.state.userLoggedIn) {
        this.props.history.push("/login");
      }
    }

    _getLoginState() {
      return {
        userLoggedIn: LoginHelper.isLoggedIn(),
        user: LoginHelper.user,
        jwt: LoginHelper.jwt
      };
    }

    componentDidMount() {
      this.changeListener = this._onChange.bind(this);
      LoginHelper.addChangeListener(this.changeListener);
    }

    _onChange() {
      this.setState(this._getLoginState());
    }

    componentWillUnmount() {
      LoginHelper.removeChangeListener(this.changeListener);
    }

    render() {
      return (
        <ComposedComponent
          {...this.props}
          user={this.state.user}
          jwt={this.state.jwt}
          userLoggedIn={this.state.userLoggedIn}
        />
      );
    }
  };
};
