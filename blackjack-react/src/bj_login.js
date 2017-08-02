import React from 'react';
import ReactDOM from 'react-dom';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      correctLogin: false,
      currentUn: "a",
      statement: "b",
      fullStatement: "c"
    };
  }

  componentDidMount() {
    let url = 'http://52.54.181.235:3000/api/login?username=' + this.props.un + '&password=' + this.props.pw + '&loggedIn=' + this.props.loggedIn === "true";
    console.log("inside componentDidMount and before fetch");
    fetch(url/*, {
      headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }
    }*/).then(function(response) {
      console.log(response);
      if(response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    }).then(function(data) {
        if (data.statement !== "") {
          this.setState({
            correctLogin: true,
            currentUn: data.user,
            statement: data.statement
          });
        }
        console.log("inside fetch");
        this.setState({
          fullStatement: this.state.correctLogin ? "Hello " + this.state.currentUn + "! " + this.state.statement : "Hello " + this.state.currentUn + "! Your password is invalid. Refresh the page and try again."
        });
      }).catch(function(error) {
          console.log('There has been a problem with your fetch operation: ' + error.message);
      });
    console.log("inside componentDidMount and after fetch");
  }

  render() {
    return <li>{this.state.fullStatement}</li>;
  }
}

export default Login;
