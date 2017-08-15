import React from 'react';
import ReactDOM from 'react-dom';

class Login extends React.Component {
  render() {
    if (this.props.loginStatement) {
      return <li>{this.props.loginStatement}</li>;
    } else {
      return null;
    }
  }
}

export default Login;
