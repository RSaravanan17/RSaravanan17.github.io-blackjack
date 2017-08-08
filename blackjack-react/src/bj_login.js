import React from 'react';
import ReactDOM from 'react-dom';

class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      correctLogin: false,
      sessId: null,
      currentUn: null,
      statement: null,
      fullStatement: "No statement returned."
    };

    this.passingSessId = this.passingSessId.bind(this);
  }

  passingSessId() {
    this.props.callbackSessId(this.state.sessId);
  }

  componentWillMount() {
    this.setState({
      sessId: 9999
    });
    let url = 'http://52.54.181.235:3000/api/login?username=' + this.props.un + '&password=' + this.props.pw + '&loggedIn=' + this.props.loggedIn;
    fetch(url).then(function(response) {
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
            statement: data.statement,
            sessId: data.sessId
          });
        }
        console.log("inside fetch");
        this.setState({
          fullStatement: this.state.correctLogin ? "Hello " + this.state.currentUn + "! " + this.state.statement : "Hello " + this.state.currentUn + "! Your password is invalid. Refresh the page and try again."
        });
      }).catch(function(error) {
          console.log('There has been a problem with your fetch operation: ' + error.message);
      });
  }

  componentDidMount() {
    this.props.loggedIn !== "true" ? this.passingSessId() : null;
  }

  render() {
    return <li>{this.state.fullStatement} Press 'Submit' again to begin playing.</li>;
  }
}

export default Login;
